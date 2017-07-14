import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private nomUsuario: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {

  }

  alert(msg: string, title: string = 'Info'): void {
    this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    }).present();
  }

  loguearse(): void {
    if (/^[a-zA-Z0-9]+$/.test(this.nomUsuario)) {
      this.navCtrl.push(ChatPage, {
        nomUsuario: this.nomUsuario
      });
    } else {
      this.alert(`Error en el formato del nombre del usuario`, 'Error');
    }
  }

}
