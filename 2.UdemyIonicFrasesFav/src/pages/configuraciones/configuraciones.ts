import { Component } from '@angular/core';
import { Toggle } from 'ionic-angular';

import { ConfigsService } from '../../services/configs';

@Component({
  selector: 'page-configuraciones',
  templateUrl: 'configuraciones.html',
})
export class ConfiguracionesPage {

  constructor(
    private configsService: ConfigsService
  ) { }

  private onToggle(toggle: Toggle): void {
    this.configsService.setBackGround(toggle.checked);
  }

  private checkAltBackground(): boolean {
    return this.configsService.isAltBackground();
  }

}
