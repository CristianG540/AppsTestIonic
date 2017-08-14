import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListaComprasService } from "../../services/lista-compras.service";
import { PopoverController } from "ionic-angular";
import { ListaComprasOpcionesPage } from "./lc-opciones/lc-opciones";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-lista-compras',
  templateUrl: 'lista-compras.html',
})
export class ListaComprasPage {

  constructor(
    private popOverCtrl: PopoverController,
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
    let popover = this.popOverCtrl.create(ListaComprasOpcionesPage);
    popover.present({
      ev: evt
    });
    popover.onDidDismiss(data => {
      if(data.accion == "guardar"){
        this.authService.usuarioActivo().getToken()
          .then( (token: string) => {

          })
          .catch();
      }else if(data.accion == "cargar"){

      }
    });
  }

}
