import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { Producto } from '../../providers/productos/models/producto';
import { CarritoProvider } from "../../providers/carrito/carrito";
import { Config } from "../../providers/config/config";

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
    private util: Config,
    private navParams: NavParams,
    private cartService: CarritoProvider
  ) {
    this.producto = this.navParams.data;
  }

  private addProd(): void {
    this.util.showLoading();
    this.cartService.pushItem({
      _id: this.producto._id,
      cantidad: 1,
      totalPrice: this.producto.existencias*10
    }).then(res=>{
      this.util.loading.dismiss();
      this.showToast(`El producto ${res.id} se agrego correctamente`);
    }).catch(err=>{
      if(err=="duplicate"){
        this.util.loading.dismiss();
        this.showToast(`El producto ya esta en el carrito`);
      }else{
        this.util.errorHandler(err.message, err);
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

}
