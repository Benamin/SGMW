import {Component} from '@angular/core';
import {NavParams, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {Storage} from "@ionic/storage";
import {HomePage} from "../pages/home/home";
import {LoginService} from "../pages/login/login.service";
import {CommonService} from "../core/common.service";
import {timer} from "rxjs/observable/timer";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;
    showSplash = false;
    loadUrl;

    constructor(private platform: Platform, private statusBar: StatusBar, private commonSer: CommonService,
                private splashScreen: SplashScreen, private storage: Storage, private loginSer: LoginService) {
        this.platform.ready().then(() => {
            this.showSplash = true;
            this.getLoad();

            this.splashScreen.hide();
            this.statusBar.show();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#343435');
            this.statusBar.styleLightContent();

            //骏客app权限校验
            if (window.localStorage.getItem('source')) {
                const source = window.localStorage.getItem('source');
                const token = window.localStorage.getItem('token');
                if (source == "Junke") this.trainAuth(token);
            } else {
                this.checkLogin();
            }
        });
    }

    //app启动图
    getLoad() {
        this.loginSer.GetAppPic().subscribe(
            (res) => {
                if (res.data.NewsItems.length > 0) {
                    this.loadUrl = res.data.NewsItems[0].SourceUrl;
                    timer(3000).subscribe(() => this.showSplash = false)
                } else {
                    this.showSplash = false;
                }
            }
        )
    }


    checkLogin() {
        this.storage.get('loginData').then(value => {
            console.log(value);
            if (value) {
                this.rootPage = LoginPage;
                // this.imitateLogin(value);
            } else {
                this.rootPage = LoginPage;
            }
        });
    }

    async trainAuth(token) {
        const data = <any>{};
        await this.loginSer.JunkeTrainAuth(token).subscribe(
            (res) => {
                if (res.status) {
                    data.LoginName = res.data.userAccount;
                    data.Jxsh = res.data.dealerCode;
                    this.initLogin(data);
                } else {
                    this.commonSer.toast(res.msg);
                }
                console.log(res);
            }
        );
    }

    initLogin(data) {
        this.loginSer.JunkeLogin(data).subscribe(
            (res) => {
                console.log(res);
                if (res.code == 200) {
                    this.storage.set('Authorization', res.data.Token);
                    this.storage.set('user', res.data.User);
                    // this.storage.set('loginData', logindata);
                    this.rootPage = TabsPage;
                } else {
                    this.rootPage = LoginPage;
                    this.commonSer.toast(res.message);
                    this.storage.clear();
                }
            }
        )
    }

    imitateLogin(logindata) {
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
