import { Injectable } from '@angular/core';
import superlogin from 'superlogin-client';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


import { TodosProvider } from '../todos/todos';
import { DbProvider } from '../db/db';
import { Config } from '../config/config';

@Injectable()
export class AuthProvider {

  private config = {
    // An optional URL to API server, by default a current window location is used.
    serverUrl: 'http://192.168.11.29:3000',
    // The base URL for the SuperLogin routes with leading and trailing slashes (defaults to '/auth')
    baseUrl: '/auth',
    // Set this to true if you do not want the URL bar host automatically added to the list
    noDefaultEndpoint: false,
    // Where to save your session token: localStorage ('local') or sessionStorage ('session'), default: 'local'
    storage: 'local',
    // Sets when to check if the session is expired during the setup.
    // false by default.
    checkExpired: false,
    // A float that determines the percentage of a session duration, after which SuperLogin will automatically refresh the
    // token. For example if a token was issued at 1pm and expires at 2pm, and the threshold is 0.5, the token will
    // automatically refresh after 1:30pm. When authenticated, the token expiration is automatically checked on every
    // request. You can do this manually by calling superlogin.checkRefresh(). Default: 0.5
    refreshThreshold: 0.5,
    // The number of milliseconds before a request times out
    // If the request takes longer than `timeout`, the request will be aborted.
    // Default is 0, meaning it won't timeout.
    timeout: 0
  };

  constructor(
    public todosServ : TodosProvider,
    public dbServ: DbProvider
    ,private http: Http
  ) {
    superlogin.configure(this.config);
  }

  public login(
    credentials: { username: string, password: string }
  ): Promise<any> {
    return superlogin.login(credentials)
  }

  public logout(): Promise<any>{
    return superlogin.logout();
  }

  public register( registerData ): Promise<any>{
    return superlogin.register(registerData)
  }

  public isOnline(): Promise<any> {
    return this.http.get(`${Config.SUPERLOGIN_URL}/ping`)
    .toPromise()
  }

  public get isLogged(): boolean {
    return superlogin.authenticated();
  }

  public get dbUrl() : string {
    return superlogin.getDbUrl('supertest');
  }



}
