import {Component, ViewChild} from '@angular/core';
import {
    Content,
    IonicPage,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Refresher
} from 'ionic-angular';
import {QIndexComponent} from "../../../components/q-index/q-index";
import {SearchSidebarComponent} from "../../../components/search-sidebar/search-sidebar";
import {defaultImg} from "../../../app/app.constants";
import {LearnService} from "../../learning/learn.service";
import {MineService} from "../../mine/mine.service";
import {timer} from "rxjs/observable/timer";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {LogService} from "../../../service/log.service";
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {CommonService} from "../../../core/common.service";


@Component({
    selector: 'page-focus-train',
    templateUrl: 'focus-train.html',
})
export class FocusTrainPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;
    defaultImg = defaultImg;
    page = {
        Title: "",
        list: [],
        page: 1,
        pageSize: 10,
        TotalItems: null,
        isLoad: false
    };

    filterObj = {
        ApplicantSTime: null,
        ApplicantETime: null,
        AreaCode: "",
        ProvinceCode: "",
        CityCode: "",
        Address: "",
        TeacherName: "",
    };  //筛选对象
    nowTime;
    allList;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learSer: LearnService,
                public modalCtrl: ModalController,
                private keyboard: Keyboard,
                public logSer: LogService,
                private commonSer: CommonService,
                public homeSer: HomeService,
                private loadCtrl: LoadingController, private mineSer: MineService) {
    }

    ionViewDidLoad() {
        this.showLoading();
        this.getList();
        this.getArea();
    }

    //按键
    search(event) {
        if (event && event.keyCode == 13) {
            this.page.page = 1;
            this.showLoading();
            this.getList();
            //搜索日志
            if (this.page.Title) this.logSer.keyWordLog(this.page.Title);
        }
    }

    getArea() {
        const data = {
            "Page": 1,
            "PageSize": "10000",
            "Total": "0",
            "OrderBy": "AreaCode",
            "IsAsc": true,
            "TypeLevel": "-1",
            "AreaCode": "-1",
            "AreaName": "",
            "ProvinceCode": "-1",
            "ProvinceName": "",
            "CityCode": "-1",
            "CityName": ""
        };
        this.homeSer.getAreaCitys(data).subscribe(
            (res) => {
                this.allList = res.data.Items;
            }
        )
    }

    showKey() {
        this.keyboard.show();
    }

    getList() {
        this.nowTime = new Date().getTime();
        const data = {
            page: 1,
            Title: this.page.Title,
            pageSize: this.page.pageSize,
            TeachTypeCode: 'jzpx',
            SubjectID: "-1",
            OrderBy: "CreateTime",
            SortDir: "DESC"
        };
        Object.assign(data, this.filterObj);
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
                this.dismissLoading();
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
            TeachTypeCode: 'jzpx',
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

    //前往详情
    getItem(item) {
        this.navCtrl.push(FocusCoursePage, {id: item.Id});
    }

    //打开筛选
    openFilter() {
        let modal = this.modalCtrl.create(SearchSidebarComponent, {allList: this.allList, filterObj: this.filterObj},
            {
                enterAnimation: 'modal-from-right-enter',
                leaveAnimation: 'modal-from-right-leave'
            });
        modal.onDidDismiss(res => {
            if (res) {
                this.showLoading();
                this.filterObj = res;
                this.getList();
            }
        });
        modal.present();
    }

    doRefresh(e) {
        this.page.page = 1;
        this.getList();
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }

}
