import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the PaginaLogueadoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-pagina-logueado',
  templateUrl: 'pagina-logueado.html',
})
export class PaginaLogueadoPage {

  private email: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth
  ) {
    this.email = this.afAuth.auth.currentUser.email;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaginaLogueadoPage');
  }

}
