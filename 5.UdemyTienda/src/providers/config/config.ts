import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Loading, AlertController, LoadingController } from "ionic-angular";

@Injectable()
export class Config {
  public loading: Loading;
  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ){
  }

  /* **************************** Cosas de CouchDB  *************************** */
  // Url base de la BD en couch
  static readonly CDB_URL: string = 'http://192.168.11.29:5984/productos';

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
  // Gracias a https://pouchdb.com/2015/02/28/efficiently-managing-ui-state-in-pouchdb.html
  static binarySearch(arr: any, property: string, search: any): number {
    let low: number = 0;
    let high:number = arr.length;
    let mid:number;
    while (low < high) {
      mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
      arr[mid][property] < search ? low = mid + 1 : high = mid
    }
    return low;
  }

  public errorHandler(err: string, errObj?: any): void {
    if(this.loading){ this.loading.dismiss(); }
    this.alertCtrl.create({
      title: "Ocurrio un error.",
      message: err,
      buttons: ['Ok']
    }).present();
    if(err){ console.error(err) }
  }

  public showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    this.loading.present();
  }

}
