import { Injectable, ApplicationRef  } from '@angular/core';
import { Events } from 'ionic-angular';

import { Todo } from './models/todo';
import { DbProvider } from '../db/db';

@Injectable()
export class TodosProvider {

  private db: any;
  private _data: Todo[] = [];

  constructor(
    public dbServ: DbProvider,
    private appRef: ApplicationRef, // lo uso para actualizar la UI cuando se hace un cambio fiera de la ngZone
    public evts: Events
  ) {
    this.evts.subscribe('db:init', () => {
      this.db = this.dbServ.db;
    });
  }

  public getTodos(): Promise<any> {

    if (this._data.length > 0) {
      return Promise.resolve();
    }

    return new Promise( (resolve, reject) => {

      this.dbServ.db.allDocs({

        include_docs: true

      }).then( result => {

        this._data = result.rows.map((row) => {
          return row.doc;
        });
        this._reactToChanges();
        resolve();

      }).catch((error) => {

        reject(error);

      });

    });
  }

  private _reactToChanges(): void {
    this.db.changes({
      live: true,
      since: 'now',
      include_docs: true
    })
    .on( 'change', change => this.handleChange(change) )
    .on( 'error', function (err) {
      console.log("totally unhandled error (shouldn't happen)", err);
    });
  }

  public createTodo(todo): any{
    this.db.post(todo);
  }

  public updateTodo(todo): any{
    this.db.put(todo).catch((err) => {
      console.log(err);
    });
  }

  public deleteTodo(todo): any{
    this.db.remove(todo).catch((err) => {
      console.log(err);
    });
  }

  public handleChange(change): void {
    console.warn("cambio", change )
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
  }

  /* ********************************** START *************************************** */
  // Gracias a https://pouchdb.com/2015/02/28/efficiently-managing-ui-state-in-pouchdb.html
  private _binarySearch(arr, docId: number): number {
    let low: number = 0;
    let high:number = arr.length;
    let mid:number;
    while (low < high) {
      mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
      arr[mid]._id < docId ? low = mid + 1 : high = mid
    }
    return low;
  }

  private _onDeleted(id: number): void {
    let index: number = this._binarySearch(this._data, id);
    let doc = this._data[index];
    if (doc && doc._id == id) {
      this._data.splice(index, 1);
    }
  }

  private _onUpdatedOrInserted(newDoc): void {
    let index = this._binarySearch(this._data, newDoc._id);
    let doc = this._data[index];
    if (doc && doc._id == newDoc._id) { // update
      this._data[index] = newDoc;
    } else { // insert
      this._data.splice(index, 0, newDoc);
    }
  }

  /* **************************** END ************************************** */

  public get data() : Todo[] {
    return JSON.parse(JSON.stringify(this._data));
  }

  public set data(data: Todo[]) {
    this._data = data;
  }

}
