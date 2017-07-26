import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditRecetaPage } from "../edit-receta/edit-receta";

@Component({
  selector: 'page-recetas',
  templateUrl: 'recetas.html',
})
export class RecetasPage {

  constructor(
    public navCtrl: NavController
  ) {
  }

  private nuevaReceta(): void{
    this.navCtrl.push(EditRecetaPage, {mode: 'POST'})
  }

}
