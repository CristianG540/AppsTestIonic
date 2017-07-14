import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DbProvider } from '../../providers/db/db';
declare var google;
/**
 * Generated class for the ModalNuevoSitioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-nuevo-sitio',
  templateUrl: 'modal-nuevo-sitio.html',
})
export class ModalNuevoSitioPage {

  coords: any = {
    lat: 0,
    lng: 0
  };
  address: string;
  description: string = '';
  foto: any = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private camara: Camera,
    private db: DbProvider 
  ) {
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad ModalNuevoSitioPage');
    this.coords.lat = this.navParams.get('lat');
    this.coords.lng = this.navParams.get('lng');

    this.getAddress(this.coords).then(results => {
      this.address = results[0]['formatted_address'];
    }, errStatus => {
      // Aquí iría el código para manejar el error
    });
  }

  cerrarModal(): void {
    this.viewCtrl.dismiss();
  }

  getAddress(coords): any {
    var geocoder = new google.maps.Geocoder();

    return new Promise( (resolve, reject):void => {
      geocoder.geocode({ 'location': coords }, (results, status):void => { // llamado asincronamente
        if (status == google.maps.GeocoderStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }

  sacarFoto() {

    let cameraOptions: CameraOptions = {
      quality: 50,
      encodingType: this.camara.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 600,
      destinationType: this.camara.DestinationType.DATA_URL,
      sourceType: this.camara.PictureSourceType.CAMERA,
      correctOrientation: true
    }


    this.camara.getPicture(cameraOptions).then(
      (imageData) => { this.foto = "data:image/jpeg;base64," + imageData; },
      (err) => { console.log(err); }
    );
  }

  guardarSitio() {
    let sitio = {
      lat: this.coords.lat,
      lng: this.coords.lng,
      address: this.address,
      description: this.description,
      foto: this.foto
    }
    this.db.addSitio(sitio).then(
      res => {
        this.cerrarModal();
        /*  alert('se ha introducido correctamente en la bd'); */
      },
      err => {
        /* alert('error al meter en la bd'+err) */
      }
    )
  }

}
