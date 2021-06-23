import {Component, ViewChild} from '@angular/core';
import {
    AlertController,
    Content,
    IonicPage,
    LoadingController,
    ModalController,
    NavController,
    NavParams, Refresher
} from 'ionic-angular';
import {IntegralService} from "./integral.service";
import {PostAddComponent} from "../forum/post-add/post-add.component";
import {IntegralListPage} from "./integral-list/integral-list";
import {LeagueTablePage} from "./league-table/league-table";
import {LearningPage} from "../learning/learning";
import {IntegralVerifyPage} from "./integral-verify/integral-verify";
import {CommonService} from "../../core/common.service";
import {LING_CLUB_APPID, LING_CLUB_Pub, XGShareText, XGShareUrl} from "../../app/constants";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {MyQuestion} from "../home/question/my-question/my-question";
import {RoleModalPage} from "../home/role-modal/role-modal";
import {AdvancedLevelPage} from "../home/advanced/level/level";
import {HomeService} from "../home/home.service";
import {Storage} from "@ionic/storage";

declare var Wechat;
declare let JSEncrypt: any;

@IonicPage()
@Component({
    selector: 'page-integral',
    templateUrl: 'integral.html',
})
export class IntegralPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;

    type = "daily"; //daily 日常  advance 进阶
    obj = {};
    isDailyCheck = false;
    dayObj = {};
    xgShareText = XGShareText;
    XgShareUrl = XGShareUrl;
    showCover = false;
    mineInfo;
    LoginType;


    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
                private inAppBrowser: InAppBrowser, private loadCtrl: LoadingController, private homeSer: HomeService,
                private storage: Storage,
                public inteSer: IntegralService, private commonSer: CommonService, private modalCtrl: ModalController) {
    }

    ionViewDidEnter() {
        this.storage.get('user').then(value => {
            this.mineInfo = value;
        });
        this.storage.get("LoginType").then(value => {
            this.LoginType = value;
        })
        this.showLoading()
    }

    //积分信息
    init() {
        //总积分
        this.inteSer.GetNowDayStatusIntegralDetail().subscribe(
            res => {
                if (res.data) {
                    // res.data.percentNew = res.data.percent?res.data.percent.substring(0, 3) + '%' : null;
                    res.data.percentNew = res.data.percent ? parseInt(res.data.percent.split('%')[0]) + '%' : null;
                    this.obj = res.data;
                    this.dismissLoading();
                }
            }
        )
        //今日积分
        this.inteSer.NowDateGetIntegral().subscribe(
            res => {
                this.dayObj = res;
            }
        )
    }

    //每日签到
    DailyCheck() {
        if (this.isDailyCheck) return
        this.isDailyCheck = true;
        this.inteSer.DailyCheck().subscribe(
            res => {
                this.init();
                this.isDailyCheck = false;
                if (res.data) {
                    this.commonSer.alert('签到成功');
                } else {
                    this.commonSer.alert(res.message);
                }
            }
        )
    }

    //积分明细
    GoList() {
        this.navCtrl.push(IntegralListPage);
    }

    //积分排行榜
    GoLeagueTable() {
        this.navCtrl.push(LeagueTablePage);
    }

    // 新增动态
    PostAddComponent() {
        this.navCtrl.push(PostAddComponent, {data: {}});
    }

    //课程列表
    gotoListAll() {
        this.navCtrl.push(LearningPage, {keyWord: ''});
    }

    //去投票
    goQuestion() {
        this.navCtrl.push(MyQuestion);
    }

    //审核列表
    GoToVerity() {
        this.navCtrl.push(IntegralVerifyPage);
    }

    // 前往岗位认证
    goAdvancedLevel() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.ValidationLevel({}).subscribe(
            (res) => {
                // console.log('goAdvancedLevel', res.data, res.data.status === 1);
                if (res.data.status === 1) { // 判断是1 else 是0 这里模拟方便
                    this.homeSer.GetRoleByPCode({code: 'Certification'}).subscribe(
                        (resRole) => {
                            loading.dismiss();
                            // console.log('GetRoleByPCode', resRole.data);
                            if (resRole.code === 200) {
                                let modal = this.modalCtrl.create(RoleModalPage, {roleList: resRole.data});
                                modal.onDidDismiss((data) => {
                                    if (data) {
                                        this.homeSer.InitializeLevel({leveltype: data.value}).subscribe(
                                            (resInit) => {
                                                if (resInit.code === 200) {
                                                    this.navCtrl.push(AdvancedLevelPage, {
                                                        leveltype: data,
                                                        roleList: resRole.data
                                                    });

                                                }
                                            }
                                        )

                                    }
                                })
                                modal.present();
                            }
                        }
                    )

                } else if (res.data.status === 0 && res.data.leveltype) {
                    this.homeSer.GetRoleByPCode({code: 'Certification'}).subscribe(
                        (resRole) => {
                            // console.log('GetRoleByPCode', resRole.data);
                            if (resRole.code === 200) {
                                loading.dismiss();
                                this.navCtrl.push(AdvancedLevelPage, {
                                    leveltype: {
                                        value: res.data.leveltype,
                                        label: res.data.LevelName
                                    }, roleList: resRole.data
                                });
                            }
                        }
                    )
                }
            }
        )
    }

    //去分享
    showAlert() {
        this.showCover = true;
    }

    goTo() {
        this.inAppBrowser.create(this.XgShareUrl, '_system');
    }

    openMini() {
        if (!this.mineInfo.MainUserID && this.mineInfo.MainUserID === '00000000-0000-0000-0000-000000000000') {
            this.commonSer.alert('用户信息错误' + this.mineInfo.MainUserID);
            return
        }
        let str = `UserId=${this.mineInfo.MainUserID}&CardNo=${this.mineInfo.CardNo}`;

        const jsencrypt = new JSEncrypt();
        jsencrypt.setPublicKey(LING_CLUB_Pub)
        let code = jsencrypt.encrypt(str);
        let path = `/pointsexchange/index?code=${encodeURIComponent(code)}&scene=jlxs`;
        //code中包含+ = 所以需要 encodeURIComponent 编码一下
        let params = {
            userName: LING_CLUB_APPID, // 原始ID
            path: path, // open mini program page
            miniprogramType: 2 // 0是正式 1是开发 2是体验版本
        };
        Wechat.openMiniProgram(params, (data) => {
            console.log(data); // data:{extMsg:""}  extMsg: Corresponds to the app-parameter attribute in the Mini Program component <button open-type="launchApp">
        }, (error) => {
            this.commonSer.alert('error:' + JSON.stringify(error));
        });
    }

    doRefresh(e) {
        this.init()
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }

}
