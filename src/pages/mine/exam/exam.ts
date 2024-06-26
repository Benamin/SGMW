import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {DoExamPage} from "../do-exam/do-exam";
import {LookExamPage} from "../look-exam/look-exam";
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {EmitService} from "../../../core/emit.service";
import {LogService} from "../../../service/log.service";
import {LookTalkVideoExamPage} from "../../learning/look-talk-video-exam/look-talk-video-exam";
import {ExamTipPage} from "../../learning/exam-tip/exam-tip";

@Component({
    selector: 'page-exam',
    templateUrl: 'exam.html',
})
export class ExamPage {

    navbarList = [
        {type: '4', name: '未通过'},
        {type: '8', name: '已通过'},
    ];

    page = {
        EGroup: 1,
        Page: 1,
        EType: [3, 4],
        PageSize: 100000,
        TotalItems: 0,
    };

    type = '4';
    exam = {
        done: [],
        no: []
    };
    IsLoad = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private homeSer: HomeService,
                private commonSer: CommonService,
                public eventEmitSer: EmitService,
                private logSer: LogService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidEnter() {
        this.logSer.visitLog('wdzy');
        this.eventEmitSer.eventEmit.emit('false');
        this.getList();
    }

    //切换tab
    changeType(e) {
        this.type = e.type;
    }

    getList() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            StudyState: [3],
            EGroup: [1],
            Page: 1,
            EType: this.page.EType,
            PageSize: this.page.PageSize,
        };
        this.homeSer.searchExamByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toast(res.Message);
                }
                this.exam.no = res.data.Items.filter(e => e.ExamStatus == 2 || e.ExamStatus == 4);
                this.exam.done = res.data.Items.filter(e => e.ExamStatus == 8);
                this.page.TotalItems = res.data.TotalItems;
                this.IsLoad = true;
                loading.dismiss();
            }
        );
    }

    // 1 未解锁  2 已解锁
    goExam(exam) {
        if (exam.ExamStatus == 1) {
            this.commonSer.toast('作业课时未完成');
        }

        if (exam.ExamStatus == 8) {  //作业完成
            if (exam.JopType == 0) {   //选项作业
                this.navCtrl.push(LookExamPage, {item: exam, source: 'course'})
            } else {    //视频作业、讨论作业
                this.navCtrl.push(LookTalkVideoExamPage, {item: exam, source: 'course'});
            }
        } else {  //作业未完成
            if (exam.JopType == 0) {
                this.navCtrl.push(DoExamPage, {item: exam, source: 'course'})
            } else {  //视频作业、讨论作业
                exam.id = exam.Eid;
                this.navCtrl.push(ExamTipPage, {item: exam});
            }
        }
    }

    //刷新
    doRefresh(e) {
        this.IsLoad = false;
        this.getList();
        timer(1000).subscribe((res) => {
            e.complete()
        });
    }
}
