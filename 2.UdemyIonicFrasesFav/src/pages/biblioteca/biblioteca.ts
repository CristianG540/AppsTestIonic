import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FrasesPage } from '../frases/frases';
import { Frase } from '../../data/frase.interface';
import frases from '../../data/frases';

@Component({
  selector: 'page-biblioteca',
  templateUrl: 'biblioteca.html',
})
export class BibliotecaPage {

  private frasesPage = FrasesPage;
  private frasesCollection: { category: string, quotes: Frase[], icon: string }[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.frasesCollection = frases;
  }

}
