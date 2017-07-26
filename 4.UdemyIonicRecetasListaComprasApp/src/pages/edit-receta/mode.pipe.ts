// Importamos los componentes necesarios
import { Pipe, PipeTransform } from '@angular/core';
// Le ponemos un nombre a la tuberia
@Pipe({name: 'modeTipoPipe'})
// Definimos la clase implementado la interface PipeTransform
export class ModeTipoPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'POST':
        return 'Nueva';
      case 'PUT':
        return 'Editar'
      default:
        return ''
    }
  }
}
