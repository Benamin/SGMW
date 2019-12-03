import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {MineService} from "../../mine/mine.service";
import {defaultImg} from "../../../app/app.constants";
import {LearnService} from "../../learning/learn.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {CommonService} from "../../../core/common.service";
import {LogService} from "../../../service/log.service";
import {Keyboard} from "@ionic-native/keyboard";

@Component({
    selector: 'page-inner-train',
    templateUrl: 'inner-train.html',
})
export class InnerTrainPage {

    defaultImg = defaultImg;
    page = {
        list: [],
        page: 1,
        pageSize: 10,
        TotalItems: null,
        isLoad: false,
        Title:""
    };
    nowTime;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learSer: LearnService, public commonSer: CommonService,
                private logSer:LogService,
                private keyboard:Keyboard,
                private loadCtrl: LoadingController, private mineSer: MineService) {
    }

    ionViewDidLoad() {
        this.getList();
    }

    //按键
    search(event) {
        if (event && event.keyCode == 13) {
            this.page.page = 1;
            this.getList();
            //搜索日志
            if (this.page.Title) this.logSer.keyWordLog(this.page.Title);
        }
    }

    sure(){
        this.page.page = 1;
        this.getList();
    }

    showKey() {
        this.keyboard.show();
    }

    getList() {
        this.nowTime = new Date().getTime();
        let loading = this.loadCtrl.create();
        loading.present();
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            Title: this.page.Title,
            TeachTypeCode: 'nx',
            SubjectID: "-1",
            OrderBy: "CreateTime",
            SortDir: "DESC"
        };
        this.learSer.GetProductList(data).subscribe(
            (res) => {
                if (res.data.ProductList) {
                    res.data.ProductList.forEach(e => {
                        e.StartTime_time = this.commonSer.transFormTime(e.StartTime);
                        e.EndTime_time = this.commonSer.transFormTime(e.EndTime);
                    });
                    this.page.list = res.data.ProductList;
                    this.page.TotalItems = res.data.TotalCount;
                }
                this.page.isLoad = true;
                loading.dismiss();
            }
        )
    }

    //加载更多
    doInfinite(e) {
        this.nowTime = new Date().getTime();
        if (this.page.list.length == this.page.TotalItems || this.page.list.length > this.page.TotalItems) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            Title: this.page.Title,
            TeachTypeCode: 'nx',
            SubjectID: "-1",
            OrderBy: "CreateTime",
            SortDir: "DESC"
        };
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                if (res.data.ProductList) {
                    res.data.ProductList.forEach(e => {
                        e.StartTime_time = this.commonSer.transFormTime(e.StartTime);
                        e.EndTime_time = this.commonSer.transFormTime(e.EndTime);
                    });
                    this.page.list = this.page.list.concat(res.data.ProductList);
                    this.page.TotalItems = res.data.TotalCount;
                }
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

    //前往详情
    getItem(item) {
        this.navCtrl.push(InnerCoursePage, {id: item.Id});
    }

}
