import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {IntegralService} from "./integral.service";
import {PostAddComponent} from "../forum/post-add/post-add.component";
import {IntegralListPage} from "./integral-list/integral-list";
import {LeagueTablePage} from "./league-table/league-table";
import {LearningPage} from "../learning/learning";
import {IntegralVerifyPage} from "./integral-verify/integral-verify";
import {CommonService} from "../../core/common.service";
import {XGShareText, XGShareUrl} from "../../app/constants";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {MyQuestion} from "../home/question/my-question/my-question";
import {RoleModalPage} from "../home/role-modal/role-modal";
import {AdvancedLevelPage} from "../home/advanced/level/level";
import {HomeService} from "../home/home.service";


@IonicPage()
@Component({
    selector: 'page-integral',
    templateUrl: 'integral.html',
})
export class IntegralPage {

    type = "daily"; //daily 日常  advance 进阶
    obj = {};
    isDailyCheck = false;
    dayObj = {};
    xgShareText = XGShareText;
    XgShareUrl = XGShareUrl;
    showCover = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
                private inAppBrowser: InAppBrowser, private loadCtrl: LoadingController, private homeSer: HomeService,
                public inteSer: IntegralService, private commonSer: CommonService, private modalCtrl: ModalController) {
    }

    ionViewDidEnter() {
        this.init();
    }

    //积分信息
    init() {
        //总积分
        this.inteSer.GetNowDayStatusIntegralDetail().subscribe(
            res => {
                if (res.data) {
                    // res.data.percentNew = res.data.percent?res.data.percent.substring(0, 3) + '%' : null;
                    res.data.percentNew = res.data.percent?parseFloat(res.data.percent).toFixed(1) + '%' : null;
                    this.obj = res.data;
                    console.log('今日积分',res.data)
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

}
