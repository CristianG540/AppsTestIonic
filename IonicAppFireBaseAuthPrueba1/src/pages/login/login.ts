import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, TextInput, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { PaginaLogueadoPage } from '../pagina-logueado/pagina-logueado';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('nomUsuario')
  nomUsuario: TextInput;

  @ViewChild('pass')
  pass: TextInput;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  alert(msg: string): void {
    this.alertCtrl.create({
      title: 'Info',
      subTitle: msg,
      buttons: ['Ok']
    }).present();
  }

  loguearse() {

    this.afAuth.auth.signInWithEmailAndPassword(this.nomUsuario.value, this.pass.value)
      .then(res => {
        console.log("logue correcto la data es: ", res);
        this.alert('Exito!');
        this.navCtrl.setRoot(PaginaLogueadoPage);
      })
      .catch(err => {
        alert(` error al loguear: ${JSON.stringify(err)} `);
        console.error("logueo incorrecto error: ", err);
      });
  }

}
