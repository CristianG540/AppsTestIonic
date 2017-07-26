import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UsersPage } from '../users/users';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  private abrirUsuarios(): void {
    this.navCtrl.push(UsersPage)
      .then(res => {
        if (res) {
          console.log('Acceso permitido');
        } else {
          console.error('Acceso denegado');
        } 
      });
  }

}
