import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../../../mine/mine.service";
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home.service";
import {LookTestPage} from "../look-test/look-test";
import {DoTestPage} from "../do-test/do-test";
import {CommonService} from "../../../../core/common.service";
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
        EType: 2,
        load: false,
        Page: 1,
        PageSize: 10,
        TotalItems: 0,
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
        // this.checkTimeOut();
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

    //考试列表-EType
    //EType  1-等级考试 2-普通考试 3-课堂练习（预习作业）4-课后作业 5-调查问卷
    getList() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            StudyState: [this.page.StudyState],
            EType: [this.page.EType],
            Page: this.page.Page,
            PageSize: this.page.PageSize,
            EGroup: [1]
        };
        this.homeSer.searchExamByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toast(res.Message);
                }
                this.examList = res.data.Items;
                this.page.TotalItems = res.data.TotalItems;
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
                    this.navCtrl.push(DoTestPage, {item: item});  //未开始
                } else if (this.page.StudyState == 2) {                    //未完成
                    this.navCtrl.push(DoTestPage, {item: item});
                }
            }
        )
    }

    //加载更多
    doInfinite(e) {
        console.log('doInfinite')
        if (this.page.TotalItems < this.examList.length || this.page.TotalItems == this.examList.length) {
            e.complete();
            return
        }
        this.page.Page++;
        const data = {
            StudyState: [this.page.StudyState],
            EGroup: [1],
            EType: [this.page.EType],
            Page: this.page.Page,
            PageSize: this.page.PageSize,
        };
        this.homeSer.searchExamByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toast(res.Message);
                }
                this.examList = this.examList.concat(res.data.Items);
                this.page.TotalItems = res.data.TotalItems;
                e.complete();
            }
        );
    }


}
