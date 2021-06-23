import {Component, OnInit, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {Content, LoadingController, NavController, Refresher} from 'ionic-angular';
import {TeacherPage} from "../../learning/teacher/teacher";
import {ForumService} from '../../forum/forum.service';
import {LearnService} from "../../learning/learn.service";
import {CommonService} from "../../../core/common.service";
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {LogService} from "../../../service/log.service";

@Component({
    selector: 'page-my-follows',
    templateUrl: './my-follows.component.html',
})
export class MyFollowsComponent  {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;
    navli = '讲师';
    collectionList = [];

    GetSubscribeListpage = {
        page: 1, pageSize: 10,
        //  total: 0, TopicID: "", OrderBy: "CreateTime", SortDir: "DESC"
    };
    myfavoritespage = {"PageIndex": 1, "PageSize": 10};
    isdoInfinite = true;

    constructor(
        public navCtrl: NavController,
        private loadCtrl: LoadingController,
        private forumServe: ForumService,
        private logSer: LogService,
        private learnSer: LearnService,
        private commonSer: CommonService) {
    }

    ionViewDidEnter() {
        this.collectionList = [];
        this.GetSubscribeListpage.page = 1;
        this.myfavoritespage.PageIndex = 1;
        this.logSer.visitLog('wdgz');
        this.showLoading();
    }

    // 关注的动态
    myfollows() {
        let loading = null;
        this.forumServe.myfollows(this.myfavoritespage).subscribe((res: any) => {
            this.dismissLoading();
            let arr = res.data.Items;
            arr.forEach(element => {
                element.PostRelativeTime = this.forumServe.PostRelativeTimeForm(element.PostRelativeTime);
            });
            if (arr.length == 0) {
                this.isdoInfinite = false;
            }
            this.collectionList = this.collectionList.concat(arr);
        });
    }

    // 关注的讲师列表
    GetSubscribeList() {
        this.forumServe.GetSubscribeList(this.GetSubscribeListpage).subscribe((res: any) => {
            if (this.GetSubscribeListpage.page == 1) {
                this.dismissLoading();
            }
            let arr = res.data.TeacherItems;
            if (arr.length == 0) {
                this.isdoInfinite = false;
            }
            this.collectionList = this.collectionList.concat(arr);
        });
    }

    teachDetail(data) {
        data['UserID'] = data.TopicID;
        data['IsSubscribe'] = true;
        this.navCtrl.push(TeacherPage, {item: data});
    }

    // 切换
    switchInformation(text) {
        this.collectionList = [];
        this.isdoInfinite = true;
        this.navli = text;
        this.GetSubscribeListpage.page = 1;
        this.myfavoritespage.PageIndex = 1;
        this.showLoading()

        this.is_getData();
    }

    //下拉刷新
    doRefresh(e) {
        this.GetSubscribeListpage.page = 1;
        this.myfavoritespage.PageIndex = 1;
        this.GetSubscribeListpage.page = 1;
        this.collectionList = [];
        this.is_getData();
    }

    is_getData() {
        if (this.navli == '讲师') {
            this.GetSubscribeList();
        } else {
            this.myfollows();
        }
    }

    isAddData(e) {
        this.showLoading()

        this.GetSubscribeListpage.page++;
        this.myfavoritespage.PageIndex++;
        this.is_getData();
    }


    // 关注讲师
    focusHandle(item) {
        const data = {
            TopicID: item.TopicID
        };
        this.learnSer.SaveSubscribe(data).subscribe(
            (res) => {
                item['IsDelete'] = false;
                this.commonSer.toast('关注成功');
            }
        );
    }

    cancleFocusHandle(item) {
        const data = {
            TopicID: item.TopicID
        };
        this.learnSer.CancelSubscribe(data).subscribe(
            (res) => {
                item['IsDelete'] = true;
                this.commonSer.toast('取消关注成功')
            }
        )
    }

    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }
}
