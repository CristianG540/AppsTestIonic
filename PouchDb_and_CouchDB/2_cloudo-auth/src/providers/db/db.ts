import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import PouchDB from 'pouchdb';

@Injectable()
export class DbProvider {

  private _db: any;
  private _remoteDB: any;

  constructor(
    public evts: Events
  ) {
    console.log('Hello DbProvider Provider');
  }

  public init(urlDB: string): void {
    this._db = new PouchDB('cloudo');
    this._remoteDB = new PouchDB(urlDB);
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

    this.evts.publish('db:init');
  }

  public get db() : any {
    if(this._db){
      return this._db;
    }else{
      console.log("No se ha iniciado la base de datos");
      return null;
    }
  }

  public destroyDB(): void{
    this._db.destroy().then(() => {
      console.log("database removed");
    });
  }


}
