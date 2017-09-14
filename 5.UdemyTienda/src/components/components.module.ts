import { NgModule } from '@angular/core';
import { NumberPickerComponent } from './number-picker/number-picker';
import { Autosize } from "./autosize/autosize";
@NgModule({
  declarations: [NumberPickerComponent, Autosize],
  imports: [],
  exports: [NumberPickerComponent, Autosize]
})
export class ComponentsModule {}
