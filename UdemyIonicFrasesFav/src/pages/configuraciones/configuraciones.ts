import { Component } from '@angular/core';
import { Toggle } from 'ionic-angular';

@Component({
  selector: 'page-configuraciones',
  templateUrl: 'configuraciones.html',
})
export class ConfiguracionesPage {

  constructor(
  ) { }

  private onToggle(toggle: Toggle): void {
    console.log(toggle);
  }

}
