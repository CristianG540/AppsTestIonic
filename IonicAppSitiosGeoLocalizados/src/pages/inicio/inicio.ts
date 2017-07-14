import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

declare var google: any;

/**
 * Generated class for the InicioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  map: any; //Manejador del mapa
  coords: any = {
    lat: 0,
    lng: 0
  }
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public modalCtrl: ModalController,
    private geo: Geolocation
  ) {

    platform.ready().then(() => {
      this.obtenerPosicion();
    });

  }

  obtenerPosicion() {
    this.geo.getCurrentPosition().then(
      res => {
        this.coords.lat = res.coords.latitude;
        this.coords.lng = res.coords.longitude;

        this.loadMap();
      }
    ).catch(
      (error: PositionError) => {
        alert(error.message);
        console.log(error);
      }
    );
  }

  loadMap() {
    let mapContainer = document.getElementById('map');
    this.map = new google.maps.Map(mapContainer, {
      center: this.coords,
      zoom: 12
    });
    // Colocamos el marcador
    let miMarker = new google.maps.Marker({
      icon: 'assets/img/ico_estoy_aqui.png',
      map: this.map,
      position: this.coords
    });  
  }

  nuevoSitio() {
    // aquí vamos a abrir el modal para añadir nuestro sitio.
    let miModal = this.modalCtrl.create('ModalNuevoSitioPage', this.coords);
    miModal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioPage');
  }

}
