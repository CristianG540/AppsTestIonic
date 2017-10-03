import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import _ from 'lodash';
import PouchDB from 'pouchdb';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Producto } from './models/producto';
import { Categoria } from './models/categoria';
import { Config } from '../config/config'
import { CarItem } from "../carrito/models/carItem";

// Info del por que hago esto https://github.com/domiSchenk/PouchDB-typescript-definitions/issues/4
declare var emit:any;

@Injectable()
export class ProductosProvider {

  private _db: any;
  private _remoteDB: any;
  private _prods: Producto[] = [];
  private _categorias: Categoria[] = [];
  private _prodsByCat: Producto[] = [];

  /* parametros usados por couchdb para la paginacion de los productos */
  /* mas info: https://pouchdb.com/2014/04/14/pagination-strategies-with-pouchdb.html */
  private cantProdsPag:number = 10;
  private skip:number = 0;
  /**
   * este starkey lo uso para paginar los resultados de "_all_docs"
   */
  private startkey:string = '';
  /**
   * Este startkey es diferente al anterior, tambien lo uso para paginar los resultados
   * pero a diferencia del anterior este lo envio por POST en el "_find" de COUCHDB
   * para usar los querys de mango
   */
  private startkeyByCat = null;


  constructor(
    public http: Http
  ) {
    if (!this._db) {
      this._db = new PouchDB("productos");
      this._remoteDB = new PouchDB(Config.CDB_URL, {
        auth: {
          username: "admin",
          password: "admin"
        }
      });
      let replicationOptions = {
        live: true,
        retry: true
      };
      this._db.replicate.from(this._remoteDB, replicationOptions)
        .on("paused", function(info) {
          console.log(
            "Prods-replication was paused,usually because of a lost connection",
            info
          );
        })
        .on("active", function(info) {
          console.log("Prods-replication was resumed", info);
        })
        .on("denied", function(err) {
          console.log(
            "Prods-a document failed to replicate (e.g. due to permissions)",
            err
          );
        })
        .on("error", function(err) {
          console.log("Prods-totally unhandled error (shouldn't happen)", err);
        });
    }
  }

  /**
   * Basandome en este articulo "http://acdcjunior.github.io/querying-couchdb-pouchdb-map-reduce-group-by-example.html"
   * creo una vista map/reduce en couchdb que me agrupa los productos por categoria y me cuenta las
   * cantidades de productos por cada categoria
   *
   * @returns {Promise<any>}
   * @memberof ProductosProvider
   */
  public fetchCategorias(): Promise<any> {
    // create a design doc
    var ddoc = {
      _id: '_design/categoriaview',
      views: {
        categoriaview: {
          map : function (doc) {
            var car = doc.categoria.split(",")
            if(parseInt(doc.existencias)>0){
              emit(car[0], 1);
            }
          }.toString() // The .toString() at the end of the map function is necessary to prep the object for becoming valid JSON.
        }
      }
    }

    // save the design doc
    return this._db.put(ddoc).catch(err => {
      if (err.name !== 'conflict') {
        throw err;
      }
      // ignore if doc already exists
    }).then( () => {
      return this._db.query('categoriaview', {
        group_level : 1,
        group       : true
      });
    }).then(res => {
      if (res && res.rows.length > 0) {
        this._categorias = _.map(res.rows, (v: any, k: number) => {
          return new Categoria(
            v.key,
            v.value
          );
        });
      }
      return this._categorias;
    })

  }

  public recuperarPagSgte(): Promise<any> {
    return this._db.allDocs({
        include_docs : true,
        limit        : this.cantProdsPag,
        skip         : this.skip,
        startkey     : this.startkey
      }).then(res => {
        if (res && res.rows.length > 0) {
          this.startkey = res.rows[res.rows.length - 1].key;
          this.skip = 1;
          let prods: Producto[] = _.map(res.rows, (v: any, k: number) => {
            // El precio llega en un formato como "$20.200" entonces lo saneo para que quede "20200"
            let precio = v.doc.precio.toString().replace('.','');
            precio = parseInt( (precio[0]=='$') ? precio.substring(1) : precio );
            return new Producto(
              v.doc._id,
              v.doc.titulo,
              v.doc.aplicacion,
              v.doc.imagen,
              v.doc.categoria,
              v.doc.marcas,
              v.doc.unidad,
              parseInt(v.doc.existencias),
              precio,
              v.doc._rev
            );
          });
          this._prods.push(...prods );
        }
        console.log("prodsProvider-recuperarPagSgte",this._prods);
        return res;
      })
  }

  /**
   * utlizo el api find de couchDB "http://docs.couchdb.org/en/stable/api/database/find.html#api-db-find-index"
   * Para buscar los productos por categoria, tener muy encuenta que para usar este query antes hay q crear el
   * indice de mango en couch que seria algo asi como
   * {
        "index": {
          "fields": [
            "_id",
            "categoria",
            "existencias"
          ]
        },
        "ddoc" : "cat_exist",
        "type": "json"
      }
   *
   * @param {string} categoria
   * @returns {*}
   * @memberof ProductosProvider
   */
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
        "limit": this.cantProdsPag,
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
        let prods: Producto[] = _.map(res.docs, (v: any, k: number) => {
          let precio =  parseInt( (<string>v.precio).replace('.','').substring(1) );
          return new Producto(
            v._id,
            v.titulo,
            v.aplicacion,
            v.imagen,
            v.categoria,
            v.marcas,
            v.unidad,
            v.existencias,
            precio,
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
          let precio = v.doc.precio.toString().replace('.','');
          precio = parseInt( (precio[0]=='$') ? precio.substring(1) : precio );
          return new Producto(
            v.doc._id,
            v.doc.titulo,
            v.doc.aplicacion,
            v.doc.imagen,
            v.doc.categoria,
            v.doc.marcas,
            v.doc.unidad,
            parseInt(v.doc.existencias),
            precio,
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
          let precio = v.doc.precio.toString().replace('.','');
          precio = parseInt( (precio[0]=='$') ? precio.substring(1) : precio );
          return new Producto(
            v.doc._id,
            v.doc.titulo,
            v.doc.aplicacion,
            v.doc.imagen,
            v.doc.categoria,
            v.doc.marcas,
            v.doc.unidad,
            parseInt(v.doc.existencias),
            precio,
            v.doc._rev
          );
        }) ;
      }else{
        return [];
      }

    })
  }

  public updateQuantity(carItems: CarItem[] ) : Promise<any> {

    let options:RequestOptions = Config.CDB_OPTIONS();
    let url: string = Config.CDB_URL+'/_bulk_docs';

    let prodsId = _.map(carItems, "_id");
    return this.fetchProdsByids(prodsId)
      .then((prods: Producto[])=>{

        let prodsToUpdate = _.map(prods, (prod: Producto)=>{
          let itemId = Config.binarySearch(carItems, '_id', prod._id);
          prod.existencias -= carItems[itemId].cantidad;
          return prod;
        })

        return this.http.post(
          url,
          JSON.stringify({
            docs : prodsToUpdate
          }),
          options
        )
        .map( (res: Response) => {
          return res.json();
        })
        .toPromise()

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

   /**
   * ESTA MIERDA LA TENGO QUITAR SEGURO SE PUEDE HACER MEJOR !!!!!!!
   * Lo siguiente lo hago para resetear las variables que almacenan los datos
   * al mostrar los productos por categoria, si no las reseteo los productos solo
   * se apiñarian uno tras otro y continuarian desde el ultimo producto paginado
   */
  public resetProds(): void {
    this._prods= [];
    this.startkey = '';
    this.skip = 0;
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
