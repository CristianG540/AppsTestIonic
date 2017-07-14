import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  private nomUsuario: string = '';
  private mensaje: string = '';
  private mensajes: { nomUsuario: string, msg: string }[];
  private fireDbSub: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase
  ) {
    this.nomUsuario = this.navParams.get('nomUsuario');
    this.fireDbSub = this.db.list('/chat').subscribe(res => {
      this.mensajes = res;
      console.log('la respuesta de firebase: ', res);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewDidEnter() {
    this.enviarMsj('Entro a la sala');
  }

  ionViewWillLeave() {
    this.fireDbSub.unsubscribe();
    this.enviarMsj('Abandono la sala');
  }

  enviarMsj(msj: string = this.mensaje) {
    this.db.list('/chat').push({
      nomUsuario: this.nomUsuario,
      msg: msj
    }).then(res => {
      console.log('Se envio el mensaje', res);
    })
    .catch(err => {
      console.error('Error al enviar el mensaje', err);
    });
    this.mensaje = '';
  }



}
