import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {Storage} from "@ionic/storage";
import {HomePage} from "../pages/home/home";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private storage:Storage) {
    platform.ready().then(() => {
      splashScreen.hide();
      statusBar.show();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#343435');
      statusBar.styleLightContent();
      this.checkLogin();
    });
  }


  checkLogin(){
    const auth = this.storage.get('Authorization');
    if(auth){
      this.rootPage = LoginPage;
    }else{
      this.rootPage = LoginPage;
    }
  }
}
