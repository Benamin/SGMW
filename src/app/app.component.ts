import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {Storage} from "@ionic/storage";
import {HomePage} from "../pages/home/home";
import {LoginService} from "../pages/login/login.service";
import {CommonService} from "../core/common.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(private platform: Platform,private statusBar: StatusBar,private commonSer:CommonService,
              private splashScreen: SplashScreen,private storage:Storage,private loginSer:LoginService) {
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
    this.storage.get('loginData').then(value => {
      console.log(value);
      if(value){
        this.imitateLogin(value);
      }else{
        this.rootPage = LoginPage;
      }
    });
  }

  imitateLogin(logindata){
    this.loginSer.sgmwLogin(logindata).subscribe(
        (res) => {
          if (res.code == 200) {
            this.storage.set('Authorization', res.data.Token);
            this.storage.set('user', res.data.User);
            this.storage.set('loginData', logindata);
            this.rootPage = TabsPage;
          } else {
            this.rootPage = LoginPage;
            this.commonSer.toast(res.message);
            this.storage.clear();
          }
        }
    )
  }
}
