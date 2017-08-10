import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EditRecetaPage } from "../../edit-receta/edit-receta";

import { Receta } from "../../../models/receta";
import { RecetaService } from "../../../services/receta.service";
import { ListaComprasService } from "../../../services/lista-compras.service";

@Component({
  selector: 'page-receta',
  templateUrl: 'receta.html',
})
export class RecetaPage {
  private idReceta: number;
  private receta: Receta;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private recetaService: RecetaService,
    private listComprasServ: ListaComprasService
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

  private agregarIngredientes(): void {
    this.listComprasServ.ingredientes = this.receta.ingredientes;
  }

  private borrarReceta(): void {
    this.recetaService.eliminarReceta(this.idReceta);
    this.navCtrl.popToRoot();
  }

}
