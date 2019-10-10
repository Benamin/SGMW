import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../../mine/mine.service";
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../home.service";
import {LookTestPage} from "../look-test/look-test";
import {DoTestPage} from "../do-test/do-test";
import {CommonService} from "../../../core/common.service";
import {DatePipe} from "@angular/common";

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
        load: false
    };

    examList = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private homeSer: HomeService, private datePipe: DatePipe,
                private commonSer: CommonService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
    }

    ionViewDidEnter() {
        this.checkTimeOut();
        this.getList();
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
                this.page.load = true;
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
        const ExamBegin = new Date(this.datePipe.transform(item.ExamBegin, 'yyyy/MM/dd HH:mm:ss')).getTime();
        const ExamEnd = new Date(this.datePipe.transform(item.ExamEnd, 'yyyy/MM/dd HH:mm:ss')).getTime();
        this.homeSer.getSysDateTime().subscribe(
            (res) => {
                const sysDate = new Date(res.data).getTime();
                if (sysDate < ExamBegin) this.commonSer.toast('考试未开始');
                if (sysDate > ExamEnd) this.commonSer.toast('当前时间不可考试');
                if (ExamBegin < sysDate && sysDate < ExamEnd) this.navCtrl.push(DoTestPage, {item: item});
            }
        )
    }


}
