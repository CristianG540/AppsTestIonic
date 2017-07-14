import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalNuevoSitioPage } from './modal-nuevo-sitio';

@NgModule({
  declarations: [
    ModalNuevoSitioPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalNuevoSitioPage),
  ],
  exports: [
    ModalNuevoSitioPage
  ]
})
export class ModalNuevoSitioPageModule {}
