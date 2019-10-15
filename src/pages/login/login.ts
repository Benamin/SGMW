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
import {timer} from "rxjs/observable/timer";
import {
    JunKe_client_id, JunKe_PRIVATE_KEY,
    NoUserMsg,
    sgmw_client_id,
    XSZS_appId,
    XSZS_appKey,
    XSZS_client_id
} from "../../app/app.constants";
import {DatePipe} from "@angular/common";
import {RandomWordService} from "../../secret/randomWord.service";

declare let md5: any;
declare let JSEncrypt: any;

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
        grant_type: 'password',
        client_id: sgmw_client_id,
        username: '',
        password: '',
        usertype: 'sgmw',
        codeRight: '',
        inputCode: ''
    };

    //员工
    ygObj = {
        grant_type: 'password',
        client_id: sgmw_client_id,
        username: '',
        password: '',
        usertype: 'gys',
        codeRight: '',
        inputCode: ''
    };

    //经销商
    jxs = {
        junke: {
            username: '',
            password: "",
            grant_type: '',
            client_id: JunKe_client_id,
            jxsh: '',
            codeRight: '',
            inputCode: ''
        },
        xszs: {
            jxsh: '',
            czymc: '',
            pwd: '',
            source: 'TrainingSystem',
            codeRight: '',
            inputCode: ''
        }
    };

    loginObj = {
        type: "jxs",
        platform: 'xszs',
    };

    noUserMsg = NoUserMsg;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private datePipe: DatePipe,
                private randomWord: RandomWordService,
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
        this.loginObj.platform = platform;
        this.slides.slideTo(index, 100);
    }

    //slide改变
    slideChange() {
        if (this.slides.realIndex == 0) this.loginObj.platform = "xszs";
        if (this.slides.realIndex == 1) this.loginObj.platform = "junke";
    }

    //员工
    ygLogin() {
        if (!this.ygObj.username || !this.ygObj.password) {
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
        this.loginSer.connectToken(this.ygObj).subscribe(
            (res) => {
                loading.dismiss();
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            }
        )
    }

    //供应商
    gysLogin() {
        if (!this.gysObj.username || !this.gysObj.password) {
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
        this.loginSer.connectToken(this.gysObj).subscribe(
            (res) => {
                loading.dismiss();
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            }
        )
    }

    /***销售助手***/
    // --经销商登录
    loginXszsJsx() {
        if (this.jxs.xszs.codeRight != this.jxs.xszs.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();

        const timestamp = this.datePipe.transform(new Date(), 'yyyyMMddHHmmss');
        const nonce = this.randomWord.uuid();
        const sign = XSZS_appId + XSZS_appKey + timestamp + nonce;
        const header = {
            appId: XSZS_appId,
            nonce: nonce,
            timestamp: timestamp,
            sign: this.randomWord.hex_md5(sign)
        };

        this.loginSer.sgmwLogin(this.jxs.xszs, header).subscribe(
            (res) => {
                loading.dismiss();
                if (res.success == "true") {
                    this.connectTokenByXSZS(res.data);
                } else {
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            },error1 => {
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    //获取token --销售助手
    connectTokenByXSZS(res) {
        const data = {
            grant_type: "password",
            client_id: XSZS_client_id,
            username: res.czymc,
            jxsh: res.jxsh,
            czydm: res.czydm
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
            },
            (error1) => {
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    /***end***/

    /***骏客***/
    //骏客---经销商登录
    loginJunkeJsx() {
        let encrypt = new JSEncrypt();
        if (this.jxs.junke.codeRight != this.jxs.junke.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        encrypt.setPublicKey(JunKe_PRIVATE_KEY);

        const password = encrypt.encrypt(this.jxs.junke.password);
        const data = {
            "userName": this.jxs.junke.username,
            "password": password
        };
        this.loginSer.JunkeAppAuthCas(data).subscribe(
            (res) => {
                loading.dismiss();
                if (res.status) {
                    this.connectTokenByJunKe(res.data);
                } else {
                    this.storage.clear();
                    this.commonSer.alert(res.msg);
                }
            }, (error => {
                loading.dismiss();
                this.commonSer.alert(error.error.errorMsg);
            })
        )
    }

    connectTokenByJunKe(res) {
        const data = {
            grant_type: "password",
            client_id: JunKe_client_id,
            username: this.jxs.junke.username,
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
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    /***end***/

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
        if (res.data.UserId == '00000000-0000-0000-0000-000000000000') {
            this.commonSer.alert(this.noUserMsg);
        } else {
            this.storage.set('user', res.data);
            this.navCtrl.setRoot(TabsPage);
        }
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
