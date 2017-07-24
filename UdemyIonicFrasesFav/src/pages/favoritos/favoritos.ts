import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { FrasePage } from '../frases/frase/frase';

import { Frase } from '../../data/frase.interface';
import { FrasesService } from '../../services/frases';
import { ConfigsService } from '../../services/configs';


@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {
  private frases: Frase[];
  constructor(
    private frasesService: FrasesService,
    private configsService: ConfigsService,
    private modalCtrl: ModalController
  ) { }

  ionViewWillEnter() {
    this.frases = this.frasesService.getFrasesFavoritas();
  }

  private verFrase(frase: Frase): void {
    const modal = this.modalCtrl.create(FrasePage, frase);
    modal.present();
    modal.onDidDismiss(() => {
      this.frases = this.frasesService.getFrasesFavoritas();
    });
  }

  private removerFavorito(frase: Frase): void {
    this.frasesService.eliminarFraseFavoritos(frase);
    this.frases = this.frasesService.getFrasesFavoritas();
  }

  private getBackground(): string {
    return ( this.configsService.isAltBackground() ) ? 'altFraseBackground' : 'fraseBackground';
  }


}
