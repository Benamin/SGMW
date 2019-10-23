import {Component, ElementRef, ViewChild} from '@angular/core';
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
import {JunKe_client_id, NoUserMsg} from "./app.constants";
import {AppVersion} from "@ionic-native/app-version";
import {AppUpdateService} from "../core/appUpdate.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('loadImg') loadImg: ElementRef;

    rootPage: any;
    showSplash = true;

    load = {
        imgUrl: null,
        httpUrl: null
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
                    });
                } else {
                    this.splashScreen.hide();
                    this.showSplash = false;
                }
                timer(4000).subscribe(() => this.checkVersion())
                this.checkAuth();
            }
        )
    }

    imgLoad() {
        timer(500).subscribe(() => this.splashScreen.hide());
        console.log('图片加载完成')
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
                    this.connectTokenByJunKe(res.data);
                } else {
                    this.rootPage = LoginPage;
                    this.commonSer.toast(res.msg);
                }
            },
            (error) => {
                this.commonSer.alert(error.error.errorMsg);
                this.rootPage = LoginPage;
            }
        )
    }

    //获取骏客用户信息
    connectTokenByJunKe(res) {
        const data = {
            grant_type: "password",
            client_id: JunKe_client_id,
            username: res.userAccount,
            jxsh: res.dealerCode,
        };
        this.loginSer.connectToken(data).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            }, error1 => {
                this.rootPage = LoginPage;
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    /**
     * 销售助手app跳转登录
     * @param req jxsh->经销商号  jxsmc->经销商名称 czydm->操作员代码
     * czymc->操作员名称 czyzw->操作员职位
     * @constructor
     */
    XSZSLogin(req) {
        const data = {
            "grant_type": "password",
            "client_id": JunKe_client_id,
            "username": req.czymc,
            "jxsh": req.jxsh,
            "czydm": req.czydm,
        };
        this.loginSer.connectToken(data).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.rootPage = LoginPage;
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            }, error1 => {
                this.rootPage = LoginPage;
                const error = error1.error.error;
                this.commonSer.alert(error);
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

    //查询用户信息
    getUserInfo() {
        this.loginSer.GetUserInfoByUPN().subscribe(
            (res) => {
                if (res.code == 200 && res.data) {
                    this.userAsync(res);
                } else {
                    this.storage.clear();
                    this.commonSer.alert(res.message);
                }
            }
        )
    }

    //用户是否同步
    userAsync(res) {
        if (res.data.UserId == '00000000-0000-0000-0000-000000000000') {  //用户不存在
            this.rootPage = LoginPage;
            this.commonSer.alert(this.noUserMsg);
        } else {   //用户存在
            this.storage.set('user', res.data);
            timer(300).subscribe(e => {
                this.rootPage = TabsPage;
            })
        }
    }

    //检测版本
    checkVersion() {
        let versionCode;
        let platform;
        if (this.platform.is('ios')) platform = 'IOS';
        if (this.platform.is('android')) platform = 'android';
        this.appVersion.getVersionNumber().then((version: string) => {
            versionCode = version.replace('.','');
            const data = {
                code: platform
            }
            this.loginSer.GetAppVersionByCode(data).subscribe(
                (res) => {
                    const onlineVersion = res.data.AppVersion.replace('.','');
                    if (versionCode < onlineVersion) {
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
    openUrl() {
        if (this.load.httpUrl) {
            this.commonSer.openUrlByBrowser(this.load.httpUrl);
        }
    }
}
