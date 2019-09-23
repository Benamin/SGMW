import {Component} from '@angular/core';
import {NavParams, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {Storage} from "@ionic/storage";
import {LoginService} from "../pages/login/login.service";
import {CommonService} from "../core/common.service";
import {timer} from "rxjs/observable/timer";
import {GetRequestService} from "../secret/getRequest.service";
import {NoUserMsg} from "./app.constants";
import {AppVersion} from "@ionic-native/app-version";
import {AppUpdateService} from "../core/appUpdate.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;
    showSplash = true;
    loadUrl;

    noUserMsg = NoUserMsg;

    app = {
        UpdateTips: false,
        AppUrl: '',
        UpdateText: '',
    };

    constructor(private platform: Platform, private statusBar: StatusBar, private commonSer: CommonService,
                private getRequest: GetRequestService, private appVersion: AppVersion,
                private appUpdate: AppUpdateService,
                private splashScreen: SplashScreen, private storage: Storage, private loginSer: LoginService) {
        this.platform.ready().then(() => {
            this.getLoad();
            this.statusBar.show();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#343435');
            this.statusBar.styleLightContent();
        });
    }


    //app启动图
    getLoad() {
        this.loginSer.GetAppPic().subscribe(
            (res) => {
                if (res.data.NewsItems.length > 0) {
                    this.loadUrl = res.data.NewsItems[0].SourceUrl;
                    timer(3000).subscribe(() => this.showSplash = false)
                    timer(3500).subscribe(() => this.checkVersion())
                } else {
                    this.showSplash = false;
                }
                timer(500).subscribe(() => this.splashScreen.hide())
                this.checkAuth();
            }
        )
    }

    //鉴权
    checkAuth() {
        //骏客app权限校验
        const req = <any>this.getRequest.getParams();
        // alert("req:" + JSON.stringify(req));
        if (req.source != undefined && req.source) {
            const source = req.source;
            const token = req.token;
            if (source == "Junke") this.trainAuth(token);
        } else {
            this.checkLogin();
        }
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
                    this.rootPage = LoginPage;
                    this.commonSer.toast(res.msg);
                }
            }
        );
    }

    checkLogin() {
        this.storage.get('Authorization').then(value => {
            if (value) {
                this.rootPage = TabsPage;
                // this.imitateLogin(value);
            } else {
                this.rootPage = LoginPage;
            }
        });
    }


    initLogin(data) {
        this.loginSer.JunkeLogin(data).subscribe(
            (res) => {
                if (res.code == 200 && res.data) {
                    this.userAsync(res);
                } else {
                    this.rootPage = LoginPage;
                    this.commonSer.alert(res.message);
                    this.storage.clear();
                }
            }
        )
    }

    //用户是否同步
    userAsync(res) {
        if (res.data.User.UserId == '00000000-0000-0000-0000-000000000000') {
            this.rootPage = TabsPage;
            this.commonSer.alert(this.noUserMsg);
        } else {
            this.storage.set('Authorization', res.data.Token);
            this.storage.set('user', res.data.User);
            timer(300).subscribe(e => {
                this.rootPage = TabsPage;
            })
        }
    }

    imitateLogin(logindata) {
        this.loginSer.sgmwLogin(logindata).subscribe(
            (res) => {
                if (res.code == 200 && res.data) {
                    this.storage.set('Authorization', res.data.Token);
                    this.storage.set('user', res.data.User);
                    this.rootPage = TabsPage;
                } else {
                    this.rootPage = LoginPage;
                    this.commonSer.alert(res.message);
                    this.storage.clear();
                }
            }
        )
    }

    //检测版本
    checkVersion() {
        let versionCode;
        let platform;
        if (this.platform.is('ios')) platform = 'IOS';
        if (this.platform.is('android')) platform = 'android';
        this.appVersion.getVersionNumber().then((version: string) => {
            versionCode = version;
            const data = {
                code: platform
            }
            this.loginSer.GetAppVersionByCode(data).subscribe(
                (res) => {
                    if (versionCode != res.data.AppVersion) {
                        this.app.UpdateTips = true;
                        this.app.AppUrl = res.data.AppUrl;
                        this.app.UpdateText = res.data.UpdateText;
                    }
                }
            )
        }).catch(err => {
            console.log(err);
        });
    }
}
