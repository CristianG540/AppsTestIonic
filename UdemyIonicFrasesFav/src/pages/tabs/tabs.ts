import { Component } from '@angular/core';

import { FavoritosPage } from '../favoritos/favoritos';
import { BibliotecaPage } from '../biblioteca/biblioteca';

@Component({
  templateUrl: 'tabs.html',
  selector: 'page-tabs'
})
export class TabsPage {
  private favoritosRoot: any = FavoritosPage;
  private bibliotecaRoot: any = BibliotecaPage;
}