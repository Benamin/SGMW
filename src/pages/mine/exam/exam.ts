import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {DoExamPage} from "../do-exam/do-exam";
import {LookExamPage} from "../look-exam/look-exam";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-exam',
    templateUrl: 'exam.html',
})
export class ExamPage {

    navbarList = [
        {type: '1', name: '未开始'},
        {type: '2', name: '进行中'},
        {type: '3', name: '已完成'},
    ];

    /// 1-未开始
    /// 2-进行中
    /// 3-已完成
    page = {
        EName: '',
        StudyState: -1,
        EType: 3,  /// 3-预习作业 4-课后作业
    };

    examList = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidEnter() {
        this.getList();
    }

    doRefresh(e) {
        this.getList();
        timer(1000).subscribe((res) => {
            e.complete()
        });
    }

    getList() {
        this.examList = [];
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            EName: '',
            StudyState: this.page.StudyState,
            EType: 3,  /// 3-预习作业 4-课后作业
        };
        const one = this.mineSer.getMyScores(data).subscribe(
            (res) => {
                this.examList = this.examList.concat(res.data);
                data.EType = 4;
                this.mineSer.getMyScores(data).subscribe(
                    (res) => {
                        this.examList = this.examList.concat(res.data);
                        loading.dismiss();
                    }
                );
            }
        );
    }

    changeType(e) {
        console.log(e);
        // this.page.EType = 1;
        this.page.StudyState = e.type;
        this.getList();
    }

    goExam(item) {
        if (this.page.StudyState == 3) {
            this.navCtrl.push(LookExamPage, {item: item});
        } else {
            this.navCtrl.push(DoExamPage, {item: item});
        }
    }

}
