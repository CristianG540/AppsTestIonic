import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { Producto } from '../../providers/productos/models/producto';
import { CarritoProvider } from "../../providers/carrito/carrito";

@IonicPage()
@Component({
  selector: 'page-producto',
  templateUrl: 'producto.html',
})
export class ProductoPage {

  private producto: Producto;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private cartService: CarritoProvider
  ) {
    this.producto = this.navParams.data;
  }

  private addProd(): void {

    if(this.cartService.pushProd(this.producto) ){
      this.showToast("El producto se agrego correctamente");
    }else{
      this.showToast("El producto ya esta en el carrito");
    };
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

}
