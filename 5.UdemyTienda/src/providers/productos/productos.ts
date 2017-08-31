import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Producto } from './models/producto';
import { Config } from '../config/config'

@Injectable()
export class ProductosProvider {

  private _prods: Producto[] = [];

  /* parametros usados por couchdb para la paginacion de los productos */
  /* mas info: https://pouchdb.com/2014/04/14/pagination-strategies-with-pouchdb.html */
  private cantProdsPag:string = '5';
  private skip = '0';
  private startkey = '""'; // CouchDb solo recibe un string si esta entre comillas

  constructor(
    public http: Http
  ) {
  }

  public recuperarPagSgte(): Promise<any> {
    let options:RequestOptions = Config.CDB_OPTIONS();
    let params = new URLSearchParams();
    params.set('include_docs', 'true');
    params.set('limit', this.cantProdsPag);
    params.set('skip' , this.skip);
    params.set('startkey', this.startkey);
    options.params = params;

    return this.http.get(Config.CDB_URL+'/_all_docs', options)
      .map( (res: Response) => {
        return res.json();
      })
      .toPromise()
      .then(res => {
        if (res && res.rows.length > 0) {
          this.startkey = `"${res.rows[res.rows.length - 1].key}"`;
          this.skip = '1';
          let prods: Producto[] = _.map(res.rows, (v: any, k: number) => {
            return new Producto(
              v.doc._id,
              v.doc.titulo,
              v.doc.aplicacion,
              v.doc.imagen,
              v.doc.categoria,
              v.doc.marcas,
              v.doc.unidad,
              parseInt(v.doc.existencias),
              v.doc._rev
            );
          });
          this._prods.push(...prods );
        }
        console.log(this._prods);
        return res;
      });
  }

  public get prods() : Producto[] {
    return JSON.parse(JSON.stringify(this._prods));
  }


}
