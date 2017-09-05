import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class Config {

  /* **************************** Cosas de CouchDB  *************************** */
  // Url base de la BD en couch
  static readonly CDB_URL: string = 'http://127.0.0.1:5984/productos';

  //Headers y otras opciones basicas para las peticiones a couchdb mdiante angular http
  //el header de autotizacion creoq se puede hacer de una forma mejor
  static CDB_OPTIONS(): RequestOptions{
    let headers = new Headers({
      'Accept'       : 'application/json',
      'Content-Type' : 'application/json',
      'Authorization': 'Basic ' + btoa('admin:admin')
    });
    let options = new RequestOptions({
      headers: headers
    });
    return options;
  }
  /* ************************* Fin Cosas de CouchDB *****************************/

}
