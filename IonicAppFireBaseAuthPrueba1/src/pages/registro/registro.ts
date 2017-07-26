import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, TextInput, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

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
    console.log('ionViewDidLoad RegistroPage');
  }

  alert(msg: string): void {
    this.alertCtrl.create({
      title: 'Info',
      subTitle: msg,
      buttons: ['Ok']
    }).present();
  }

  registrarse() {

    this.afAuth.auth.createUserWithEmailAndPassword(this.nomUsuario.value, this.pass.value)
      .then(res => {
        this.alert('Se registro correctamente');
        console.log("La info firebase: ", res);

      }).catch(err => {
        this.alert(` error al registrar: ${JSON.stringify(err)} `);
        console.error("error en firebase: ", err);

      });
    
    console.log("los datos: ", this.nomUsuario.value, this.pass.value);
  }

}
