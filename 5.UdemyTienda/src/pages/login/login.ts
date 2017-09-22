import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthProvider } from '../../providers/auth/auth';
import { DbProvider } from "../../providers/db/db";
import { Config as cg } from "../../providers/config/config";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private username: string;
  private password: string;

  private loading: Loading;
  private backgroundImage = 'assets/img/background/background-4.jpg';

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private http: Http,
    private authService: AuthProvider,
    private dbServ: DbProvider,
    private util: cg
  ) {
  }

  private login(): void {
    let loading = this.util.showLoading();
    let credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials)
    .then(res=>{
      console.log(res);
      loading.dismiss();
      this.dbServ.init(res.userDBs.supertest);
      this.navCtrl.setRoot('TabsPage');
    }).catch( err => this.util.errorHandler(err.message, err, loading) )
  }

  private launchSignup(): void {
    this.navCtrl.push('SignupPage');
  }

}
