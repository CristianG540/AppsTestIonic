import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Frase } from '../../data/frase.interface';
import { FrasesService } from '../../services/frases';

@Component({
  selector: 'page-frases',
  templateUrl: 'frases.html',
})
export class FrasesPage {

  private frasesData: { category: string, quotes: Frase[], icon: string }; 

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private frasesService: FrasesService
  ) { }

  /*ionViewDidLoad() {
    // para que esto funque hay que poner el safe navigation operator (?)
    // en el template
    this.frasesData = this.navParams.data;
  }*/
  ngOnInit() {
    this.frasesData = this.navParams.data; 
  }

  private agregarFavoritos(frase: Frase): void {
    this.alertCtrl.create({
      title: 'Alerta',
      message: '¿Esta seguro de que desea agregar esta frase?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('Acepto');
            this.frasesService.agregarFraseFavoritos(frase);
          }
        },
        {
          text: 'No',
          // Esta propiedad sirve para decirle a ionic que si la persona cierra el
          // alert o da click en otra parte que no sea ninguno de los botonos
          // automaticamente ejecute el handler del boton al que se le asigno el 
          // el rol de cancelar
          role: 'cancel',
          handler: () => {
            console.log('Cancelo');
          }
        }
      ]
    }).present();
  }

  private removerFavorito(frase: Frase): void {
    this.frasesService.eliminarFraseFavoritos(frase);
  }

  private esFavorito(frase: Frase): boolean {
    return this.frasesService.esFavorito(frase);
  }

  

  

}
