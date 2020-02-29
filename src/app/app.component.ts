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
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";
import {AppService} from "./app.service";
import {Keyboard} from "@ionic-native/keyboard";
import {JPush} from "@jiguang-ionic/jpush";
import {JpushUtil} from "../core/jPush.util";
import {GlobalData} from "../core/GlobleData";

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
    isIOS = false;
    isIphone11IOS13 = false;
    isIphoneIOS13 = false;

    constructor(private platform: Platform, private statusBar: StatusBar, private commonSer: CommonService,
                private getRequest: GetRequestService, private appVersion: AppVersion,
                private appUpdate: AppUpdateService,
                private mobileAccess: MobileAccessibility,
                private appSer: AppService,
                private Keyboard: Keyboard,
                private jPush: JPush,
                private jPushUtil: JpushUtil,
                private globalData: GlobalData,
                private splashScreen: SplashScreen, private storage: Storage, private loginSer: LoginService) {
        (window as any).handleOpenURL = (url: string) => {
            (window as any).localStorage.setItem("app_url", url);
        };
        this.platform.ready().then(() => {
            this.getLoad();

            this.jPush.init();
            this.jPush.setDebugMode(true);
            this.jPushUtil.initPush();
            this.jPush.resetBadge();

            //app字体不跟随手机字体大小变化
            this.mobileAccess.usePreferredTextZoom(false);
            this.splashScreen.show();
            this.statusBar.show();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#343435');
            this.statusBar.styleLightContent();
            this.compatibleIOS();
        });
    }

    //ios13兼容
    compatibleIOS() {
        this.appSer.iosInfo.subscribe(
            value => {
                if (!value) {
                    return
                }
                if (value == 'platformIOS') {
                    this.isIOS = true;
                }
                if (value == 'videoReset') {
                    this.isIphone11IOS13 = false;
                    this.isIphone11IOS13 = false;
                    this.isIphoneIOS13 = false;
                    return;
                }
                if (value == 'innerCourse' && this.isIOS13() && this.isIphoneXR()) {  //iphone 11
                    this.isIphone11IOS13 = true;
                    return;
                }
                if (value == 'innerCourse' && this.isIOS13() && this.isIphoneX()) { //iphone X
                    this.isIphone11IOS13 = true;
                    return;
                }
                if (value == 'innerCourse' && this.isIOS13()) {  //ios 13
                    this.isIphoneIOS13 = true;
                    return;
                }
            }
        )
    }

    isIphoneXR() {
        return /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896
    }

    isIphoneX() {
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
    }

    isIOS13() {
        const str = navigator.userAgent.toLowerCase();
        const ver = str.match(/cpu iphone os (.*?) like mac os/);
        const v = ver[1].replace(/_/g, ".");
        console.log(v)
        if (v.includes('13')) {
            return true
        } else {
            return false;
        }
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
            (err) => {
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
     * @param req jxsh->经销商号  jxsmc->经销商名称 czydm->操作员代码 czymc->操作员名称 czyzw->操作员职位
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
            versionCode = version.split('.').join('');
            const data = {
                code: platform
            }
            this.loginSer.GetAppVersionByCode(data).subscribe(
                (res) => {
                    const onlineVersion = res.data.AppVersion.split('.').join('');
                    if (versionCode != onlineVersion) {
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
