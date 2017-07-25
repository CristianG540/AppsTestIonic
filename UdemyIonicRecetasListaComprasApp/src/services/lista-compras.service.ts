import { Ingrediente } from "../models/ingrediente";

export class ListaComprasService {

  private ingredientes: Ingrediente[] = [];

  constructor() {}

  public agregarIngrediente(nombre: string, cantidad: number): Ingrediente[] {
    this.ingredientes.push( new Ingrediente(nombre, cantidad) );
    return this.getIngredientes();
  }

  /**
   * AgregarIngredientes
   */
  public AgregarIngredientes(articulos: Ingrediente[]) {
    this.ingredientes.push(...articulos);
  }

  public getIngredientes(): Ingrediente[] {
    return JSON.parse(JSON.stringify(this.ingredientes));
  }

  public eliminarIngrediente(index: number): Ingrediente[] {
    this.ingredientes.splice(index, 1);
    return this.getIngredientes();
  }


}
