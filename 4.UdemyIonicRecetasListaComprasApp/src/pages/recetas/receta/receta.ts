import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Receta } from "../../../models/receta";
import { RecetaService } from "../../../services/receta.service";
import { EditRecetaPage } from "../../edit-receta/edit-receta";

@Component({
  selector: 'page-receta',
  templateUrl: 'receta.html',
})
export class RecetaPage {
  private idReceta: number;
  private receta: Receta;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private recetaService: RecetaService
  ) {
  }

  ionViewDidLoad() {
    this.idReceta = this.navParams.get('idReceta');
    this.receta = this.recetaService.recetas[this.idReceta];
    console.log(this.receta);
  }

  private editarReceta(): void {
    this.navCtrl.push(EditRecetaPage, {
      mode: 'PUT',
      index: this.idReceta
    });
  }
}
