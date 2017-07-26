import { Frase } from '../data/frase.interface';

export class FrasesService {
  private frasesFavoritas: Frase[] = [];

  public agregarFraseFavoritos(frase: Frase): void {
    this.frasesFavoritas.push(frase);
  }

  public eliminarFraseFavoritos(frase: Frase): void {
 
    const posicion = this.frasesFavoritas.findIndex((quoteElement: Frase) => {
      return quoteElement.id == frase.id
    });
    this.frasesFavoritas.splice(posicion, 1);

  }

  public getFrasesFavoritas(): Frase[] {
    return JSON.parse(JSON.stringify(this.frasesFavoritas));
  }

  public esFavorito(frase: Frase): boolean {
    return this.frasesFavoritas.find( (val: Frase) => val.id == frase.id ) ? true : false;
  }

}