import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { ListaComprasPage } from '../pages/lista-compras/lista-compras';
import { RecetasPage } from "../pages/recetas/recetas";
import { EditRecetaPage } from "../pages/edit-receta/edit-receta";
import { RecetaPage } from "../pages/recetas/receta/receta";
import { SignupPage } from "../pages/signup/signup";
import { SigninPage } from "../pages/signin/signin";

import { ListaComprasService } from "../services/lista-compras.service";
import { RecetaService } from "../services/receta.service";

import { ModeTipoPipe } from "../pages/edit-receta/mode.pipe";

@NgModule({
  declarations: [
    MyApp,
    ModeTipoPipe,
    TabsPage,
    ListaComprasPage,
    RecetasPage,
    EditRecetaPage,
    RecetaPage,
    SigninPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    ListaComprasPage,
    RecetasPage,
    EditRecetaPage,
    RecetaPage,
    SigninPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ListaComprasService,
    RecetaService
  ]
})
export class AppModule {}
