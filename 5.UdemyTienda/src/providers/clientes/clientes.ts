import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import _ from 'lodash';
import PouchDB from 'pouchdb';
import 'rxjs/add/operator/map';

//Providers
import { Config as cg } from "../config/config";

//Models
import { Cliente } from "./models/cliente";

@Injectable()
export class ClientesProvider {

  private _db: any;
  private _remoteDB: any;
  private _clientes: Cliente[] = [];

  constructor(
    public http: Http,
    private util : cg
  ) {
    PouchDB.plugin(require('pouchdb-quick-search'))
    if(!this._db){
      //this.util.showLoading();
      this._db = new PouchDB('cliente');
      this._remoteDB = new PouchDB('http://localhost:5984/clientes');
      let replicationOptions = {
        live: true,
        retry: true
      };
      this._db.sync(this._remoteDB, replicationOptions)
      /*.on('change', function (change) {
        console.log("yo, something changed!", change);
      })*/
      .on('paused', function (info) {
        console.log("replication was paused,usually because of a lost connection", info);
      }).on('active', function (info) {
        console.log("replication was resumed", info);
      }).on('denied', function (err) {
        console.log("a document failed to replicate (e.g. due to permissions)", err);
      }).on('error', function (err) {
        console.log("totally unhandled error (shouldn't happen)", err);
      });

      this._db.search({
        query: 'DESVARE',
        fields: ['nombre_cliente'],
        include_docs: true,
        highlighting: true,
        build: true
      }).then(res => {
        console.log('rama',res)
      }).catch(console.log.bind(console))

    }
  }



  /** *************** Manejo de el estado de la ui    ********************** */

  public fetchAndRenderAllDocs(): Promise<any> {
    return this._db.allDocs({
      include_docs: true
    }).then( res => {
      this._clientes = res.rows.map((row) => {
        return new Cliente(
          row.doc._id,
          row.doc.uid_asesor,
          row.doc.asesor,
          row.doc.ciudad,
          row.doc.direccion,
          row.doc.nombre_cliente,
          row.doc._rev
        );
      });
      console.log("_all_docs clientes pouchDB", res)
      return res;
    });
  }

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
        this._onUpdatedOrInserted(new Cliente(
          change.doc._id,
          change.doc.uid_asesor,
          change.doc.asesor,
          change.doc.ciudad,
          change.doc.direccion,
          change.doc.nombre_cliente,
          change.doc._rev
        ));
      }
      console.log("clientes change", this._clientes);
    })
    .on( 'error', console.log.bind(console));
  }

  private _onDeleted(id: string): void {
    let index: number = cg.binarySearch(
      this._clientes,
      '_id',
      id
    );
    let doc = this._clientes[index];
    if (doc && doc._id == id) {
      this._clientes.splice(index, 1);
    }
  }

  private _onUpdatedOrInserted(newDoc: Cliente): void {
    let index: number = cg.binarySearch(
      this._clientes,
      '_id',
      newDoc._id
    );
    let doc = this._clientes[index];
    if (doc && doc._id == newDoc._id) { // update
      this._clientes[index] = newDoc;
    } else { // insert
      this._clientes.splice(index, 0, newDoc);
    }
  }
  /** *********** Fin Manejo de el estado de la ui    ********************** */


}
