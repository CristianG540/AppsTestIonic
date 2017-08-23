import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodosProvider } from "../../providers/todos/todos";
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  private name: string;
  private username: string;
  private email: string;
  private password: string;
  private confirmPassword: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private http: Http,
    private todoService: TodosProvider
  ) {
  }

  register() {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });

    let user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };
    let url = 'http://localhost:3000/auth/register';
    this.http.post(url, JSON.stringify(user), options)
      .toPromise()
      .then(res => {
        //debugger;
        this.todoService.init(res.json());
        this.navCtrl.setRoot('HomePage');
      })
      .catch( err => {
        console.log(err);
      });

  }

}
