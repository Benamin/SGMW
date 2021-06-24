import {Component, ElementRef, ViewChild} from '@angular/core';
import {
    App,
    IonicApp,
    LoadingController,
    MenuController,
    NavController,
    NavParams,
    Platform,
    ToastController
} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {Storage} from "@ionic/storage";
import {LoginService} from "../pages/login/login.service";
import {CommonService} from "../core/common.service";
import {timer} from "rxjs/observable/timer";
import {GetRequestService} from "../secret/getRequest.service";
import {
    JunKe_client_id,
    JunKe_HTTP_URL,
    LastVersion,
    NoUserMsg, NXSZS_client_id_app,
    NXSZS_HTTP_URL,
    XSZS_client_id
} from "./app.constants";
import {AppVersion} from "@ionic-native/app-version";
import {AppUpdateService} from "../core/appUpdate.service";
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";
import {AppService} from "./app.service";
import {Keyboard} from "@ionic-native/keyboard";
import {JPush} from "@jiguang-ionic/jpush";
import {JpushUtil} from "../core/jPush.util";
import {GlobalData} from "../core/GlobleData";
import {BackButtonService} from "../core/backButton.service";
import {EmitService} from "../core/emit.service";
import {SimulationTestPage} from "../pages/home/simulation-test/simulation-test";
import {HTTP} from "@ionic-native/http";
import {DataFormatService} from "../core/dataFormat.service";
import {Badge} from "@ionic-native/badge";
import {ScreenOrientation} from "@ionic-native/screen-orientation";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('loadImg') loadImg: ElementRef;

    rootPage: any;
    showSplash = true;

    load = {
        imgUrl: "",
        httpUrl: null
    };

    noUserMsg = NoUserMsg;
    loading;

    app = {
        UpdateTips: false,
        AppUrl: '',
        UpdateText: '',
    };
    isIOS = false;
    isIphone11IOS13 = false;
    isIphoneIOS13 = false;

    //控制硬件返回按钮是否触发，默认false
    backButtonPressed: boolean = false;

    //  1.false  正常返回上一层，2.true，禁止返回上一层，3.result,返回列表页面
    isDo = 'false';

    LastVersion = LastVersion;

    constructor(private platform: Platform, private statusBar: StatusBar, private commonSer: CommonService,
                private getRequest: GetRequestService, private appVersion: AppVersion,
                private appUpdate: AppUpdateService,
                public appCtrl: App,
                private screenOrientation: ScreenOrientation,
                private mobileAccess: MobileAccessibility,
                private appSer: AppService,
                private nativeHttp: HTTP,
                private Keyboard: Keyboard,
                private jPush: JPush,
                private dataForm: DataFormatService,
                public eventEmitSer: EmitService,
                private ionicApp: IonicApp,
                private menuCtrl: MenuController,
                public loadCtrl: LoadingController,
                private jPushUtil: JpushUtil,
                private globalData: GlobalData,
                public toastCtrl: ToastController,
                private splashScreen: SplashScreen, private storage: Storage, private loginSer: LoginService) {
        (window as any).handleOpenURL = (url: string) => {
            // this.commonSer.alert(`handleOpenURL：${url}`);
            (window as any).localStorage.setItem("app_url", url);
        };

        this.eventEmitSer.eventEmit.subscribe((value: any) => {
            if (isNaN(value)) {   //value为数字 代表消息
                this.isDo = value;
            }
        });
        this.platform.ready().then(() => {
            this.getLoad();

            console.log(this.platform.platforms());

            this.jPushUtil.initPush();
            //jpush推送
            this.jPush.init();
            this.jPush.setDebugMode(false);
            this.jPush.resetBadge();

            //注册android的物理返回键事件
            this.registerBackButtonAction();
            //app字体不跟随手机字体大小变化
            this.mobileAccess.usePreferredTextZoom(false);

            this.splashScreen.show();
            this.statusBar.show();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#F8F8F8');
            this.statusBar.styleDefault();

            //IOS兼容性方法
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
                    // this.isIOS = true;
                }
                if ((this.isIOS13OR14() && this.isIphoneXR()) || (this.isIOS13OR14() && this.isIphoneX())) {  //ios 13、14
                    // this.isIphone11IOS13 = true;
                }
                if (value == 'videoReset') {
                    // this.isIphone11IOS13 = false;
                    // this.isIphoneIOS13 = false;
                    return;
                }
                if (value == 'innerCourse' && this.isIphoneXR()) {  //iphone 11
                    // this.isIphone11IOS13 = true;
                    return;
                }
                if (value == 'innerCourse' && this.isIphoneX()) { //iphone X
                    // this.isIphone11IOS13 = true;
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

    //判断是否ios13、14
    isIOS13OR14() {
        const str = navigator.userAgent.toLowerCase();
        const ver = str.match(/cpu iphone os (.*?) like mac os/);
        const v = ver[1].replace(/_/g, ".");
        console.log("isIOS13OR14", v)
        if (v.includes('13') || v.includes('14')) {
            return true
        } else {
            return false;
        }
    }


    //app启动图
    getLoad() {
        this.loginSer.GetAppPic().subscribe(
            (res) => {
                if (res.data.NewsItems && res.data.NewsItems.length > 0) {
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

    /**
     * 原生跳转
     */
    checkAuth() {
        const req = <any>this.getRequest.getParams();
        console.log(req);
        if (req.JumpURL == "course") {   //新销售助手判断
            req.source = 'nxszs';
        }
        if (req.source != undefined && req.source) {
            const source = req.source;
            const token = req.token;
            if (source == "Junke") this.trainAuth(token);
            if (source == "xszs") this.XSZSLogin(req);
            if (source == 'nxszs') this.NXSZSLogin(req);
        } else {
            this.checkLogin();
        }
    }

    /**
     * 混合app跳转 或者h5跳转
     * @param url
     */
    checkAuthByHybrid(url) {
        const req = <any>this.getRequest.getParamsByHybrid(url);
        if (req.JumpURL == "course") {   //新销售助手判断
            req.Source = 'nxszs';
        }
        if (req.Source != undefined && req.Source) {
            const source = req.Source;
            if (source == 'nxszs') this.NXSZSLogin(req);
        }
    }

    //新宝骏助手鉴权
    trainAuth(token) {
        const data = <any>{};
        const header = {"jwt": token};
        this.nativeHttp.post(`${JunKe_HTTP_URL}/dmscloud.interfaceServer.yunyang/external/trainSys/tranAuth`, {}, header).then(
            (response) => {
                let res = JSON.parse(response.data);
                if (res.status) {
                    this.connectTokenByJunKe(res.data);
                } else {
                    this.rootPage = LoginPage;
                    this.commonSer.alert(res.msg);
                }
            },
        ).catch(error => {
            this.rootPage = LoginPage;
            this.commonSer.alert(JSON.stringify(error));
        })
    }

    /**
     * 新销售助手app跳转登录
     * sgmw://CourseId=c26e07c8-0882-44d7-8403-017371040d5d&&Source=nxszs&CardNo=110101193803074478&unionId=7417&Name=李某人&JumpURL=course
     * @param req accessToken:跳转到骏菱学社时带的access_token cardNo:身份证号码 unionId:跳转到骏菱学社时带的unionId
     * @constructor
     */
    NXSZSLogin(req) {
        const data = {
            // accessToken: req.accessToken,
            cardNo: req.CardNo,
            unionId: req.unionId
        }
        const header = {
            "clientId": 'elearning',
            "content-type": "application/x-www-form-urlencoded",
        }
        console.log('NXSZSLogin', JSON.stringify(data));
        this.showLoading();
        this.nativeHttp.setDataSerializer('urlencoded');
        this.nativeHttp.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
        this.nativeHttp.post(`${NXSZS_HTTP_URL}/user/api/checkUserByAccessToken`, data, header).then(
            (response) => {
                let res = JSON.parse(response.data);
                if (res.code == 200) {
                    console.log('NXSZSLogin', JSON.stringify(res))
                    this.storage.set('CourseId', req.CourseId);
                    req.Name = res.data.name;
                    this.connectTokenByNXSZS(req);
                } else {
                    this.dismissLoading();
                    this.rootPage = LoginPage;
                    this.commonSer.alert(res.msg);
                }
            }
        ).catch(error => {
            this.dismissLoading();
            this.rootPage = LoginPage;
            this.commonSer.alert(error.error);
        })
    }

    //获取新宝骏助手用户信息
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

    //获取新销售助手用户信息
    connectTokenByNXSZS(req) {
        const data = {
            grant_type: "password",
            client_id: NXSZS_client_id_app,
            Czydm: req.CardNo,
            UserName: req.Name,
        };
        console.log('connectTokenByNXSZS', JSON.stringify(data));
        this.loginSer.connectToken(data).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.dismissLoading();
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            }, error1 => {
                this.dismissLoading();
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
            "client_id": XSZS_client_id,
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

    //校验登录
    checkLogin() {
        this.storage.get('Authorization').then(AuthorizationValue => {
            if (AuthorizationValue) {
                this.rootPage = TabsPage;
                // this.rootPage = SimulationTestPage;
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
                    this.dismissLoading();
                    this.storage.clear();
                    this.commonSer.alert(res.message);
                }
            }
        )
    }

    //用户是否同步 并查询ROLEID
    userAsync(res) {
        this.loginSer.GetMyInfo().subscribe(res2 => {
            this.dismissLoading();
            if (res2.data) {
                this.storage.set('CurrentRole', {
                    CurrentRoleID: res2.data.CurrentRoleID,
                    CurrentRoleName: res2.data.CurrentRoleNames
                });
                this.storage.set('RoleID', res2.data.CurrentRoleID);
                this.storage.set('user', res.data);
                this.storage.set('lastVersion', this.LastVersion);
                this.rootPage = TabsPage;
            }
        })
    }

    //检测版本
    checkVersion() {
        let localVersion;
        let platform;
        if (this.platform.is('ios')) platform = 'IOS';
        if (this.platform.is('android')) platform = 'android';
        this.appVersion.getVersionNumber().then((version: string) => {
            localVersion = version.split('.').join('');  //2123
            const data = {
                code: platform
            }
            this.loginSer.GetAppVersionByCode(data).subscribe(
                (res) => {
                    const onlineVersion = res.data.AppVersion.split('.').join('');  //2200
                    if (localVersion < onlineVersion) {
                        this.app.UpdateTips = true;
                        this.app.AppUrl = res.data.AppUrl;
                        this.app.UpdateText = res.data.UpdateText;
                    }
                }
            )
        }).catch(err => {
        });
    }


    //打开链接
    openUrl() {
        if (this.load.httpUrl) {
            this.commonSer.openUrlByBrowser(this.load.httpUrl);
        }
    }

    //注册方法
    registerBackButtonAction(): void {

        this.platform.registerBackButtonAction(() => {
            this.screenOrientation.lock('portrait');  //竖屏
            //隐藏toast || modal || loading || Overlay
            let activePortal = this.ionicApp._toastPortal.getActive() ||
                this.ionicApp._overlayPortal.getActive() ||
                this.ionicApp._modalPortal.getActive();
            let loadingPortal = this.ionicApp._loadingPortal.getActive();
            if (activePortal) {
                //其他的关闭
                activePortal.dismiss().catch(() => {
                });
                activePortal.onDidDismiss(() => {
                });
                return;
            } else if (this.menuCtrl.isOpen()) {
                this.menuCtrl.close(); //关闭sidemenu
                return;
            }
            if (loadingPortal) {
                //loading的话，返回键无效
                activePortal.dismiss(() => {
                })
                return;
            }
            let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
            //如果可以返回上一页，则执行pop
            if (activeNav.canGoBack()) {
                if (this.isDo === 'false') {  //正常返回
                    activeNav.pop();
                }
                if (this.isDo === 'result') {
                    let index = activeNav.length() - 2;
                    activeNav.remove(2, index)
                }
            } else {
                //如果可以返回上一页，则执行pop()
                if (activeNav.canGoBack()) {
                    activeNav.pop();
                } else {
                    this.showExit();
                }

            }
        });
    }

    //退出应用方法
    private showExit(): void {
        //如果为true，退出
        if (this.backButtonPressed) {
            // this.logoutSer.logout();
            this.platform.exitApp();
        } else {
            //第一次按，弹出Toast
            this.toastCtrl.create({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'middle'
            }).present();
            //标记为true
            this.backButtonPressed = true;
            //两秒后标记为false，如果退出的话，就不会执行了
            setTimeout(() => this.backButtonPressed = false, 2000);
        }
    }

    //loading实例只能当前使用 当前销毁 故创建一个方法 判断是否存在loading
    showLoading() {
        if (!this.loading) {
            this.loading = this.loadCtrl.create({
                content: '',
            });
            this.loading.present();
        }
    }

    dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }
}
