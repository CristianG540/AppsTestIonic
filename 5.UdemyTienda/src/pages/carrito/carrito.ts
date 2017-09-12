import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController
} from "ionic-angular";
import { CarritoProvider } from "../../providers/carrito/carrito";
import { Producto } from "../../providers/productos/models/producto";
import { ProductosProvider } from '../../providers/productos/productos';
import { Config } from "../../providers/config/config";

@IonicPage()
@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html',
})
export class CarritoPage {

  private _prods: Producto[] = [];

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    private cartServ: CarritoProvider,
    private prodServ: ProductosProvider,
    private util: Config
  ) {
  }

  ionViewDidLoad() {
    this.reloadProds();
  }

  private logCarItems(): void {
    console.log("Los items del carrito: ", this.cartServ.carItems);
  }

  private deleteItem(prod: Producto): void {
    this.cartServ.deleteItem(prod)
      .then(res=>{
        this.reloadProds();
        this.showToast(`El producto ${res.id} se elimino de carrito correctamente`);
        console.log("prod eliminado carrito", res);
      })
      .catch(err=>{
        this.util.errorHandler(err.message, err);
      })
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  private reloadProds(): void {
    let prodsId = this.cartServ.carIdItems;
    this.prodServ.fetchProdsByids(prodsId)
      .then((prods: Producto[])=>{
        this._prods = prods;
        console.log("prods carrito", this._prods);
      })
      .catch(err=>{
        this.util.errorHandler(err.message, err);
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
