import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-lists-ranking',
    templateUrl: 'lists-ranking.html',
})
export class ListsRankingPage {
    userDefaultImg = './assets/imgs/userDefault.jpg';
    tid = '';
    page = {
        rankingLists: [],
        Page: 1,
        PageSize: 10,
        TotalCount: null,
        isLoad: false
    };
    constructor(private loadCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, private homeSer: HomeService) {
    }

    ionViewDidLoad() {
        this.tid = this.navParams.get("tid")
        console.log('考试项目id：', this.tid);
        this.getList();
    }

    // 获取考试排名列表
    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            Page: 1,
            PageSize: this.page.PageSize
        };
        this.homeSer.GetExamList(data).subscribe(
            (res) => {
                this.page.rankingLists = res.data.Items;
                this.page.TotalCount = res.data.TotalCount;
                loading.dismiss();
            }
        )
    }

    //加载更多
    doInfinite(e) {
        if (this.page.rankingLists.length == this.page.TotalCount || this.page.rankingLists.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.Page++;
        const data = {
            Page: this.page.Page,
            PageSize: this.page.PageSize
        };
        this.homeSer.GetExamList(data).subscribe(
            (res) => {
                this.page.rankingLists = this.page.rankingLists.concat(res.data.Items);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.Page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

}
