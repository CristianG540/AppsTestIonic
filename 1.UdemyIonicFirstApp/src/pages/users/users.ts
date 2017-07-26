import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserPage } from '../users/user/user';

/**
 * Generated class for the UsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ){}

  private abrirUsuario(nombre: string): void {
    this.navCtrl.push(UserPage, {
      nombre: nombre
    });
  }

  ionViewCanEnter(): boolean | Promise<void> {
    console.log('ionViewCanEnter UsersPage');
    const rnd = Math.random();
    return rnd > 0.5;
  }

  ionViewCanLeave(): boolean | Promise<void> {
    console.log('ionViewCanLeave UsersPage');
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

}
