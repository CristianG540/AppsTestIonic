import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodosProvider } from "../../providers/todos/todos";

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

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private http: Http,
    private todoService: TodosProvider
  ) {
  }

  register() {
    debugger;
    let user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.todoService.init();
    this.todoService.signup(user)
      .then( res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err)
      });
  }

}
