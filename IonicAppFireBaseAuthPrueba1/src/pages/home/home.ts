import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegistroPage } from '../registro/registro';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {

  }

  loguearse() {
    this.navCtrl.push(LoginPage);
  }

  registrarse() {
    this.navCtrl.push(RegistroPage);
  }


}
