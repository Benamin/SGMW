import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {DoExamPage} from "../do-exam/do-exam";
import {LookExamPage} from "../look-exam/look-exam";
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {EmitService} from "../../../core/emit.service";

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

    page = {
        StudyState: 1,
        EGroup: 1,
        Page: 1,
        EType: [3, 4],
        PageSize: 10,
        TotalItems: 0,
    };

    examList = [];
    IsLoad = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private homeSer: HomeService,
                private commonSer: CommonService,
                public eventEmitSer: EmitService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidEnter() {
        this.eventEmitSer.eventEmit.emit('false');
        this.getList();
    }

    //切换tab
    changeType(e) {
        this.examList = [];
        this.IsLoad = false;
        this.page.StudyState = e.type;
        this.getList();
    }

    getList() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            StudyState: [this.page.StudyState],
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
                this.examList = res.data.Items;
                this.page.TotalItems = res.data.TotalItems;
                this.IsLoad = true;
                loading.dismiss();
            }
        );
    }

    goExam(item) {
        if (this.page.StudyState == 3) {
            this.navCtrl.push(LookExamPage, {item: item});
        } else {
            this.navCtrl.push(DoExamPage, {item: item});
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

    //加载更多
    doInfinite(e) {
        if (this.page.TotalItems < this.examList.length || this.page.TotalItems == this.examList.length) {
            e.complete();
            return
        }
        this.page.Page++;
        const data = {
            StudyState: [this.page.StudyState],
            EGroup: [1],
            EType: this.page.EType,
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
