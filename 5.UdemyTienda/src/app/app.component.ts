import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";

import { Config } from "../providers/config/config";
import { ClientesProvider } from "../providers/clientes/clientes";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = "TabsPage";

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private clienteServ: ClientesProvider,
    private util: Config
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  private indexDb(): void {
    let loading = this.util.showLoading();
    this.clienteServ
      .indexDbClientes()
      .then(res => {
        loading.dismiss();
        this.util.showToast("Indice construido");
      })
      .catch(err => {
        this.util.errorHandler(err.message, err, loading);
      });
  }
}
