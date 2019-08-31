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

  constructor(private platform: Platform,private statusBar: StatusBar,private splashScreen: SplashScreen,private storage:Storage) {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.show();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#343435');
      this.statusBar.styleLightContent();
      this.checkLogin();
    });
  }


  checkLogin(){
    this.storage.get('Authorization').then(value => {
      if(value){
        this.rootPage = TabsPage;
      }else{
        this.rootPage = LoginPage;
      }
    });
  }
}
