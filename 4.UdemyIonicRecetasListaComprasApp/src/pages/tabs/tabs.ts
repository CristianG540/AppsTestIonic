import { Component } from '@angular/core';

import { ListaComprasPage } from "../lista-compras/lista-compras";
import { RecetasPage } from "../recetas/recetas";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  private listaComprasRoot: any = ListaComprasPage;
  private recetasRoot: any = RecetasPage;

  constructor(
  ) {}

}
