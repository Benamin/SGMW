import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
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
    FWZS_appid, FWZS_client_id, FWZS_SecretKey,
    JunKe_client_id, JunKe_PRIVATE_KEY,
    NoUserMsg,
    sgmw_client_id,
    XSZS_appId,
    XSZS_appKey,
    XSZS_client_id
} from "../../app/app.constants";
import {DatePipe} from "@angular/common";
import {RandomWordService} from "../../secret/randomWord.service";
import {GlobalData} from "../../core/GlobleData";
import {JPush} from "@jiguang-ionic/jpush";
import {UserAgreementComponent} from "../../components/user-agreement/user-agreement";

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
    @ViewChild('checkCodeFWZS') checkCodeFWZS: CheckCodeComponent;


    @ViewChild(Slides) slides: Slides;
    checkBox = true;

    //供应商
    gysObj = {
        grant_type: 'password',
        client_id: sgmw_client_id,
        username: '',
        password: '',
        usertype: 'GYS',
        codeRight: '',
        inputCode: ''
    };

    //员工
    ygObj = {
        grant_type: 'password',
        client_id: sgmw_client_id,
        username: '',
        password: '',
        usertype: 'SGMW',
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

    //服务助手
    fwzsObj = {
        stationNo: '', //服务站号
        stationBranch: '',
        userName: '',  //用户名
        password: '',  //密码
        codeRight: '',
        inputCode: ''
    }

    noUserMsg = NoUserMsg;
    loading;

    RegiID;   //jPush注册ID

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private datePipe: DatePipe,
                private jPush: JPush,
                private modalCtrl: ModalController,
                private randomWord: RandomWordService,
                private globalData: GlobalData,
                private loginSer: LoginService, private storage: Storage, private appSer: AppService,
                private commonSer: CommonService, private keyboard: Keyboard, public statusBar: StatusBar) {
        this.statusBar.backgroundColorByHexString('#1a1a1a');
        this.loading = this.loadCtrl.create({
            content: '登录中...'
        });
    }

    ionViewDidLoad() {
        this.checkCodeXszs.drawPic();
        this.checkCodeJunke.drawPic();
        this.checkCodeGys.drawPic();
        this.checkCodeYG.drawPic();
        this.checkCodeFWZS.drawPic();
    }

    userRoleName = '销售助手';

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
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        this.userRoleName = '员工';
        this.setRoleNames();
        if (!this.ygObj.username || !this.ygObj.password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.ygObj.codeRight != this.ygObj.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }

        this.loading.present();
        this.loginSer.connectToken(this.ygObj).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            },
            (error1) => {
                this.loading.dismiss()
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    //供应商
    gysLogin() {
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        // 供应商
        this.userRoleName = '供应商';
        this.setRoleNames();
        if (!this.gysObj.username || !this.gysObj.password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.gysObj.codeRight != this.gysObj.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        this.loading.present();
        this.loginSer.connectToken(this.gysObj).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            },
            (error1) => {
                this.loading.dismiss();
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    /***销售助手***/
    loginXszsJsx() {
        this.userRoleName = '销售助手';
        this.setRoleNames();
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        if (this.jxs.xszs.codeRight != this.jxs.xszs.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }

        this.loading.present();
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
                if (res.success == "true") {
                    this.connectTokenByXSZS(res.data);
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            }, error1 => {
                this.loading.dismiss();
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
            czydm: res.czydm,
            usertype: 'JXS',
        };
        this.loginSer.connectToken(data).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            },
            (error1) => {
                this.loading.dismiss();
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    /***end***/

    /***骏客***/
    //骏客---经销商登录
    loginJunkeJsx() {
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        this.userRoleName = '骏客';
        this.setRoleNames();
        let encrypt = new JSEncrypt();
        if (this.jxs.junke.codeRight != this.jxs.junke.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }

        this.loading.present();
        encrypt.setPublicKey(JunKe_PRIVATE_KEY);
        const password = encrypt.encrypt(this.jxs.junke.password);
        const data = {
            "userName": this.jxs.junke.username.trim(),
            "password": password
        };
        this.loginSer.JunkeAppAuthCas(data).subscribe(
            (res) => {
                if (res.status) {
                    this.connectTokenByJunKe(res.data);
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.msg);
                }
            }, error => {
                this.loading.dismiss();
                this.commonSer.alert(error.error.errorMsg);
            }
        )
    }

    //获取junke token
    connectTokenByJunKe(res) {
        const data = {
            grant_type: "password",
            client_id: JunKe_client_id,
            username: this.jxs.junke.username,
            jxsh: res.dealerCode,
            usertype: 'JK',
        };
        this.loginSer.connectToken(data).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            }, error1 => {
                this.loading.dismiss();
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    /***end***/

    /***服务助手登录***/
    fwzsLogin() {
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        this.userRoleName = '服务助手';
        this.setRoleNames();
        if (!this.fwzsObj.userName || !this.fwzsObj.password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.fwzsObj.codeRight != this.fwzsObj.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }

        this.loading.present();
        const d = Date.now();
        const timeStamp = Math.round(d / 1000) + '';
        const nonce = this.randomWord.uuidNum();
        let stationNo = this.fwzsObj.stationNo;
        let stationBranch = this.fwzsObj.stationBranch;
        if (this.fwzsObj.stationNo.length == 9) {
            stationNo = this.fwzsObj.stationNo.substring(0, 7);
            stationBranch = this.fwzsObj.stationNo.substring(7, 9);
        }
        const content = {
            "stationNo": stationNo,
            "stationBranch": stationBranch,
            "userName": this.fwzsObj.userName.trim(),
            "password": this.fwzsObj.password,
        };
        const sign = `appId=${FWZS_appid}&secretKey=${FWZS_SecretKey}&timeStamp=${timeStamp}&nonce=${nonce}&content=${JSON.stringify(content)}`;
        const header = {
            appId: FWZS_appid,
            nonce: nonce,
            timeStamp: timeStamp,
            sign: this.randomWord.hex_md5(sign)
        };
        this.loginSer.fwzsLogin(content, header).subscribe(
            (res) => {
                if (res.code == "1") {
                    this.connectTokenByFWZS(content);
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.message);
                }
            }, error1 => {
                this.loading.dismiss();
                const error = error1.error.error;
                this.commonSer.alert(error);
            }
        )
    }

    //获取token --服务助手
    connectTokenByFWZS(res) {
        const data = {
            grant_type: "password",
            client_id: FWZS_client_id,
            username: res.userName,
            jxsh: this.fwzsObj.stationNo,
            usertype: 'SERVICE',
        };
        this.loginSer.connectToken(data).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.error);
                }
            },
            (error1) => {
                this.loading.dismiss();
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
                    // 获取用户角色 列表  存储用户角色
                    if (res.data.MainUserID && res.data.MainUserID === '00000000-0000-0000-0000-000000000000') {
                        this.userAsync(res);
                        this.updateRegID(res);
                    } else {
                        this.loginSer.GetMyInfo().subscribe(res2 => {
                            if (res2.data) {
                                this.storage.set('CurrentRole', {
                                    CurrentRoleID: res2.data.CurrentRoleID,
                                    CurrentRoleName: res2.data.CurrentRoleNames
                                });
                                this.userAsync(res);
                                this.updateRegID(res);
                                this.storage.set('RoleID', res2.data.CurrentRoleID);
                            }
                        })
                    }
                } else {
                    this.loading.dismiss();
                    this.storage.clear();
                    this.commonSer.alert(res.message);
                }
            }
        )
    }

    //jPush提交用户信息
    updateRegID(res) {
        this.jPush.getRegistrationID().then((regiID) => {
            if (regiID) {
                this.RegiID = regiID;
                this.uploadRegID(res);
            } else {
                setTimeout(() => {
                    this.updateRegID(res)
                }, 2000);
            }
        })
    }

    uploadRegID(res) {
        const data = {
            UserId: res.data.UserId,
            RegId: this.RegiID
        };
        this.loginSer.UpdateUserRegID(data).subscribe(
            (res) => {
                if (!res.data) {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //用户是否同步
    userAsync(res) {
        this.loading.dismiss();
        if (res.data.LoginUserId == '00000000-0000-0000-0000-000000000000') {
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

    getCodeFwzs(e) {
        this.fwzsObj.codeRight = e;
    }

    // 储存用户角色
    setRoleNames() {
        this.storage.set('RoleName', this.userRoleName);
    }

    openModal() {
        const modal = this.modalCtrl.create(UserAgreementComponent);
        modal.present();
    }
}
