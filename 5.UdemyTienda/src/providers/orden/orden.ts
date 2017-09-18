import { Orden } from './models/orden';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import PouchDB from 'pouchdb';

//Providers
import { Config as cg } from "../config/config";


@Injectable()
export class OrdenProvider {

  private _db: any;
  private _ordenes: Orden[] = [];

  constructor(
    public evts: Events,
    private util : cg
  ) {
    if(!this._db){
      this._db = new PouchDB('ordenes');
    }
  }

  public fetchAndRenderAllDocs(): Promise<any> {

    return this._db.allDocs({
      include_docs: true
    }).then( res => {
      this._ordenes = res.rows.map((row) => {
        return new Orden(
          row.doc._id,
          row.doc.nitCliente,
          row.doc.observaciones,
          row.doc.items,
          row.doc.total,
          row.doc._rev
        );
      });
      console.log("_all_docs ordenes pouchDB", res)
      return res;
    });

  }

  public pushItem(orden: Orden) : Promise<any>{
    return this._db.put(orden);
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
      //lanzo este evento para actualizar la pagina cuando un item
      //del carrito se elimina
      this.evts.publish('orden:change');
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
    //lanzo este evento para actualizar la pagina cuando un item
    //del carrito se elimina
    this.evts.publish('orden:change');
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
    return JSON.parse(JSON.stringify(this._ordenes));
  }

}
