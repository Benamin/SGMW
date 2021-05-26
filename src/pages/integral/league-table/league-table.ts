import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {IntegralService} from "../integral.service";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'league-table',
    templateUrl: 'league-table.html',
})
export class LeagueTablePage {
    userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
        PageIndex: 1,
        PageSize: 10,
        TotalCount: 0,
        isLoading: false, 
        isLoad: false,
        personalInfo: null,
        BigType: 1
    }
    list = [];  //积分列表
    leaguelist = [];  //积分排行榜

    loading;
    navliArr=[{
        lable: 1,
        text: '本周排行'
    }, {
        lable: 2,
        text: '本月排行'   //培训和考试通知
    }, {
        lable: 3,
        text: '总排行'
    }];

    checkType = 1;
    constructor(public navCtrl: NavController, public navParams: NavParams,
                private inteSer: IntegralService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        // this.getList()
        this.getLeagueTable()
    }

    getList() {
        this.loading = this.loadCtrl.create();
        this.loading.present();
        const data = {
            "PageIndex": this.page.PageIndex,
            "PageSize": this.page.PageSize
        };
        this.inteSer.GetIntegralDetail(data).subscribe(res => {
            if (res.data) {
                this.list = res.data.Items;
                this.page.TotalCount = res.data.TotalCount
                this.loading.dismissAll();
            }
        })
    }
    // 切换选卡
    changeCheckType(checkType) {
        if (this.checkType === checkType) return;
        this.checkType = checkType;
        if (checkType === 1) this.page.BigType = 1;
        if (checkType === 2) this.page.BigType = 2;
        if (checkType === 3) this.page.BigType = 3;
        this.page.PageIndex = 1;
        this.getLeagueTable();
    }
    getLeagueTable() {
        this.loading = this.loadCtrl.create();
        this.loading.present();
        const data = {
            "PageCurrent": this.page.PageIndex,
            "PageSize": this.page.PageSize,
            "type": this.page.BigType
        };
        this.inteSer.IntergralTable(data).subscribe(res => {
            if (res.data) {
                this.leaguelist = res.data.integralTables;
                this.page.TotalCount = res.data.total
                this.loading.dismissAll();
            }
        })
    }

    doRefresh(e) {
        this.page.PageIndex = 1;
        this.getLeagueTable();
        timer(1000).subscribe((res) => {
            e.complete();
        });
    }
    // 切换
    switchInformation(text) {
        // this.collectionList = [];
        // this.isdoInfinite = true;
        // this.navli = text;
        // this.GetSubscribeListpage.page = 1;
        // this.myfavoritespage.PageIndex = 1;
        // this.is_getData();
    }
    //上拉加载
    doInfinite(e) {
        if (this.leaguelist.length == this.page.TotalCount || this.leaguelist.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.PageIndex++;
        const data = {
            "PageIndex": this.page.PageIndex,
            "PageSize": this.page.PageSize,
            "type": this.page.BigType
        };
        this.inteSer.IntergralTable(data).subscribe(
            (res) => {
                this.leaguelist = this.leaguelist.concat(res.data.integralTables);
                this.page.TotalCount = res.data.total;
                this.page.isLoading = true;
                e.complete();
            }
        )
    }

}
