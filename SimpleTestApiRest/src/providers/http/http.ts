import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HttpProvider {

  private datos: any;
  private path: string = 'https://randomuser.me/api/?results=25';

  constructor(public http: Http) {
    console.log('Hello HttpProvider Provider');
  }

  loadUsers() {
    return this.http
      .get(this.path)
      .map(
        res => {
          return res.json();
        },
        err => {
          console.log(err);
        }
      )
  }

  postDatos() {
    let datos = { nombre: 'Edu', email: 'edu.revilla.vaquero@gmail.com' }
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({
      headers: headers
    });
    var url = 'www.miservicio.com/adduser/';
    return new Promise(resolve => {
      this.http.post(url, JSON.stringify(datos), options)
        .subscribe(data => {
          resolve(data['_body']);
        });
    });
  }

}
