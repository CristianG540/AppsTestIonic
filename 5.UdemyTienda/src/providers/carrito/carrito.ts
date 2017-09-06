import { Injectable } from '@angular/core';
import _ from 'lodash';
import PouchDB from 'pouchdb';

//Providers
import { Config as cg } from "../config/config";

//Models
import { Producto } from "../productos/models/producto";
import { CarItem } from "./models/carItem";


@Injectable()
export class CarritoProvider {

  private _db: any;
  private _carItems: CarItem[] = [];

  constructor(
  ) {
    if(!this._db){
      this._db = new PouchDB('cart');
    }
  }

  public fetchAndRenderAllDocs(): Promise<any> {
    return this._db.allDocs({
      include_docs: true
    }).then( res => {
      this._carItems = res.rows.map((row) => {
        return new CarItem(
          row.doc._id,
          row.doc.producto,
          row.doc.cantidad,
          row.doc._rev
        );
      });

      // FALTA HACER ESTO, SEGUIR AQUI
      this._reactToChanges();
      resolve();

    }).catch((error) => {

      reject(error);

    });
  }

  public get prods() : Producto[] {
    return JSON.parse(JSON.stringify(this._prods));
  }

  public pushProd(prod: Producto) : boolean{
    /**
     * hago una busqueda binaria apra saber si el producto esta en el carrito
     * si ya esta en el carrito, le informo al usuario q no lo puede agregar
     */
    let indexPrevProd: number = cg.binarySearch(this._prods, '_id', prod._id);
    let prevProd: Producto = this._prods[indexPrevProd];
    if( prevProd && prevProd._id == prod._id ){
      return false;
    }else{
      /**
       * Lo que hago aqui es usar la funcion "sortedLastIndexBy" de lodash
       * mas info aqui: "https://lodash.com/docs/4.17.4#sortedLastIndexBy"
       * con este codigo lo q hago conservar el orden de los productos cada
       * vez que los voy ingresando, asi a la hora de leerlos ya estan ordenados
       * y la busqueda binaria funciona full HD
       */
      let i = _.sortedLastIndexBy(this._prods, prod, val => val._id );
      this._prods.splice(i, 0, prod);

      console.log('prods carrito', this._prods);
      return true;
    }

  }

}
