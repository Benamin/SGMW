import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../../mine/mine.service";
import {timer} from "rxjs/observable/timer";
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";

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
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            EName: '',
            StudyState: this.page.StudyState,
            EType: this.page.EType,  /// 3-预习作业 4-课后作业
        };
        this.mineSer.getMyScores(data).subscribe(
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
            this.navCtrl.push(LookExamPage, {item: item});
        } else {
            this.navCtrl.push(DoExamPage, {item: item});
        }
    }


}
