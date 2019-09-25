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

    load = {
        imgUrl:null,
        httpUrl:null
    };

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

            this.splashScreen.show();
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
                    this.load.imgUrl = res.data.NewsItems[0].SourceUrl;
                    this.load.httpUrl = res.data.NewsItems[0].SubTitle;
                    timer(3000).subscribe(() => {
                        this.showSplash = false;
                        this.checkAuth();
                    });
                     timer(4000).subscribe(() => this.checkVersion())
                } else {
                    this.showSplash = false;
                    this.checkAuth();
                }

                timer(1000).subscribe(() => this.splashScreen.hide())
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
            if (source == "xszs") this.XSZSLogin(req);
        } else {
            this.checkLogin();
        }
    }

    //骏客鉴权
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
        ), (err) => {
            this.rootPage = LoginPage;
        };
    }

    //销售助手app跳转登录
    XSZSLogin(req) {
        const data = {
            Jxsh: req.jxsh,
            Jxsmc: req.jxsmc,
            Czydm: req.czydm,
            Czymc: req.czymc,
            Czyzw: req.czyzw,
        };
        this.loginSer.XSZSLogin(data).subscribe(
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

    checkLogin() {
        this.storage.get('Authorization').then(value => {
            if (value) {
                this.rootPage = TabsPage;
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
        if (res.data.User.UserId == '00000000-0000-0000-0000-000000000000') {  //用户不存在
            this.rootPage = LoginPage;
            this.commonSer.alert(this.noUserMsg);
        } else {   //用户存在
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


    //打开链接
    openUrl(){
        if(this.load.httpUrl){
            this.commonSer.openUrlByBrowser(this.load.httpUrl);
        }
    }
}
