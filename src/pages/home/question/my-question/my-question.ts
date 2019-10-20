import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../../../mine/mine.service";
import {Storage} from "@ionic/storage";
import {CommonService} from "../../../../core/common.service";
import {EmitService} from "../../../../core/emit.service";
import {QIndexComponent} from "../../../../components/q-index/q-index";
import {HomeService} from "../../home.service";
import {DatePipe} from "@angular/common";
import {timer} from "rxjs/observable/timer";
import {LookQuestion} from "../look-question/look-question";
import {DoQuestionPage} from "../do-question/do-question";

@Component({
    selector: 'page-exam',
    templateUrl: 'my-question.html',
})
export class MyQuestion {

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
    clickDisable = true;

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
            this.navCtrl.push(LookQuestion, {item: item});
        } else {
            this.checkTesttime(item);
        }
    }

    //考试有效期校验
    checkTesttime(item) {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const ExamBegin = new Date(this.datePipe.transform(item.ExamBegin, 'yyyy/MM/dd HH:mm:ss')).getTime();
        const ExamEnd = new Date(this.datePipe.transform(item.ExamEnd, 'yyyy/MM/dd HH:mm:ss')).getTime();
        this.homeSer.getSysDateTime().subscribe(
            (res) => {
                loading.dismiss();
                const sysDate = new Date(res.data).getTime();
                if (sysDate < ExamBegin) {
                    this.commonSer.toast('考试未开始');
                } else if (sysDate > ExamEnd && this.page.StudyState == 1) {
                    this.commonSer.toast('当前时间不可考试');
                } else if (ExamBegin < sysDate && sysDate < ExamEnd) {
                    this.navCtrl.push(DoQuestionPage, {item: item});  //未开始
                } else if (this.page.StudyState == 2) {                    //未完成
                    this.navCtrl.push(DoQuestionPage, {item: item});
                }
            }
        )
    }


}
