import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmarOrdenPage } from './confirmar-orden';
import { Autosize } from "../../components/autosize/autosize";

@NgModule({
  declarations: [
    ConfirmarOrdenPage,
    Autosize
  ],
  imports: [
    IonicPageModule.forChild(ConfirmarOrdenPage),
  ],
})
export class ConfirmarOrdenPageModule {}
