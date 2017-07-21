import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { ConfiguracionesPage } from '../pages/configuraciones/configuraciones';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private tabsPage: any = TabsPage;
  private configsPage: any = ConfiguracionesPage;
  @ViewChild('nav') nav: NavController;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private menuCrl: MenuController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  private cargarPagina(pagina: any): void {
    this.nav.setRoot(pagina);
    this.menuCrl.close();
  }


}

