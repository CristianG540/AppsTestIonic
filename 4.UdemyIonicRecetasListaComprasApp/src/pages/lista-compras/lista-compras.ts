import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListaComprasService } from "../../services/lista-compras.service";
import { PopoverController, AlertController, LoadingController, Loading } from "ionic-angular";
import { AuthService } from "../../services/auth.service";
import { PopUpBdOpcionesPage } from "../pop-up-bd-opciones/pop-up-bd-opciones";

@Component({
  selector: 'page-lista-compras',
  templateUrl: 'lista-compras.html',
})
export class ListaComprasPage {
  private loading: Loading;
  constructor(
    private popOverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private listaComprasService: ListaComprasService,
    private authService: AuthService
  ) {}

  private agregarArticulo(form: NgForm): void {
    this.listaComprasService.ingredientes = [{
      nombre: form.value.nombreIngrediente,
      cantidad: form.value.cantidad
    }];
    form.reset();
  }

  private borrarArticulo(index: number) {
    this.listaComprasService.eliminarIngrediente(index);
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

              this.listaComprasService.guardarLista(token)
                .subscribe(
                  () => {
                    this.loading.dismiss();
                    console.log('Melo!');
                  },
                  err => this.errorHandler(err)
                )

            }else if(data.accion == "cargar"){

              this.listaComprasService.recuperarLista(token)
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
