import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Producto } from './models/producto';
import { Categoria } from './models/categoria';
import { Config } from '../config/config'

@Injectable()
export class ProductosProvider {

  private _prods: Producto[] = [];
  private _categorias: Categoria[] = [];
  private _prodsByCat: Producto[] = [];

  /* parametros usados por couchdb para la paginacion de los productos */
  /* mas info: https://pouchdb.com/2014/04/14/pagination-strategies-with-pouchdb.html */
  private cantProdsPag:string = '10';
  private skip:string = '0';
  /**
   * este starkey lo uso para paginar los resultados de "_all_docs"
   */
  private startkey:string = '""'; // CouchDb solo recibe un string si esta entre comillas
  /**
   * Este startkey es diferente al anterior, tambien lo uso para paginar los resultados
   * pero a diferencia del anterior este lo envio por POST en el "_find" de COUCHDB
   * para usar los querys de mango
   */
  private startkeyByCat = null;


  constructor(
    public http: Http
  ) {
  }

  public fetchCategorias(): Promise<any> {
    let options:RequestOptions = Config.CDB_OPTIONS();
    let params = new URLSearchParams();
    params.set('group_level', '1');
    params.set('group', 'true');
    options.params = params;
    let url: string = Config.CDB_URL+'/_design/categoriaview/_view/categoriaview';

    return this.http.get(url, options)
    .map( (res: Response) => {
      return res.json();
    })
    .toPromise()
    .then(res => {
      if (res && res.rows.length > 0) {
        this._categorias = _.map(res.rows, (v: any, k: number) => {
          return new Categoria(
            v.key,
            v.value
          );
        });
      }
      return this._categorias;
    });
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
        console.log("prodsProvider-recuperarPagSgte",this._prods);
        return res;
      });
  }

  public fetchNextPagByCategoria(categoria : string): any {
    let options:RequestOptions = Config.CDB_OPTIONS();
    return this.http.post(
      Config.CDB_URL+'/_find',
      JSON.stringify({
        "selector": {
          "_id": {
            "$gt": this.startkeyByCat
          },
          "categoria": {
            "$regex": "^"+categoria
          },
          "existencias": {
            "$gt": "0.00"
          }
        },
        "sort": [
          { "_id": "asc" }
        ],
        "limit": parseInt(this.cantProdsPag),
        "use_index": "cat_exist"
      }),
      options
    )
    .map( (res: Response) => {
      return res.json();
    })
    .toPromise()
    .then(res => {
      if (res && res.docs.length > 0) {
        this.startkeyByCat = res.docs[res.docs.length - 1]._id;
        let prods: Producto[] = _.map(res.docs, (v: Producto, k: number) => {
          return new Producto(
            v._id,
            v.titulo,
            v.aplicacion,
            v.imagen,
            v.categoria,
            v.marcas,
            v.unidad,
            v.existencias,
            v._rev
          );
        });
        this._prodsByCat.push(...prods );
      }
      return res;
    });
  }

  public fetchProdsByids( ids: any ): Promise<any>{
    let options:RequestOptions = Config.CDB_OPTIONS();
    let params = new URLSearchParams();
    options.params = params;
    params.set('include_docs', 'true');
    return this.http.post(
      Config.CDB_URL+'/_all_docs',
      JSON.stringify({
        "keys" : ids
      }),
      options
    )
    .map(res=>{
      let d = res.json();
      console.log("all_docs ids",d)
      if (d && d.rows.length > 0) {
        return _.map(d.rows, (v: any) => {
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
        }) ;
      }else{
        return [];
      }

    })
    .toPromise()

  }

  public searchAutocomplete(query: string): Observable<Producto[]> {
    /**
     * Para mas informacion sobre este plugin la pagina principal:
     * https://github.com/pouchdb-community/pouchdb-quick-search
     */
    query = query.toUpperCase();
    let options:RequestOptions = Config.CDB_OPTIONS();
    let params = new URLSearchParams();
    options.params = params;
    params.set('include_docs', 'true');
    params.set('startkey', `"${query}"`);
    params.set('endkey', `"${query+"\uffff"}"`);
    params.set('limit', '30');
    return this.http.get(Config.CDB_URL+'/_all_docs',options)
    .map(res=>{
      let d = res.json();
      if (d && d.rows.length > 0) {
        return _.map(d.rows, (v: any) => {
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
        }) ;
      }else{
        return [];
      }

    })
  }

  /**
   * Lo siguiente lo hago para resetear las variables que almacenan los datos
   * al mostrar los productos por categoria, si no las reseteo los productos solo
   * se apiñarian uno tras otro y continuarian desde el ultimo producto paginado
   */
  public resetProdsByCat(): void {
    this._prodsByCat = [];
    this.startkeyByCat = null;
  }

  public get prods() : Producto[] {
    return JSON.parse(JSON.stringify(this._prods));
  }

  public get prodsByCat() : Producto[] {
    return JSON.parse(JSON.stringify(this._prodsByCat));
  }

  public set prodsByCat(v : Producto[]) {
    this._prodsByCat = v;
  }

  public get categorias() : Categoria[] {
    return JSON.parse(JSON.stringify(this._categorias));
  }

}
