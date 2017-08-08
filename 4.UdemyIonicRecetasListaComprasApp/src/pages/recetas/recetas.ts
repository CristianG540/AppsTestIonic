import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditRecetaPage } from "../edit-receta/edit-receta";
import { RecetaPage } from "./receta/receta";

import { RecetaService } from "../../services/receta.service";
import { Receta } from "../../models/receta";

@Component({
  selector: 'page-recetas',
  templateUrl: 'recetas.html',
})
export class RecetasPage {

  private recetas: Receta[];

  constructor(
    private navCtrl: NavController,
    private recetaService: RecetaService
  ) {
  }

  ionViewWillEnter(){
   this.recetas = this.recetaService.recetas;
  }

  private nuevaReceta(): void {
    this.navCtrl.push(EditRecetaPage, {mode: 'POST'})
  }

  private cargarReceta(idReceta: number): void {
    this.navCtrl.push(RecetaPage, { idReceta: idReceta});
  }

}
