import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../../mine/mine.service";
import {timer} from "rxjs/observable/timer";
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";
import {HomeService} from "../home.service";
import {LookTestPage} from "../look-test/look-test";
import {DoTestPage} from "../do-test/do-test";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-exam',
    templateUrl: 'test-center.html',
})
export class TestCenterPage {

    navbarList = [
        {type: '1', name: '未开始'},
        {type: '2', name: '未完成'},
        {type: '3', name: '已完成'},
    ];

    /// 1-未开始
    /// 2-进行中
    /// 3-已完成
    page = {
        EName: '',
        StudyState: 1,
        EType: 4,  /// 3-预习作业 4-课后作业
    };

    examList = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private homeSer: HomeService,
                private commonSer: CommonService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidEnter() {
        this.getList();
        this.checkTimeOut();
    }

    //答题超时检测
    checkTimeOut() {
        this.homeSer.checkTimeOutByStu().subscribe(
            (res) => {

            }
        )
    }

    doRefresh(e) {
        this.getList();
        timer(1000).subscribe((res) => {
            e.complete()
        });
    }

    //考试列表
    getList() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            ExamState: '-1',
            StudyState: this.page.StudyState,
            EType: 2,
        };
        this.homeSer.getMyScoreList(data).subscribe(
            (res) => {
                this.examList = res.data;
                loading.dismiss();
            }
        )
    }

    changeType(e) {
        this.page.StudyState = e.type;
        this.getList();
    }

    goExam(item) {
        if (this.page.StudyState == 3) {
            this.navCtrl.push(LookTestPage, {item: item});
        } else {
            this.checkTesttime(item);
        }
    }

    //考试有效期校验
    checkTesttime(item) {
        const ExamBegin = new Date(item.ExamBegin).getTime();
        const ExamEnd = new Date(item.ExamEnd).getTime();
        this.homeSer.getSysDateTime().subscribe(
            (res) => {
                const sysDate = new Date(res.data).getTime();
                if (sysDate < ExamBegin) this.commonSer.toast('考试未开始');
                if (sysDate > ExamEnd) this.commonSer.toast('考试已结束');
                if (ExamBegin < sysDate && sysDate < ExamEnd) this.navCtrl.push(DoTestPage, {item: item});
            }
        )
    }


}
