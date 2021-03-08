import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ForumService} from './forum.service';
import {SearchPage} from "../home/search/search";
import {PostlistComponent} from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ViewReplyComponent} from './view-reply/view-reply.component';
import {PostAddComponent} from './post-add/post-add.component';
import {LogService} from "../../service/log.service";
import {ShareWxComponent} from "../../components/share-wx/share-wx";


@Component({
    selector: 'page-forum',
    templateUrl: './forum.component.html'
})
export class ForumPage {

    forumLIst = [];
    isdoInfinite = true;
    no_list = false;
    pageDate = {
        OrderBy: "CreateTime",  //CreateTime 发帖时间  ViewCount 浏览量  ReplyCount 回复量  PostTimeFormatted 回复时间
        creater: "",
        name: "",
        Type: "New",  // New 最新 CreateTime 发帖时间 PostTimeFormatted 回复时间  //Hot 最热 ViewCount 浏览量  ReplyCount 回复量
        pageIndex: 1,
        pageSize: 10,
        total: 0,
    }
    ForumHistory = [];
    navli: '热帖' | '板块' | '话题' = '热帖';
    conversationData = [];

    Blacklist = [];
    loading;
    topList = [];

    constructor(public navCtrl: NavController, private serve: ForumService,
                public logSer: LogService, public modalCtrl: ModalController,
                private storage: Storage, private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.logSer.visitLog('lt');
        this.forumLIst = [];
        this.conversationData = [];
        this.pageDate.pageIndex = 1;
        this.initData();

        this.storage.get('Blacklist').then(value => {
            if (value) {
                this.Blacklist = value;
            }
        })
    }

    // 前往 评论列表
    showViewReply() {
        this.navCtrl.push(ViewReplyComponent);
    }

    // 前往帖子详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    // 新增帖子
    PostAddComponent() {
        this.navCtrl.push(PostAddComponent, {data: {}});
    }

    // 前往帖子列表
    goPostlist(data) {
        let HistoryName = ''
        if (this.navli == '板块') { //板块浏览历史
            HistoryName = 'userForumHistory';
        }
        if (this.navli == '话题') { //话题浏览历史
            HistoryName = 'Searchtopictag';
        }
        let userForumHistory: any = window.localStorage.getItem(HistoryName);
        let arr = [data];
        if (userForumHistory) {
            userForumHistory = JSON.parse(userForumHistory);
            userForumHistory.forEach(element => {
                if (data.Id !== element.Id) {
                    arr.push(element);
                }
            });
        }
        arr.length = arr.length > 6 ? 6 : arr.length;
        window.localStorage.setItem(HistoryName, JSON.stringify(arr));
        data['navli'] = this.navli;
        this.navCtrl.push(PostlistComponent, {data: data});
    }

    initData() {
        this.isdoInfinite = true;
        this.pageDate.pageIndex = 1;
        this.conversationData = [];
        if (this.navli == '板块') {
            this.forum_topicplate_search();
            this.getHistory();
        } else if (this.navli == '热帖') {
            this.getListData();
        } else if (this.navli == '话题') {
            this.topicplateSearchtopictag();
        }

        const data = {
            PageIndex: 1,
            PageSize: 100,
        }
        this.serve.searchtopictag(data).subscribe((res) => {
            if (res.code == 200) {
                this.topList = res.data.Items;
            }
        })
    }

    //修改排序方式 Type
    avtNav(text) {
        if (text === "New") this.pageDate.OrderBy = "CreateTime";
        if (text === "Hot") this.pageDate.OrderBy = "ViewCount";
        this.forumLIst = [];
        this.pageDate.Type = text;
        this.initData();
    }

    //修改排序方式 OrderBy
    changeOrder(order) {
        this.forumLIst = [];
        this.pageDate.OrderBy = order;
        this.initData();
    }

    doInfinite(e) {
        this.pageDate.pageIndex++;
        if (this.navli == '板块') {
            this.forum_topicplate_search();
        }
        if (this.navli == '热帖') {
            this.getListData();
        }

        if (this.navli == '话题') {
            this.topicplateSearchtopictag();
        }

        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    topicplateSearchtopictag() {
        let data = {
            "PageIndex": this.pageDate.pageIndex,
            "PageSize": 10
        }
        this.serve.topicplateSearchtopictag(data).subscribe((res: any) => {
            // this.conversationData=res.data.Items;
            let arr = res.data.Items;
            this.conversationData = this.conversationData.concat(arr);
            this.no_list = this.conversationData.length == 0 ? true : false;
        })
    }

    forum_topicplate_search() {
        if (this.pageDate.pageIndex == 1) {
            this.showLoading();
        }
        this.serve.newsearchforumtopicplate(this.pageDate).subscribe((res: any) => {
            if (!res.data) {
                return
            }
            let arr = res.data.Items;
            if (arr.length == 0) {
                this.isdoInfinite = false;
            }

            this.forumLIst = this.forumLIst.concat(arr);
            this.no_list = this.forumLIst.length == 0 ? true : false;
            this.dismissLoading();
        })
    }

    SearchtopictagHistory = [];

    // 获取 浏览历史 数据
    getHistory() {

        let userForumHistory: any = window.localStorage.getItem('userForumHistory');  //板块浏览历史

        if (userForumHistory) {
            this.ForumHistory = JSON.parse(userForumHistory);
        } else {
            this.ForumHistory = [];
        }

        let Searchtopictag: any = window.localStorage.getItem('Searchtopictag');  //话题浏览历史
        if (Searchtopictag) {
            this.SearchtopictagHistory = JSON.parse(Searchtopictag);
        } else {
            this.SearchtopictagHistory = [];
        }

    }

    doRefresh(e) {
        setTimeout(() => {
            e.complete();
            this.isdoInfinite = true;
        }, 1000);
        if (this.navli == '热帖') {
            return this.switchInformation('热帖')
        }

        this.pageDate.pageIndex = 1;
        this.isdoInfinite = true;
        this.forumLIst = [];
        this.getHistory();
        this.forum_topicplate_search();

    }

    goToSearch() {
        this.navCtrl.push(SearchPage, {type: '论坛'});
    }

    switchInformation(text) {
        this.navli = text;
        this.forumLIst = [];
        this.pageDate.pageIndex = 1;
        this.initData();
    }

    getListData() {
        this.showLoading();
        let data = {
            "Title": "",
            "Status": 2,
            "Poster": "",
            "IsPlate": 0,
            "OrderBy": this.pageDate.OrderBy,
            "OrderByDirection": "DESC",
            "Type": this.pageDate.Type,
            "PageIndex": this.pageDate.pageIndex,
            "PageSize": 10
        };
        this.serve.GetPostSearchhotpost(data).subscribe((res: any) => {
            this.dismissLoading()
            if (res.data) {
                let arr = res.data.Posts.Items;
                if (arr.length != 0) {
                    this.forumLIst = this.forumLIst.concat(arr);
                }
                this.no_list = this.forumLIst.length > 0 ? false : true;
                if (arr == 0) {
                    this.isdoInfinite = false;
                }
            }
        });
    }

    wxShare(item) {
        let modal = this.modalCtrl.create(ShareWxComponent, {data: item});
        modal.present();
    }

    showLoading() {
        if (!this.loading) {
            this.loading = this.loadCtrl.create({
                content: '加载中...'
            });
            this.loading.present();
        }
    }

    dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }

    selectTopic(e) {
        console.log(e);
    }
}
