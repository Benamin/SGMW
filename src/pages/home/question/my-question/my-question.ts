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
        {type: '2', name: '进行中'},
        {type: '3', name: '已结束'},
    ];

    /// 1-未开始
    /// 2-进行中
    /// 3-已完成
    page = {
        StudyState: 1,
        EGroup: 1,  /// 1-普通问卷 2-投票
        load: false,
        EType:5,
        Page:1,
        PageSize:10,
        TotalItems:0
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
        this.getList();
    }


    //考试列表
    //EType  /// 1-等级考试 2-普通考试 3-课堂练习（预习作业）4-课后作业 5-调查问卷
    getList() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            StudyState: [this.page.StudyState],
            EType:[this.page.EType],
            EGroup: [this.page.EGroup],  /// 1-普通问卷 2-投票
            Page:this.page.Page,
            PageSize:this.page.PageSize
        };
        this.homeSer.searchExamByStu(data).subscribe(
            (res) => {
                if(res.Result == 0){
                    this.examList = res.data.Items;
                    this.page.TotalItems = res.data.TotalItems;
                }else{
                    this.commonSer.toast(res.Message);
                }
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
            this.navCtrl.push(DoQuestionPage, {item: item});
        }
    }

    doRefresh(e) {
        this.page.Page = 1;
        this.getList();
        timer(1000).subscribe((res) => {
            e.complete()
        });
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
            Page: this.page.Page,
            EType: this.page.EType,
            PageSize: this.page.PageSize,
        };
        this.homeSer.searchExamByStu(data).subscribe(
            (res) => {
                this.examList = this.examList.concat(res.data.Items);
                this.page.TotalItems = res.data.TotalItems;
                e.complete();
            }
        );
    }

}
