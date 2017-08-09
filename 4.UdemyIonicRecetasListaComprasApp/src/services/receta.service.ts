import { Receta } from "../models/receta";

export class RecetaService {

  private _recetas: Receta[] = [];

  constructor() {}

  public eliminarReceta(index: number): void {
    this._recetas.splice(index, 1);
  }

  public actualizar(index: number, receta: Receta): void {
    this._recetas[index] = receta;
  }

  public set recetas(recetas: Receta[]) {
    this._recetas.push(...recetas );
  }

  public get recetas() : Receta[] {
    return JSON.parse(JSON.stringify(this._recetas));
  }

}