import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, PopoverController, Loading } from 'ionic-angular';
import { EditRecetaPage } from "../edit-receta/edit-receta";
import { RecetaPage } from "./receta/receta";

import { RecetaService } from "../../services/receta.service";
import { Receta } from "../../models/receta";
import { PopUpBdOpcionesPage } from "../pop-up-bd-opciones/pop-up-bd-opciones";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-recetas',
  templateUrl: 'recetas.html',
})
export class RecetasPage {

  private loading: Loading;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private popOverCtrl: PopoverController,
    private recetaService: RecetaService,
    private authService: AuthService
  ) {
  }

  private nuevaReceta(): void {
    this.navCtrl.push(EditRecetaPage, {mode: 'POST'})
  }

  private cargarReceta(idReceta: number): void {
    this.navCtrl.push(RecetaPage, { idReceta: idReceta});
  }

  private mostrarOpciones(evt: MouseEvent) {
    let popover = this.popOverCtrl.create(PopUpBdOpcionesPage);
    popover.present({
      ev: evt
    });
    popover.onDidDismiss( data => {

      if(data != null ){

        this.showLoading();
        this.authService.usuarioActivo()
          .getIdToken()
          .then( (token: string) => {
            if(data.accion == "guardar"){

              this.recetaService.guardarRecetas(token)
                .subscribe(
                  () => {
                    this.loading.dismiss();
                    console.log('Melo!');
                  },
                  err => this.errorHandler(err)
                )

            }else if(data.accion == "cargar"){

              this.recetaService.recuperarLista(token)
                .subscribe(
                  () => {
                    this.loading.dismiss();
                    console.log('Melo!');
                  },
                  err => this.errorHandler(err.json().error)
                )

            }
          })
          .catch( err => this.errorHandler(err.message) );

      }

    });
  }

  private errorHandler(err: string): void {
    this.loading.dismiss();
    this.alertCtrl.create({
      title: "Ocurrio un error.",
      message: err,
      buttons: ['Ok']
    }).present();
  }

  private showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    this.loading.present();
  }

}
