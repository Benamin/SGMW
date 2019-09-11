import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Slides} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {LoginService} from "./login.service";
import {Storage} from "@ionic/storage";
import {AppService} from "../../app/app.service";
import {CommonService} from "../../core/common.service";
import {CheckCodeComponent} from "../../components/check-code/check-code";
import {Keyboard} from "@ionic-native/keyboard";
import {StatusBar} from "@ionic-native/status-bar";


@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    @ViewChild('checkCodeJunke') checkCodeJunke: CheckCodeComponent;
    @ViewChild('checkCodeXszs') checkCodeXszs: CheckCodeComponent;
    @ViewChild('checkCodeGys') checkCodeGys: CheckCodeComponent;
    @ViewChild('checkCodeYG') checkCodeYG: CheckCodeComponent;


    @ViewChild(Slides) slides: Slides;

    //供应商
    gysObj = {
        LoginName: '',
        Password: '',
        codeRight: '',
        inputCode: ''
    };

    //员工
    ygObj = {
        LoginName: '',
        Password: '',
        codeRight: '',
        inputCode: ''
    }

    //经销商
    jxs = {
        junke: {
            Jxsh: '',
            LoginName: '',
            password: '',
            UserType: '',
            codeRight: '',
            inputCode: ''
        },
        xszs: {
            LoginName: '',
            password: '',
            UserType: '',
            codeRight: '',
            inputCode: ''
        }
    };

    loginObj = {
        type: "jxs",
        platform: 'xszs',
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private loginSer: LoginService, private storage: Storage, private appSer: AppService,
                private commonSer: CommonService, private keyboard: Keyboard, public statusBar: StatusBar) {
        this.statusBar.backgroundColorByHexString('#1a1a1a');
    }

    ionViewDidLoad() {
        this.checkCodeXszs.drawPic();
        this.checkCodeJunke.drawPic();
        this.checkCodeGys.drawPic();
        this.checkCodeYG.drawPic();
    }

    //平台登录切换
    changeSlide(index, platform) {
        console.log(index);
        this.loginObj.platform = platform;
        this.slides.slideTo(index, 300);
    }

    //员工
    ygLogin() {
        if (!this.ygObj.LoginName || !this.ygObj.Password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.ygObj.codeRight != this.ygObj.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        this.loginSer.loginpost(this.ygObj).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code == 200) {
                    this.storage.set('Authorization', res.data.Token);
                    this.storage.set('user', res.data.User);
                    this.navCtrl.setRoot(TabsPage);
                } else {
                    this.storage.clear();
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //供应商
    gysLogin() {
        if (!this.gysObj.LoginName || !this.gysObj.Password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.gysObj.codeRight != this.gysObj.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        this.loginSer.loginpost(this.gysObj).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code == 200) {
                    this.storage.set('Authorization', res.data.Token);
                    this.storage.set('user', res.data.User);
                    this.navCtrl.setRoot(TabsPage);
                } else {
                    this.storage.clear();
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //销售助手 --经销商登录
    loginXszsJsx() {
        if (this.jxs.xszs.codeRight != this.jxs.xszs.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        this.loginSer.sgmwLogin(this.jxs.xszs).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code == 200) {
                    this.storage.set('Authorization', res.data.Token);
                    this.storage.set('user', res.data.User);
                    this.storage.set('loginData', this.jxs);
                    this.navCtrl.setRoot(TabsPage);
                } else {
                    this.storage.clear();
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //骏客---经销商登录
    loginJunkeJsx() {
        if (this.jxs.junke.codeRight != this.jxs.junke.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        this.loginSer.sgmwLoginJK(this.jxs.junke).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code == 200) {
                    this.storage.set('Authorization', res.data.Token);
                    this.storage.set('user', res.data.User);
                    this.storage.set('loginData', this.jxs);
                    this.navCtrl.setRoot(TabsPage);
                } else {
                    this.storage.clear();
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //重新获取验证码
    flashCode() {
        if (this.loginObj.type == 'jxs' && this.loginObj.platform == 'xszs') this.checkCodeXszs.drawPic();
        if (this.loginObj.type == 'jxs' && this.loginObj.platform == 'junke') this.checkCodeJunke.drawPic();
        if (this.loginObj.type == 'gys') this.checkCodeGys.drawPic();
        if (this.loginObj.type == 'yg') this.checkCodeYG.drawPic();
    }

    //验证码获取
    getCodeXszs(e) {
        this.jxs.xszs.codeRight = e;
    }

    getCodeJunke(e) {
        this.jxs.junke.codeRight = e;
    }

    getCodeGys(e) {
        this.gysObj.codeRight = e;
    }

    getCodeYg(e) {
        this.ygObj.codeRight = e;
    }

}
