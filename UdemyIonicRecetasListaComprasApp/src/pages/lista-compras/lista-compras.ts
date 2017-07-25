import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ListaComprasService } from "../../services/lista-compras.service";
import { Ingrediente } from "../../models/ingrediente";

@Component({
  selector: 'page-lista-compras',
  templateUrl: 'lista-compras.html',
})
export class ListaComprasPage {

  private listaArticulos: Ingrediente[] = [];

  constructor(
    private listaComprasService: ListaComprasService
  ) {}

  ionViewDidEnter(){
    this.listaArticulos = this.listaComprasService.getIngredientes();
  }

  private agregarArticulo(form: NgForm): void {
    this.listaArticulos = this.listaComprasService.agregarIngrediente(form.value.nombreIngrediente, form.value.cantidad);
    form.reset();
  }

  private borrarArticulo(index: number) {
    this.listaArticulos = this.listaComprasService.eliminarIngrediente(index);
  }

}
