import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  home = 'HomePage'
  categorias = 'CategoriasPage'
  ordenes = 'OrdenesPage'
  buscar = '4Page'

  constructor(public navCtrl: NavController) {}

}
