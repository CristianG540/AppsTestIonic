import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from "../pages/signup/signup";
import { SigninPage } from "../pages/signin/signin";
import { AuthService } from "../services/auth.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  signInPage:any = SigninPage;
  signUpPage:any = SignupPage;
  private isAuth: boolean = false;

  @ViewChild('nav') nav: NavController;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyAscaV8Y6ie4fktfCXwjgc17gBaxOvhx1Y",
      authDomain: "udemyionicrecetaslistcompras.firebaseapp.com"
    });
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.isAuth = true;
        this.rootPage = TabsPage;
      }else{
        this.isAuth = false;
        this.rootPage = SigninPage;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  private cargarPagina(pagina: any): void {
    this.nav.setRoot(pagina);
    this.menuCtrl.close();
  }

  private desconectarse(): void {
    let loading = this.loadingCtrl.create({
      content: 'Desconectando...'
    });
    loading.present();
    this.authService.desconectar()
      .then( d => {
        this.menuCtrl.close();
        loading.dismiss();
      })
      .catch(err=>{
        console.log(err);
        this.alertCtrl.create({
          title: "Fallo al desconectar.",
          message: err.message,
          buttons: ['Ok']
        }).present();
        loading.dismiss();
      });
  }

}

