import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { FavoritosPage } from '../pages/favoritos/favoritos';
import { BibliotecaPage } from '../pages/biblioteca/biblioteca';
import { FrasesPage } from '../pages/frases/frases';
import { FrasePage } from '../pages/frases/frase/frase';

import { FrasesService } from '../services/frases';

@NgModule({
  declarations: [
    MyApp,
    FavoritosPage,
    BibliotecaPage,
    TabsPage,
    FrasesPage,
    FrasePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FavoritosPage,
    BibliotecaPage,
    TabsPage,
    FrasesPage,
    FrasePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FrasesService
  ]
})
export class AppModule {}
