import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpProvider} from '../../providers/http/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private usuarios: any[];
  constructor(
    public navCtrl: NavController,
    private http: HttpProvider
  ) {

  }

  cargarUsuarios() {
    this.http.loadUsers().subscribe(
      res => {
        this.usuarios = res.results;
        console.log(this.usuarios)
      },
      error => {
        console.log(error);
      }
    );
  }

}
