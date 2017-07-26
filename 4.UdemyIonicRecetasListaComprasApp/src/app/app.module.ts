import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ModeTipoPipe } from "../pages/edit-receta/mode.pipe";
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { ListaComprasPage } from '../pages/lista-compras/lista-compras';
import { RecetasPage } from "../pages/recetas/recetas";
import { ListaComprasService } from "../services/lista-compras.service";
import { EditRecetaPage } from "../pages/edit-receta/edit-receta";

@NgModule({
  declarations: [
    MyApp,
    ModeTipoPipe,
    TabsPage,
    ListaComprasPage,
    RecetasPage,
    EditRecetaPage
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
    EditRecetaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ListaComprasService
  ]
})
export class AppModule {}
