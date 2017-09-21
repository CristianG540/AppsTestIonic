import { Injectable, ApplicationRef } from "@angular/core";
import { Events } from 'ionic-angular';
import PouchDB from 'pouchdb';
import _ from 'lodash';

//Providers
import { Config as cg } from "../config/config";
//Models
import { Orden } from './models/orden';

@Injectable()
export class OrdenProvider {

  private _db: any;
  private _ordenes: Orden[] = [];

  constructor(
    private appRef: ApplicationRef, // lo uso para actualizar la UI cuando se hace un cambio fiera de la ngZone
    private evts: Events,
    private util : cg
  ) {
    if(!this._db){
      this.initDB();
    }
  }

  public initDB(){
    this.util.showLoading();
    this._db = new PouchDB('ordenes');
    this.fetchAndRenderAllDocs()
      .then( res => {
        this._reactToChanges()
        this.util.loading.dismiss()
      })
      .catch(console.log.bind(console));
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
      this.initDB();
    })
    .catch(console.log.bind(console));
  }

  /** *************** Manejo de el estado de la ui    ********************** */
  private _reactToChanges(): void {
    this._db.changes({
      live: true,
      since: 'now',
      include_docs: true
    })
    .on( 'change', change => {

      if (change.deleted) {
        // change.id holds the deleted id
        this._onDeleted(change.id);
      } else { // updated/inserted
        // change.doc holds the new doc
        this._onUpdatedOrInserted(change.doc);
      }
      /**
       * Actualiza la interfaz de usuario
       * https://angular.io/api/core/ApplicationRef
       * https://goo.gl/PDi6iM
       */
      this.appRef.tick();
      //lanzo un evento para informar quehubo un cambio en las ordenes
      this.evts.publish('orden:change');
    })
    .on( 'error', console.log.bind(console));
  }

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

}
