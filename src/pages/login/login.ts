import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Platform, Slides} from 'ionic-angular';
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
    FWZS_appid,
    FWZS_client_id,
    FWZS_HTTP_URL,
    FWZS_SecretKey,
    JunKe_client_id,
    JunKe_HTTP_URL,
    JunKe_PRIVATE_KEY,
    LastVersion,
    LLZSNoUserMsg,
    NoUserMsg,
    NXSZS_client_id_login,
    NXSZS_client_secret,
    NXSZS_client_secret_phone,
    NXSZS_clientId,
    NXSZS_clientId_phone,
    NXSZS_HTTP_URL,
    sgmw_client_id,
    XSZS_appId,
    XSZS_appKey,
    XSZS_client_id,
    XSZS_HTTP_URL
} from "../../app/app.constants";
import {DatePipe} from "@angular/common";
import {RandomWordService} from "../../secret/randomWord.service";
import {GlobalData} from "../../core/GlobleData";
import {JPush} from "@jiguang-ionic/jpush";
import {UserAgreementComponent} from "../../components/user-agreement/user-agreement";
import {HTTP} from "@ionic-native/http";

declare let md5: any;
declare let JSEncrypt: any;

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    // @ViewChild('checkCodeJunke') checkCodeJunke: CheckCodeComponent;
    // @ViewChild('checkCodeXszs') checkCodeXszs: CheckCodeComponent;
    @ViewChild('checkCodeGys') checkCodeGys: CheckCodeComponent;
    @ViewChild('checkCodeYG') checkCodeYG: CheckCodeComponent;
    @ViewChild('checkCodeFWZS') checkCodeFWZS: CheckCodeComponent;
    @ViewChild('checkCodeLLZS') checkCodeLLZS: CheckCodeComponent;
    @ViewChild('checkCodeLLZSByPhone') checkCodeLLZSByPhone: CheckCodeComponent;


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
        llzs: {
            username: "",
            password: "",
            codeRight: "",
            inputCode: ""
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
        platform: 'llzs',
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

    LastVersion = LastVersion;  //是否最新版

    isMobile = true;
    llzsLoginType = 'userName';
    llzsPhone = {
        phone: "",
        code: "",
        smsUUID: "",
        codeRight: '',
        inputCode: "",
    }

    //发送短信倒计时
    clock;
    timeText = "发送验证码";
    disableBtn = false;


    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private datePipe: DatePipe,
                private jPush: JPush,
                private nativeHttp: HTTP,
                private modalCtrl: ModalController,
                private platform: Platform,
                private randomWord: RandomWordService,
                private globalData: GlobalData,
                private loginSer: LoginService, private storage: Storage, private appSer: AppService,
                private commonSer: CommonService, private keyboard: Keyboard, public statusBar: StatusBar) {
        this.statusBar.backgroundColorByHexString('#F8F8F8');
        console.log(this.platform.is('mobileweb'))
        console.log(this.platform.is('core'))
        if (this.platform.is('mobileweb') || this.platform.is('core')) {
            this.isMobile = false;
        }
    }

    ionViewDidLoad() {
        // this.checkCodeXszs.drawPic();
        // this.checkCodeJunke.drawPic();
        this.checkCodeGys.drawPic();
        this.checkCodeYG.drawPic();
        this.checkCodeFWZS.drawPic();
        this.checkCodeLLZS.drawPic();
        this.checkCodeLLZSByPhone.drawPic();
    }

    userRoleName = '销售助手';

    //平台登录切换
    changeSlide(type, index) {
        this.llzsLoginType = type;
        this.slides.slideTo(index, 100);
    }

    //slide改变
    slideChange() {
        if (this.slides.realIndex == 0) this.llzsLoginType = "userName";
        if (this.slides.realIndex == 1) this.llzsLoginType = "phone";
    }

    //员工
    ygLogin() {
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        this.userRoleName = 'SGMW内部员工';
        this.setRoleNames();
        if (!this.ygObj.username || !this.ygObj.password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.ygObj.codeRight != this.ygObj.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }

        this.showLoading();
        this.storage.set("LoginType", "SGMW内部员工")
        this.loginSer.connectToken(this.ygObj).subscribe(
            (res) => {
                if (res.access_token) {
                    this.storage.set('Authorization', res.access_token);
                    timer(300).subscribe(e => {
                        this.getUserInfo();
                    })
                } else {
                    this.dismissLoading();
                    this.storage.clear();
                    this.commonSer.alert(res.error || JSON.stringify(res));
                }
            },
            (error1) => {
                this.dismissLoading();
                const error = error1.error.error;
                this.commonSer.alert(error || JSON.stringify(error1.error));
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
        this.showLoading();
        this.storage.set("LoginType", "供应商")
        this.loginSer.connectToken(this.gysObj).subscribe(
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
            },
            (error1) => {
                this.dismissLoading();
                const error = error1.error.error;
                this.commonSer.alert(error || JSON.stringify(error1.error));
            }
        )
    }

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

        this.showLoading();
        this.storage.set("LoginType", "服务助手")
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
        console.log("content");
        console.log(content);
        console.log("header");
        console.log(header);

        if (this.isMobile) {
            this.nativeHttp.setDataSerializer('json');
            this.nativeHttp.post(`${FWZS_HTTP_URL}/login/userlogin`, content, header).then(
                (response) => {
                    let res = JSON.parse(response.data);
                    if (res.code == "1") {
                        this.connectTokenByFWZS(content);
                    } else {
                        this.dismissLoading();
                        this.storage.clear();
                        this.commonSer.alert(res.message || JSON.stringify(res));
                    }
                }
            ).catch(error => {
                this.dismissLoading();
                const message = error.error.error;
                if (message) {
                    this.commonSer.alert(JSON.stringify(message));
                } else {
                    this.commonSer.alert(JSON.stringify(error.error))
                }
            })
        } else {
            this.loginSer.fwzsLogin(content, header).subscribe(
                (res) => {
                    if (res.code == "1") {
                        this.connectTokenByFWZS(content);
                    } else {
                        this.dismissLoading();
                        this.storage.clear();
                        this.commonSer.alert(res.message || JSON.stringify(res));
                    }
                }, error1 => {
                    this.dismissLoading();
                    const error = error1.error.error;
                    this.commonSer.alert(error || JSON.stringify(error1.error));
                }
            )
        }
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
                    this.dismissLoading();
                    this.storage.clear();
                    this.commonSer.alert(res.error || JSON.stringify(res));
                }
            },
            (error1) => {
                this.dismissLoading();
                const error = error1.error.error;
                this.commonSer.alert(error || JSON.stringify(error1.error));
            }
        )
    }

    /***end***/

    /***菱菱助手登录***/
    //获取验证码
    sendCode() {
        const header = {
            client_id: NXSZS_clientId_phone
        };
        if (!this.llzsPhone.phone) {
            this.commonSer.toast("请输入手机号码")
            return
        }
        this.disableBtn = true;
        if (this.isMobile) {
            this.nativeHttp.get(NXSZS_HTTP_URL + `/user/api/smsCode/${this.llzsPhone.phone}`, "", header).then(
                response => {
                    let res = JSON.parse(response.data);
                    if (res.code == 200) {
                        this.countTime();
                        this.commonSer.toast("验证码发送成功");
                        this.llzsPhone.smsUUID = res.data.smsUUID;
                    } else {
                        this.disableBtn = true;
                    }
                    if (res.code == 500) this.commonSer.alert("网络错误!")
                    if (res.code == 905) this.commonSer.alert("该手机账号不存在！")
                    if (res.code == 906) this.commonSer.alert("发送失败！")
                    if (res.code == 907) this.commonSer.alert("请不要频繁发送验证码！")
                }
            ).catch(error => {
                this.dismissLoading();
                this.disableBtn = true;
                const message = JSON.parse(error.error);
                this.commonSer.alert(message.error_description || JSON.stringify(error.error));
            })
        } else {
            this.loginSer.LLZSGeTCode(this.llzsPhone.phone, header).subscribe(
                (res) => {
                    if (res.code == 200) {
                        this.countTime();
                        this.commonSer.toast("验证码发送成功");
                        this.llzsPhone.smsUUID = res.data.smsUUID;
                    } else {
                        this.disableBtn = true;
                    }
                    if (res.code == 500) this.commonSer.alert("网络错误!")
                    if (res.code == 905) this.commonSer.alert("该手机账号不存在！")
                    if (res.code == 906) this.commonSer.alert("发送失败！")
                    if (res.code == 907) this.commonSer.alert("请不要频繁发送验证码！")
                }
            )
        }
    }

    //手机验证码登录
    llzsLoginByPhone() {
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        if (!this.llzsPhone.phone || !this.llzsPhone.code) {
            this.commonSer.alert("请输入手机号码和短信验证码");
            return
        }
        if (this.llzsPhone.codeRight !== this.llzsPhone.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        const data = {
            grant_type: "password",
            smsUUID: this.llzsPhone.smsUUID,
            phone: this.llzsPhone.phone,
            smsCode: this.llzsPhone.code,
            client_id: NXSZS_clientId_phone,
            client_secret: NXSZS_client_secret_phone
        }
        this.showLoading();
        this.storage.set("LoginType", "菱菱助手")
        if (this.isMobile) {
            const header = {
                "content-type": "application/x-www-form-urlencoded",
            }
            this.nativeHttp.setDataSerializer('urlencoded');
            this.nativeHttp.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
            this.nativeHttp.post(NXSZS_HTTP_URL + "/auth/realms/sgmw/protocol/openid-connect/token", data, header).then(
                response => {
                    let res = JSON.parse(response.data);
                    if (res.access_token) {
                        this.LLZSGetUnionId(res.access_token);
                    } else {
                        this.dismissLoading();
                        this.commonSer.alert(LLZSNoUserMsg);
                    }
                }
            ).catch(error => {
                this.dismissLoading();
                const message = JSON.parse(error.error);
                this.commonSer.alert(message.error_description || JSON.stringify(error.error));
            })
        } else {
            this.loginSer.LLZSLoginByPhone(data).subscribe(
                (res) => {
                    if (res.access_token) {
                        this.LLZSGetUnionId(res.access_token);
                    } else {
                        this.dismissLoading();
                        this.commonSer.alert(LLZSNoUserMsg);
                    }
                }, (error) => {
                    this.dismissLoading();
                    this.commonSer.alert(error.error.error_description || JSON.stringify(error.error));
                }
            )
        }
    }

    //账号登录
    llzsLogin() {
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意用户协议');
            return;
        }
        this.userRoleName = '菱菱助手';
        this.setRoleNames();
        if (!this.jxs.llzs.username || !this.jxs.llzs.password) {
            this.commonSer.toast("请输入用户名密码");
            return
        }
        if (this.jxs.llzs.codeRight != this.jxs.llzs.inputCode) {
            this.commonSer.toast('请输入正确的验证码');
            return;
        }
        this.showLoading();
        this.storage.set("LoginType", "菱菱助手")
        const data = {
            grant_type: "password",
            username: encodeURIComponent(this.jxs.llzs.username.trim()),
            password: this.jxs.llzs.password,
            client_id: NXSZS_clientId,
            client_secret: NXSZS_client_secret
        }

        if (this.isMobile) {
            const header = {
                "content-type": "application/x-www-form-urlencoded",
            }
            this.nativeHttp.setDataSerializer('urlencoded');
            this.nativeHttp.setHeader('*', 'Content-Type', 'application/x-www-form-urlencoded');
            this.nativeHttp.post(NXSZS_HTTP_URL + "/auth/realms/sgmw/protocol/openid-connect/token", data, header).then(
                response => {
                    let res = JSON.parse(response.data);
                    if (res.access_token) {
                        this.LLZSGetUnionId(res.access_token);
                    } else {
                        this.dismissLoading();
                        this.commonSer.alert("错误：没查询到用户【TOKEN】");
                    }
                }, (error) => {
                    this.dismissLoading();
                    const message = JSON.parse(error.error);
                    this.commonSer.alert("骏菱学社：账号或密码错误，" + (message.error_description || JSON.stringify(error.error)));
                }
            ).catch(error => {
                this.dismissLoading();
                const message = JSON.parse(error.error);
                this.commonSer.alert(`骏菱学社：账号或密码错误，${message.error_description}`);
            })
        } else {
            this.loginSer.LLZSGetToken(data).subscribe(
                (res) => {
                    if (res.access_token) {
                        this.LLZSGetUnionId(res.access_token);
                    } else {
                        this.dismissLoading();
                        this.commonSer.alert("错误：没查询到用户【TOKEN】");
                    }
                },
                (error) => {
                    this.dismissLoading();
                    this.commonSer.alert("骏菱学社：账号或密码错误，" + error.error.error_description || JSON.stringify(error.error));
                }
            )
        }
    }

    //获取菱菱助手的unionId
    LLZSGetUnionId(token) {
        const header = {
            Authorization: `Bearer ${token}`
        }
        if (this.isMobile) {
            this.nativeHttp.get(NXSZS_HTTP_URL + "/auth/realms/sgmw/protocol/openid-connect/userinfo", "", header).then(
                response => {
                    let res = JSON.parse(response.data);
                    if (res.unionId) {
                        this.LLZSGetUserInfo(res.unionId);
                    } else {
                        this.dismissLoading();
                        this.commonSer.alert("错误：未查询到【unionId】");
                    }
                }
            ).catch(error => {
                this.dismissLoading();
                const message = JSON.parse(error.error);
                this.commonSer.alert(message.error_description || JSON.stringify(error.error));
            })
        } else {
            this.loginSer.LLZSGetUnionId(header).subscribe(
                (res) => {
                    if (res.unionId) {
                        this.LLZSGetUserInfo(res.unionId);
                    } else {
                        this.dismissLoading();
                        this.commonSer.alert("错误：未查询到【unionId】");
                    }
                }
            ), error => {
                this.dismissLoading();
                this.commonSer.alert(error.error_description || JSON.stringify(error));
            }
        }
    }

    //获取菱菱助手用户信息
    LLZSGetUserInfo(unionId) {
        if (this.isMobile) {
            this.nativeHttp.get(NXSZS_HTTP_URL + `/user/api/userInfo/${unionId}`, "", {}).then(
                response => {
                    let res = JSON.parse(response.data);
                    if (res.data) {
                        this.insertUserData(res.data, unionId);
                    } else {
                        this.dismissLoading();
                        this.commonSer.alert("错误：未查询到【用户信息】");
                    }
                }
            ).catch(error => {
                this.dismissLoading();
                const message = JSON.parse(error.error);
                this.commonSer.alert(message.error_description);
            })
        } else {
            this.loginSer.LLZSGetUserInfo(unionId).subscribe((res) => {
                if (res.data) {
                    this.insertUserData(res.data, unionId);
                } else {
                    this.dismissLoading();
                    this.commonSer.alert("错误：未查询到【用户信息】");
                }
            })
        }
    }

    //插入菱菱助手数据
    insertUserData(data, unionId) {
        Object.assign(data, {
            UnionID: unionId,
            LoginName: this.llzsLoginType === 'userName' ? this.jxs.llzs.username : this.llzsPhone.phone
        })
        this.loginSer.InsertEsysUserLL(data).subscribe(
            (res) => {
                if (res.code == 200) {
                    this.connectTokenByNXSZS(data, unionId);
                } else {
                    this.dismissLoading();
                    this.commonSer.alert(res.message || JSON.stringify(res));
                }
            }
        ), error1 => {
            this.dismissLoading();
            const error = error1.error.error;
            this.commonSer.alert(error || JSON.stringify(error1.error));
        }
    }

    //获取新销售助手用户信息
    connectTokenByNXSZS(req, unionId) {
        if (!req.idCard) {
            this.dismissLoading();
            this.commonSer.alert("登录信息缺少身份证号码");
            return;
        }
        const data = {
            grant_type: "password",
            client_id: NXSZS_client_id_login,
            Czydm: req.idCard,
            UserName: unionId,
            usertype: 'LLZS',
        };
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
                    this.commonSer.alert(res.error || JSON.stringify(res));
                }
            }, error1 => {
                this.dismissLoading();
                const error = error1.error.error;
                this.commonSer.alert(error || JSON.stringify(error1.error));
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
                                    CurrentRoleName: res2.data.CurrentRoleNames ? res2.data.CurrentRoleNames : this.userRoleName
                                });
                                this.userAsync(res);
                                this.updateRegID(res);
                                this.storage.set('RoleID', res2.data.CurrentRoleID);
                            }
                        })
                    }
                } else {
                    this.dismissLoading();
                    this.storage.clear();
                    this.commonSer.alert(res.message || JSON.stringify(res));
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
                    this.commonSer.toast(res.message || JSON.stringify(res));
                }
            }
        )
    }

    //用户是否同步
    userAsync(res) {
        this.dismissLoading();
        if (res.data.LoginUserId == '00000000-0000-0000-0000-000000000000') {
            this.commonSer.alert(this.noUserMsg);
        } else {
            this.storage.set('user', res.data);
            this.navCtrl.setRoot(TabsPage);
        }
    }

    //重新获取验证码
    flashCode() {
        // if (this.loginObj.type == 'jxs' && this.loginObj.platform == 'xszs') this.checkCodeXszs.drawPic();
        if (this.loginObj.type == 'jxs' && this.loginObj.platform == 'llzs' && this.llzsLoginType === "phone") this.checkCodeLLZSByPhone.drawPic();
        if (this.loginObj.type == 'jxs' && this.loginObj.platform == 'llzs' && this.llzsLoginType === "userName") this.checkCodeLLZS.drawPic();
        // if (this.loginObj.type == 'jxs' && this.loginObj.platform == 'junke') this.checkCodeJunke.drawPic();
        if (this.loginObj.type == 'gys') this.checkCodeGys.drawPic();
        if (this.loginObj.type == 'yg') this.checkCodeYG.drawPic();
        if (this.loginObj.type == 'fwzs') this.checkCodeFWZS.drawPic();
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

    getCodeLLZS(e) {
        this.jxs.llzs.codeRight = e;
    }

    getCodeLLZSByPhone(e) {
        this.llzsPhone.codeRight = e;
    }

    // 储存用户角色
    setRoleNames() {
        this.storage.set('RoleName', this.userRoleName);
    }

    openModal() {
        const modal = this.modalCtrl.create(UserAgreementComponent);
        modal.present();
    }

    //loading实例只能当前使用 当前销毁 故创建一个方法 判断是否存在loading
    showLoading() {
        if (!this.loading) {
            this.loading = this.loadCtrl.create({
                content: '登录中...',
                enableBackdropDismiss: true,
                dismissOnPageChange: true,
            });
            this.loading.present();
        }
    }

    //隐藏loading
    dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }

    //倒计时
    countTime() {
        let totalTime = 60;
        this.clock = window.setInterval(() => {
            totalTime--;
            this.timeText = `${totalTime}s后重新发送`;
            if (totalTime < 1) {
                this.disableBtn = false;
                window.clearInterval(this.clock);
                this.timeText = "重新发送";
            }
        }, 1000);
    }


}
