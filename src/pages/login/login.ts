import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
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
    @ViewChild('checkCode') checkCode: CheckCodeComponent;

    //学员
    user = {
        LoginName: 'sgmwadmin',
        Password: 'P@ssw0rd',
        codeRight: '',
        inputCode: ''
    };

    //经销商
    jxs = {
        Jxsh: '',
        LoginName: '',
        password: '',
        UserType: '',
        codeRight: '',
        inputCode: ''
    };

    bodyHeight;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private loginSer: LoginService, private storage: Storage, private appSer: AppService,
                private commonSer: CommonService,private keyboard: Keyboard,public statusBar:StatusBar) {
        this.statusBar.backgroundColorByHexString('#1a1a1a');
    }

    ionViewDidLoad() {
        this.checkCode.drawPic();
    }

    login() {
        if (!this.user.LoginName || !this.user.Password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.user.codeRight != this.user.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        this.loginSer.loginpost(this.user).subscribe(
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

    loginJsx() {
        if(this.jxs.codeRight != this.jxs.inputCode){
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        this.loginSer.sgmwLogin(this.jxs).subscribe(
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
        this.checkCode.drawPic();
    }

    getCode(e) {
        this.user.codeRight = e;
        this.jxs.codeRight = e;
    }

}
