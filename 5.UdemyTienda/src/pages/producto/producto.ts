import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Producto } from '../../providers/productos/models/producto';

@IonicPage()
@Component({
  selector: 'page-producto',
  templateUrl: 'producto.html',
})
export class ProductoPage {

  private producto: Producto;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
  }

}
