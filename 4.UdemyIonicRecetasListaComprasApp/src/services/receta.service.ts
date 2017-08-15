import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Receta } from "../models/receta";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class RecetaService {

  private _recetas: Receta[] = [];

  constructor(
    private http: Http,
    private authService: AuthService
  ) {}

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

  public guardarRecetas(token:string): Observable<any> {
    let usrId = this.authService.usuarioActivo().uid;
    let url = `https://udemyionicrecetaslistcompras.firebaseio.com/${ usrId }/recetas.json?auth=${token}`;

    return this.http.put(url, this._recetas)
      .map( (res: Response) => {
        return res.json();
      });
  }

  public recuperarLista(token: string): Observable<any> {
    let usrId = this.authService.usuarioActivo().uid;
    let url = `https://udemyionicrecetaslistcompras.firebaseio.com/${ usrId }/recetas.json?auth=${token}`;

    return this.http.get(url)
      .map( (res: Response) => {
        return res.json();
      }).do( ( d: Receta[] ) => {
        d = (d) ? d : [];
        this._recetas = d.map((v: Receta) => {
          if(!v.hasOwnProperty('ingredientes')){
            v.ingredientes = [];
          }
          return v;
        });
      });
  }

}
