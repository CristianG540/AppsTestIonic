import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Ingrediente } from "../models/ingrediente";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class ListaComprasService {

  private _ingredientes: Ingrediente[] = [];

  constructor(
    private http: Http,
    private authService: AuthService
  ) {}

  public eliminarIngrediente(index: number): void {
    this._ingredientes.splice(index, 1);
  }

  public set ingredientes(ingredientes: Ingrediente[]) {
    this._ingredientes.push(...ingredientes);
  }

  public get ingredientes() : Ingrediente[] {
    return JSON.parse(JSON.stringify(this._ingredientes));
  }

  public guardarLista(token:string): any {
    let usrId = this.authService.usuarioActivo().uid;
    let url = `https://udemyionicrecetaslistcompras.firebaseio.com/${ usrId }/lista-compras.json`;
    return this.http.put(url, this._ingredientes)
      .map( (res: Response) => {
        return res.json();
      });
  }

}
