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
   * http://docs.couchdb.org/en/2.0.0/couchapp/views/pagination.html
   */
  private skipByCat:number = 0;


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

      PouchDB.replicate(this._remoteDB, this._db, replicationOptions)
        .on("change", change => {
          console.log(
            "Prods-replication was changed",
            change
          );
        })
        .on("paused", info => {
          console.log(
            "Prods-replication was paused,usually because of a lost connection",
            info
          );
        })
        .on('active', () => {
          console.log("Prods-replication was resumed");
        })
        .on("denied", err => {
          console.log(
            "Prods-a document failed to replicate (e.g. due to permissions)",
            err
          );
        })
        .on("error", err => {
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

  /**
   * Esta funcion es la que rcupera los productos del infinite scroll
   * de la pagina principal
   */
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
   * utlizo una vista oara hacer un map/reduce "https://stackoverflow.com/questions/24909317/how-to-write-wildcard-search-query-in-couchdb-where-name-like-a"
   * Para buscar los productos por categoria, tener muy encuenta que para
   * usar este query antes hay q crear la vista
   * @param {string} categoria
   * @returns {*}
   * @memberof ProductosProvider
   */
  public fetchNextPagByCategoria(categoria : string): any {

    categoria = categoria.toLocaleLowerCase();
    // create a design doc
    var ddoc = {
      _id: '_design/categoriaview',
      views: {
        producto_categoria: {
          map : function (doc) {
            if(doc.categoria && parseInt(doc.existencias)>0){
              emit(doc.categoria.toLowerCase(), null);
            }
          }.toString() // The .toString() at the end of the map function is necessary to prep the object for becoming valid JSON.
        }
      }
    };

    // save the design doc
    return this._db.put(ddoc).catch(err => {
      if (err.name !== 'conflict') {
        throw err;
      }
      // ignore if doc already exists
    }).then( () => {
      return this._db.query('categoriaview/producto_categoria', {
        startkey     : categoria,
        endkey       : categoria+"\uffff",
        skip         : this.skipByCat,
        limit        : this.cantProdsPag,
        include_docs : true
      });
    }).then(res => {

      if (res && res.rows.length > 0) {
        this.skipByCat += this.cantProdsPag;
        let prods: Producto[] = _.map(res.rows, (v: any, k: number) => {
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
            v.doc.existencias,
            precio,
            v.doc._rev
          );
        });
        this._prodsByCat.push(...prods );
      }
      return res;
    });

  }

  public fetchProdsByids( ids: any ): Promise<any>{

    return this._db.allDocs({
      include_docs : true,
      keys         : ids
    }).then(res => {

      console.log("all_docs ids", res)
      if (res && res.rows.length > 0) {
        return _.map(res.rows, (v: any) => {
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

  /**
   *
   * este metodo es el encargado de hacer funcionar la busqueda de los productos
   * mediante el sku
   *
   * @param {string} query
   * @memberof ProductosProvider
   */
  public searchAutocomplete(query: string): Promise<any> {
    /**
     * Para mas informacion sobre este plugin la pagina principal:
     * https://github.com/pouchdb-community/pouchdb-quick-search
     */
    query = query.toUpperCase();
    return this._db.allDocs({
      include_docs : true,
      startkey     : query,
      endkey       : query+"\uffff",
      limit        : 30
    }).then(res => {

      if (res && res.rows.length > 0) {
        return _.map(res.rows, (v: any) => {
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

    });

  }

  public updateQuantity(carItems: CarItem[] ) : Promise<any> {

    let prodsId = _.map(carItems, "_id");
    return this.fetchProdsByids(prodsId)
    .then((prods: Producto[])=>{
      let prodsToUpdate = _.map(prods, (prod: Producto)=>{
        let itemId = Config.binarySearch(carItems, '_id', prod._id);
        prod.existencias -= carItems[itemId].cantidad;
        return prod;
      });
      return prodsToUpdate;
    })
    .then( prodsToUpdate => {
      return this._db.bulkDocs(prodsToUpdate)
    })

  }

  /**
   * Lo siguiente lo hago para resetear las variables que almacenan los datos
   * al mostrar los productos por categoria, si no las reseteo los productos solo
   * se apiñarian uno tras otro y continuarian desde el ultimo producto paginado
   */
  public resetProdsByCat(): void {
    this._prodsByCat = [];
    this.skipByCat = 0;
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
