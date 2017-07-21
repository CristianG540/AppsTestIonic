import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { Frase } from '../../../data/frase.interface';
import { FrasesService } from '../../../services/frases';

@Component({
  selector: 'page-frase',
  templateUrl: 'frase.html',
})
export class FrasePage {
  private frase: Frase;
  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private frasesService: FrasesService
  ) {
    this.frase = this.navParams.data;
  }

  private cerrar(): void {
    this.viewCtrl.dismiss();
  }

  private removerFavorito(): void {
    this.frasesService.eliminarFraseFavoritos(this.frase);
    this.cerrar();
  }

}
