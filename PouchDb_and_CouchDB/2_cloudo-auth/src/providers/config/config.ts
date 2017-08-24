import { Injectable } from '@angular/core';

@Injectable()
export class Config {

  static readonly SUPERLOGIN_URL: string = 'http://192.168.11.29:3000';

  constructor() {
  }

}
