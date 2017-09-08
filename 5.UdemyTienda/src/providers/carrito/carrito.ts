import { Injectable } from '@angular/core';
import _ from 'lodash';
import PouchDB from 'pouchdb';

//Providers
import { Config as cg } from "../config/config";

//Models
import { Producto } from "../productos/models/producto";
import { CarItem } from "./models/carItem";
import { ModalController, Modal } from "ionic-angular";


@Injectable()
export class CarritoProvider {

  private _db: any;
  private _carItems: CarItem[] = [];

  constructor(
    private modalCtrl : ModalController
  ) {
    if(!this._db){
      this._db = new PouchDB('cart');
      this.fetchAndRenderAllDocs()
        .catch(console.log.bind(console));
    }
  }

  public fetchAndRenderAllDocs(): Promise<any> {

    return this._db.allDocs({
      include_docs: true
    }).then( res => {
      this._carItems = res.rows.map((row) => {
        return new CarItem(
          row.doc._id,
          row.doc.cantidad,
          row.doc._rev
        );
      });
      console.log("_all_docs carrito pouchDB", res)
      return res;
    });

  }

  public pushItem(item: CarItem) : Promise<any>{

    return new Promise( (resolve, reject) => {
      /**
       * hago una busqueda binaria para saber si el producto esta en el carrito
       * si ya esta en el carrito, le informo al usuario q no lo puede agregar
       */
      let indexPrevItem: number = cg.binarySearch(
        this._carItems,
        '_id',
        item._id
      );
      let prevItem: CarItem = this._carItems[indexPrevItem];
      if( prevItem && prevItem._id == item._id ){
        reject("duplicate");
      }else{
        /**
         * inserto los datos en la bd local
         */
        this._db.put(item)
          .then(res=>{
            /**
             * Lo que hago aqui es usar la funcion "sortedLastIndexBy" de lodash
             * mas info aqui: "https://lodash.com/docs/4.17.4#sortedLastIndexBy"
             * con este codigo lo q hago conservar el orden de los productos cada
             * vez que los voy ingresando, asi a la hora de leerlos ya estan ordenados
             * y la busqueda binaria funciona full HD
             */
            let i = _.sortedLastIndexBy(this._carItems, item, v => v._id );
            this._carItems.splice(i, 0, item);
            console.log('prods carrito', this._carItems);
            resolve(res);
          })
          .catch(err=>{
            reject(err);
          })

      }

    })

  }

  public destroyDB(): void{
    this._db.destroy().then(() => {
      console.log("database removed");
    })
    .catch(console.log.bind(console));;
  }

  public showCart(): Modal{
    let modal = this.modalCtrl.create("CarritoPage");
    modal.present();
    return modal;
  }

  public get carItems() : CarItem[] {
    return JSON.parse(JSON.stringify(this._carItems));
  }

  public get carIdItems(): any {
    return _.map(this._carItems, "_id");
  }


}
