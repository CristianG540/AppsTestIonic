import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the MisTabsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-mis-tabs',
  templateUrl: 'mis-tabs.html'
})
@IonicPage()
export class MisTabsPage {

  inicioRoot = 'InicioPage'
  listadoRoot = 'ListadoPage'
  infoRoot = 'InfoPage'


  constructor(public navCtrl: NavController) {}

}
