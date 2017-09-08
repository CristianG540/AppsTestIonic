import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
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
    public navParams: NavParams,
    private cartServ: CarritoProvider,
    private prodServ: ProductosProvider,
    private util: Config
  ) {
  }

  ionViewDidLoad() {
    let prodsId = this.cartServ.carIdItems;
    this.prodServ.fetchProdsByids(prodsId)
      .then((prods: Producto[])=>{
        this._prods = prods;
        console.log("prods carrito", prods);
      })
      .catch(err=>{
        this.util.errorHandler(err.message, err);
      })

  }

  //CONTINUAR AQUI FALTA LISTAR LOS PRODUCTOS EN EL MODAL DEL CARRITO

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
