import { Component } from '@angular/core';
import {
  NavController,
  Loading,
  LoadingController,
  AlertController,
  IonicPage,
  ToastController
} from "ionic-angular";

import { Producto } from '../../providers/productos/models/producto';

import { ProductosProvider } from '../../providers/productos/productos';
import { CarritoProvider } from "../../providers/carrito/carrito";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private loading: Loading;
  private pushPage: string = 'ProductoPage';

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private prodsService: ProductosProvider,
    private cartService: CarritoProvider
  ) {
  }

  ionViewDidEnter(){
    // ESTA MIERDA AQUI ABAJO LA DE RESETEAR LOS PRODS SE DEBE PODER HACER MEJOR CON POUCH
    this.prodsService.resetProds();
    this.prodsService.recuperarPagSgte()
      .catch( err => this.errorHandler(err.message, err) );
  }

  private doInfinite(infiniteScroll): void {
    this.prodsService.recuperarPagSgte()
      .then( () => infiniteScroll.complete() )
      .catch( err => this.errorHandler(err.message, err) );
  }

  private errorHandler(err: string, errObj?: any): void {
    if(this.loading){ this.loading.dismiss(); }
    this.alertCtrl.create({
      title: "Ocurrio un error.",
      message: err,
      buttons: ['Ok']
    }).present();
    if(err){ console.error(err) }
  }

  private showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    this.loading.present();
  }

  private addProd(producto: Producto): void {
    this.showLoading();
    this.cartService.pushItem({
      _id: producto._id,
      cantidad: 1,
      totalPrice: producto.existencias*10
    }).then(res=>{
      this.loading.dismiss();
      this.showToast(`El producto ${res.id} se agrego correctamente`);
    }).catch(err=>{
      if(err=="duplicate"){
        this.loading.dismiss();
        this.showToast(`El producto ya esta en el carrito`);
      }else{
        this.errorHandler(err.message, err);
      }

    })

  }

  private showToast(msg:string): void {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "cerrar"
    }).present();
  }

  private deleteDB(){
    this.cartService.destroyDB();
  }

  private trackByProds(index: number, prod: Producto): string {
    return prod._id;
  }

}
