import { Injectable, ApplicationRef } from "@angular/core";
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import PouchDB from 'pouchdb';
import _ from 'lodash';

//Providers
import { Config as cg } from "../config/config";
//Models
import { Orden } from './models/orden';
import { DbProvider } from "../db/db";

@Injectable()
export class OrdenProvider {

  private _db: any;
  private _ordenes: Orden[] = [];

  constructor(
    private appRef: ApplicationRef, // lo uso para actualizar la UI cuando se hace un cambio fiera de la ngZone
    public dbServ: DbProvider,
    private evts: Events,
    private util : cg,
    private http: Http,
    private storage: Storage
  ) {
    this.evts.subscribe('db:init', () => {
      this.initDB();
    });

    /** *************** Manejo de el estado de la ui    ********************** */
    this.evts.subscribe('orden:changed', (doc: Orden) => {
      this._onUpdatedOrInserted(doc);
    });
    this.evts.subscribe('orden:deleted', (doc: Orden) => {
      /**
       * Para que esto funcione, se deben eliminar los datos en couchdb
       * agregando "_deleted" : true al documento, osea eliminando el doc
       * usando el api de modificar de couch, no la de eliminar
       */
      this._onDeleted(doc._id);
    });
  }

  public initDB(){
    let loading = this.util.showLoading();
    this._db = this.dbServ.db;
    this.fetchAndRenderAllDocs()
      .then( res => {
        loading.dismiss()
      })
      .catch( err => this.util.errorHandler(err.message, err, loading) );
  }

  public fetchAndRenderAllDocs(): Promise<any> {

    return this._db.allDocs({
      include_docs: true
    }).then( res => {
      this._ordenes = res.rows.map((row) => {
        return row.doc;
      });
      console.log("_all_docs ordenes pouchDB", res)
      return res;
    });

  }

  public pushItem(orden: Orden) : Promise<any>{
    return this._db.put(orden);
  }

  public destroyDB(): void{
    this._db.destroy().then(() => {
      this._ordenes = [];
      console.log("database removed");
    })
    .catch(console.log.bind(console));
  }


  public sendOrdersSap(): any {

    this.storage.get('josefa-token').then((token: string) => {

      let options:RequestOptions = cg.JOSEFA_OPTIONS('Bearer ' + token);
      let url: string = cg.JOSEFA_URL+'/sap';

      return this.http.get(url, options)
      .map( (res: Response) => {
        return res.json();
      }).subscribe(
        res => {
          console.log("Info JOSEFA", res);
        },
        err => {
          console.error("err JOSEFA", err);
        }
      );

    });

  }

  /** *************** Manejo de el estado de la ui    ********************** */

  private _onDeleted(id: string): void {
    let index: number = cg.binarySearch(
      this._ordenes,
      '_id',
      id
    );
    let doc = this._ordenes[index];
    if (doc && doc._id == id) {
      this._ordenes.splice(index, 1);
    }
    /**
     * Actualiza la interfaz de usuario
     * https://angular.io/api/core/ApplicationRef
     * https://goo.gl/PDi6iM
     */
    this.appRef.tick();
  }

  private _onUpdatedOrInserted(newDoc: Orden): void {
    let index: number = cg.binarySearch(
      this._ordenes,
      '_id',
      newDoc._id
    );
    let doc = this._ordenes[index];
    if (doc && doc._id == newDoc._id) { // update
      this._ordenes[index] = newDoc;
    } else { // insert
      this._ordenes.splice(index, 0, newDoc);
    }
    this.appRef.tick();
  }
  /** *********** Fin Manejo de el estado de la ui    ********************** */


  ///////////////////////// GETTERS and SETTERS ////////////////////

  /**
   * Getter que me trae todas los ordenes
   *
   * @readonly
   * @type {Orden[]}
   * @memberof OrdenProvider
   */
  public get ordenes() : Orden[] {
    return JSON.parse(JSON.stringify( _.orderBy(this._ordenes, '_id', 'desc') ));
  }

  /**
   * Getter que me trae las ordenes pendientes
   *
   * @readonly
   * @type {Orden[]}
   * @memberof OrdenProvider
   */
  public get ordenesPendientes() : Orden[] {
    return JSON.parse( JSON.stringify( _.filter(this._ordenes, ['estado', false]) ) );
  }


}
