import {Component, ViewChild} from '@angular/core';
import {Content, LoadingController, NavController, Refresher} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {WantToAskDetailPage} from "../ask-detail/ask-detail";

// import {askSearchModalPage} from "../ask-search-modal/ask-search-modal";
import {Keyboard} from "@ionic-native/keyboard";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-ask-lists',
    templateUrl: 'ask-lists.html',
})
export class WantToAskListsPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;
    page = <any>{
        Title: '',
        PageIndex: 1, // 第一页 开始
        PageSize: 8, // 一页8条
        TotalCount: 0,
        searchLists: [],
        askLists: [],
        isLoad: false
    };

    // private modalCtrl: ModalController,
    constructor(public navCtrl: NavController, private homeSer: HomeService,
                private loadCtrl: LoadingController, private keyboard: Keyboard) {

    }

    ionViewDidEnter() {
        this.page.PageIndex = 1;
        this.showLoading()
        this.getList();
    }

    showKey() {
        this.keyboard.show();
    }

    //下拉刷新
    doRefresh(e) {
        this.page.PageIndex = 1;
        this.getList();
    }

    // //加载更多
    doInfinite(e) {
        if (this.page.askLists.length == this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.PageIndex++;
        this.getList(e);
    }

    //按键
    search(event) {
        if (event && event.keyCode == 13) {
            this.page.PageIndex = 1;
            this.showLoading();
            this.getList();
            //搜索日志
            if (this.page.Title) {
                console.log(this.page.Title)
            }
        }
    }

    doSearch() {
        console.log('当前搜索', this.page.Title);
    }

    getList(doLoadMore = null) {
        const data = {
            PageIndex: this.page.PageIndex,
            PageSize: this.page.PageSize,
            IsNowMonth: false, // 是否只查当月的 pc为false
            IsNoDerive: 1, // 0, 1查询 2导出
            Title: this.page.Title, // 问题描述
            StartTime: null,
            EndTime: null
        };
        this.homeSer.GetQueryQuestionItems(data).subscribe((res) => {
                if (doLoadMore) {
                    this.page.askLists = this.page.askLists.concat(res.data.QuestionItems);
                    doLoadMore.complete();
                } else {
                    this.page.askLists = res.data.QuestionItems;
                }
                this.page.TotalCount = res.data.TotalCount;
                this.page.isLoad = true;
                this.dismissLoading();
            }
        )
    }

    changeSecNav(aIndex) {
        const data = {
            QuestionId: this.page.askLists[aIndex].ID,
            IsNoFocus: !this.page.askLists[aIndex].IsNoFocus
        };
        this.homeSer.AddOrCancelFocus(data).subscribe(
            (res) => {
                this.page.askLists[aIndex].IsNoFocus = !this.page.askLists[aIndex].IsNoFocus;
                this.page.askLists[aIndex].IsNoFocus ? this.page.askLists[aIndex].FocusNum++ : this.page.askLists[aIndex].FocusNum--;
            }
        )
    }

    goAskedDetail(item) {
        this.navCtrl.push(WantToAskDetailPage, {item: item});
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }


}
