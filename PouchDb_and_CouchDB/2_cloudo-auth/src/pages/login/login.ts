import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { TodosProvider } from "../../providers/todos/todos";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private username: string;
  private password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private todoService: TodosProvider
  ) {
  }

  private login(): void {

    let credentials = {
      username: this.username,
      password: this.password
    };

    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let url = 'http://localhost:3000/auth/login';
    this.http.post(url, JSON.stringify(credentials), options)
      .subscribe(res => {
        this.todoService.init(res.json());
        this.navCtrl.setRoot('HomePage');
      }, (err) => {
        console.log(err);
      });
  }

  private launchSignup(): void {
    this.navCtrl.push('SignupPage');
  }

}
