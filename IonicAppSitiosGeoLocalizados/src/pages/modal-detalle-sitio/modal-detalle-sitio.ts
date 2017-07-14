import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DbProvider } from '../../providers/db/db';

/**
 * Generated class for the ModalDetalleSitioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-detalle-sitio',
  templateUrl: 'modal-detalle-sitio.html',
})
export class ModalDetalleSitioPage {
  sitio: any;
  edit: boolean = false ;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private launchNavigator: LaunchNavigator,
    private camera: Camera,
    private db: DbProvider
  ) {
    this.sitio = this.navParams.data;
  }

  sacarFoto() {
    let cameraOptions: CameraOptions = {
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is a base64 encoded string
      this.sitio.foto = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  guardarCambios() {
    this.db.modificaSitio(this.sitio).then((res) => {
      this.edit = false;
    }, (err) => {  /* alert('error al meter en la bd'+err) */ })
  }

  comoLlegar() {
    let destino = this.sitio.lat + ', ' + this.sitio.lng;
    this.launchNavigator.navigate(destino).then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );

  }

  cerrarModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalDetalleSitioPage');
  }

}
