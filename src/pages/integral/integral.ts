import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {IntegralService} from "./integral.service";
import {PostAddComponent} from "../forum/post-add/post-add.component";
import {IntegralListPage} from "./integral-list/integral-list";
import {LearningPage} from "../learning/learning";
import {IntegralVerifyPage} from "./integral-verify/integral-verify";
import {CommonService} from "../../core/common.service";


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

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public inteSer: IntegralService, private commonSer: CommonService) {
    }

    ionViewDidLoad() {
        this.init();
    }

    //积分信息
    init() {
        this.inteSer.GetNowDayStatusIntegralDetail().subscribe(
            res => {
                if (res.data) {
                    this.obj = res.data;
                }
            }
        )
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

    // 新增帖子
    PostAddComponent() {
        this.navCtrl.push(PostAddComponent, {data: {}});
    }

    //课程列表
    gotoListAll() {
        this.navCtrl.push(LearningPage, {keyWord: ''});
    }

    //
    GoToVerity() {
        this.navCtrl.push(IntegralVerifyPage);
    }

}
