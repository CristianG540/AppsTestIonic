import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListaComprasService } from "../../services/lista-compras.service";
import { Ingrediente } from "../../models/ingrediente";

@Component({
  selector: 'page-lista-compras',
  templateUrl: 'lista-compras.html',
})
export class ListaComprasPage {

  constructor(
    private listaComprasService: ListaComprasService
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

}
