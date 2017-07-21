import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
 
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  private nombre: string = '';

  constructor(
    private navCtrl: NavController,
    private navPms: NavParams
  ) {
    this.nombre = this.navPms.get('nombre');
  }

  private volver(): void {
    //this.navCtrl.pop();
    this.navCtrl.popToRoot();
  }

}