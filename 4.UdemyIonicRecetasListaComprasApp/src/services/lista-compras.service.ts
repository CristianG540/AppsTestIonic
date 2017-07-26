import { Ingrediente } from "../models/ingrediente";

export class ListaComprasService {

  private _ingredientes: Ingrediente[] = [];

  constructor() {}

  public eliminarIngrediente(index: number): void {
    this._ingredientes.splice(index, 1);
  }

  public set ingredientes(ingredientes: Ingrediente[]) {
    this._ingredientes.push(...ingredientes);
  }

  public get ingredientes() : Ingrediente[] {
    return JSON.parse(JSON.stringify(this._ingredientes));
  }

}
