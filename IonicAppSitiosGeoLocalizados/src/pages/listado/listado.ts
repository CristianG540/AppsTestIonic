import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';

/**
 * Generated class for the ListadoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-listado',
  templateUrl: 'listado.html',
})
export class ListadoPage {
  sitios: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public db: DbProvider 
  ) {
  }

  muestraSitio(sitio): void {
    let modalSitio = this.modalCtrl.create('ModalDetalleSitioPage', sitio);
    modalSitio.present();
  }

  borrarSitio(id) {

    let confirm = this.alertCtrl.create({
      title: 'Confirmar borrado',
      message: '¿Estás seguro de que deseas eliminar este sitio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            // Ha respondido que no así que no hacemos nada
          }
        },
        {
          text: 'Si',
          handler: () => {
            // AquÍ borramos el sitio en la base de datos

            this.db.borrarSitio(id).then(
              res => {
                // Una vez borrado el sitio recargamos el listado
                this.llenarSitios();
              },
              err => { /* alert('error al borrar de la bd'+err) */ }
            );
          }
        }
      ]
    });

    confirm.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoPage');
  }

  llenarSitios(): void {
    this.db.getSitios().then(
      res => {
        this.sitios = [];
        for (var i = 0; i < res.rows.length; i++) {
          this.sitios.push({
            id: res.rows.item(i).id,
            lat: res.rows.item(i).lat,
            lng: res.rows.item(i).lng,
            address: res.rows.item(i).address,
            description: res.rows.item(i).description,
            foto: res.rows.item(i).foto
          });
        }
      },
      err => { /* alert('error al sacar de la bd'+err) */ }
    );
  }

  ionViewDidEnter() {
    this.llenarSitios();
  }

}
