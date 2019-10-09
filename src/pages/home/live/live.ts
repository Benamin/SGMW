import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../../learning/learn.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {timer} from "rxjs/observable/timer";
import {DatePipe} from "@angular/common";
import {CommonService} from "../../../core/common.service";
import {defaultHeadPhoto} from "../../../app/app.constants";

@Component({
    selector: 'page-live',
    templateUrl: 'live.html',
})
export class LivePage {

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learnSer: LearnService, private datePipe: DatePipe,
                public loadCtrl: LoadingController, private learSer: LearnService,
                private commonSer: CommonService) {
    }

    navbarList = [
        {type: "0", name: "全部"},
        {type: "1", name: "今天"},
    ];

    page = {
        page: 1,
        pageSize: 10,
        TotalCount: 0,
        OrderBy: "StartTime",
        TeachTypeCode: "zb",
        IsToday: false,
        sortdir: "Desc"
    };

    list = {
        all: [],
        today: [],
        nowDate: null,
        nowTime: null,
        load: false,
        changeType: 0
    };

    signObj = {
        isSign: false,
    };
    defaultPhoto = defaultHeadPhoto;

    ionViewDidLoad() {
        this.getList();
        this.list.nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.list.nowTime = new Date().getTime();
    }

    changeType(e) {
        if (e.type == "1") this.page.IsToday = true;
        if (e.type == "0") this.page.IsToday = false;
        this.list.all = [];
        this.list.load = false;
        this.list.changeType = e.type;
        this.getList();
    }

    getList() {
        const load = this.loadCtrl.create();
        load.present();
        this.learnSer.GetProductList(this.page).subscribe(
            (res) => {
                load.dismiss();
                this.list.load = true;
                if (res.data) {
                    this.list.all = this.formatList(res.data.ProductList);
                    this.page.TotalCount = res.data.TotalCount;
                }
            }
        )
    }

    //获取 yyyy-MM-dd
    getFormat(date) {
        return this.datePipe.transform(date, "yyyy-MM-dd");
    }

    getTime(date) {
        return new Date(date).getTime();
    }

    //根据事件区分状态
    formatList(list) {
        list.forEach(e => {
            if (this.list.nowTime < this.getTime(e.StartTime)) e.IsLive = 0; //未开播
            if (this.getTime(e.StartTime) < this.list.nowTime && this.list.nowTime < this.getTime(e.EndTime)) e.IsLive = 1; //直播中
            if (this.list.nowTime > this.getTime(e.EndTime)) e.IsLive = 2;  //已结束
        });
        return list;
    }

    goDetail(item) {
        if(item.IsLive == 0){
            this.commonSer.toast('直播未开始');
            return
        }
        this.navCtrl.push(CourseDetailPage, {id: item.Id});
    }

    //下啦刷新
    doRefresh(e) {
        this.getList();
        timer(800).subscribe(() => e.complete())
    }

    //上啦加载
    doInfinite(e) {
        if (this.list.all.length == this.page.TotalCount || this.list.all.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            OrderBy: "StartTime",
            Category: 'zb',
            IsAsc: "true",
            IsToday: this.page.IsToday
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.list.all = this.list.all.concat(this.formatList(res.data.ProductList));
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //课程报名
    signProduct(item, e) {
        e.stopPropagation();
        const data = {
            pid: item.Id
        };
        this.learSer.BuyProduct(data).subscribe(
            (res) => {
                if (res.data) {
                    this.signObj.isSign = true;
                    timer(1000).subscribe(() => this.signObj.isSign = false);
                } else {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }
}
