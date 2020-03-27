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
        userArea: null,
        checkType: 'all',
        showNav: false,
        navliArr: [
            {
                lable: 'all',
                text: '所有'
            }, {
                lable: 'area',
                text: '区域' // 如 东区
            }
        ],
        upRankingLists: [],
        rankingLists: [],
        getListsApi: null, // 请求接口服务
        getParams: null
    };

    constructor(private loadCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private homeSer: HomeService) {
    }

    ionViewDidLoad() {
        this.page.getParams = {
            Page: 1,
            PageSize: 10,
            TotalCount: null,
            isLoad: false,
        }
        this.page.userArea = this.navParams.get("userArea")
        // console.log('考试项目id：', this.page.userArea);
        if (this.page.userArea && this.page.userArea != null) {
            this.page.showNav = true;
            this.page.navliArr[1].text = this.page.userArea.AreaName; // ID
        }
        this.getList();
    }

    changeCheckType(checkType) {
        if (this.page.checkType === checkType) return;
        this.page.checkType = checkType;
        // if (checkType === 'recommend') this.page.Type = 1;
        // if (checkType === 'all') this.page.Type = 2;
        // if (checkType === 'mine') this.page.Type = 3;
        this.page.getParams.Page = 1;
        this.getList();
    }

    // 获取考试排名列表
    getList() {
        let params = {}
        params = {
            TopicId: this.navParams.get("TopicId"),
            Page: 1,
            PageSize: this.page.getParams.PageSize
        };
        if (this.navParams.get("userArea") && this.page.checkType === this.page.navliArr[1].lable) params = Object.assign(params, { AreaID: this.page.userArea.ID }); // 区域id,
        // 判断是 所有/地区
        if (this.page.checkType === this.page.navliArr[0].lable) {
            this.page.getListsApi = (data) => {
                return this.homeSer.GetExamList(data)
            };
        } else if (this.page.checkType === this.page.navliArr[1].lable) {
            // 帖子排行榜
            this.page.getListsApi = (data) => {
                return this.homeSer.GetDealerExamList(data)
            };
        }
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.page.getListsApi(params).subscribe(
            (res) => {
                let Items = res.data.Items;
                this.page.upRankingLists = Items.slice(0, 3)
                this.page.rankingLists = Items.slice(3);
                // console.log(99888, this.page.upRankingLists, this.page.rankingLists)
                this.page.getParams.TotalCount = res.data.TotalCount;
                this.page.getParams.isLoad = true;
                loading.dismiss();
            }
        )
    }

    //加载更多
    doInfinite(e) {
        if (this.page.rankingLists.length == this.page.getParams.TotalCount || this.page.rankingLists.length > this.page.getParams.TotalCount) {
            e.complete();
            return;
        }
        this.page.getParams.Page++;
        let params = {
            TopicId: this.navParams.get("TopicId"),
            Page: this.page.getParams.Page,
            PageSize: this.page.getParams.PageSize
        };
        if (this.navParams.get("userArea") && this.page.checkType === this.page.navliArr[1].lable) params = Object.assign(params, { AreaID: this.page.userArea.ID }); // 区域id,

        this.page.getListsApi(params).subscribe(
            (res) => {
                let Lists = res.data.Items
                this.page.rankingLists = this.page.rankingLists.concat(Lists);
                this.page.getParams.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.getParams.Page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

}
