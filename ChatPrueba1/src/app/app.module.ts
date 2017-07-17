import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';

const firebaseAuth = {
  apiKey: "AIzaSyAb0HxQhbX0YJ81gHHskY647as1Fp83ZdA",
  authDomain: "ionic-chat-prueba.firebaseapp.com",
  databaseURL: "https://ionic-chat-prueba.firebaseio.com",
  projectId: "ionic-chat-prueba",
  storageBucket: "ionic-chat-prueba.appspot.com",
  messagingSenderId: "831925458983"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
