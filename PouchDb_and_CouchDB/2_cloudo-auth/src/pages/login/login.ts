import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { TodosProvider } from "../../providers/todos/todos";
import { AuthProvider } from '../../providers/auth/auth';
import { DbProvider } from '../../providers/db/db';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private username: string;
  private password: string;

  private loading: Loading;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private http: Http,
    private todoService: TodosProvider,
    private authService: AuthProvider,
    private dbServ: DbProvider
  ) {
  }

  private login(): void {
    this.showLoading();
    let credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials)
    .then(res=>{
      console.log(res);
      this.loading.dismiss();
      this.dbServ.init(res.userDBs.supertest);
      this.navCtrl.setRoot('HomePage');
    }).catch(err=>{
      console.log(err);
      this.loading.dismiss();
    })

    /*let headers = new Headers({
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
      });*/
  }

  private launchSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  private showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

}
