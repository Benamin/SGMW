import {Component} from '@angular/core';
import {Events, LoadingController, ModalController, NavController} from 'ionic-angular';
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

    forumList = [];  //动态列表
    plateList = [];  //　板块列表
    isdoInfinite = true;
    isLoad = false;
    pageDate = {   //动态信息
        OrderBy: "CreateTime",  //CreateTime 发帖时间  ViewCount 浏览量  ReplyCount 回复量  PostTimeFormatted 回复时间
        name: "",
        Type: "New",  // New 最新 CreateTime 发帖时间 PostTimeFormatted 回复时间  //Hot 最热 ViewCount 浏览量  ReplyCount 回复量
        pageIndex: 1,
        pageSize: 10,
        total: 0,
    }

    plateData = {  //板块信息
        OrderBy: "CreateTime",  //CreateTime 发帖时间  ViewCount 浏览量  ReplyCount 回复量  PostTimeFormatted 回复时间
        name: "",
        Type: "New",  // New 最新 CreateTime 发帖时间 PostTimeFormatted 回复时间  //Hot 最热 ViewCount 浏览量  ReplyCount 回复量
        pageIndex: 1,
        pageSize: 10,
        total: 0,
    }

    followList = [];
    followerData = {
        OrderBy: "CreateTime",  //CreateTime 发帖时间  ViewCount 浏览量  ReplyCount 回复量  PostTimeFormatted 回复时间
        name: "",
        Type: "New",  // New 最新 CreateTime 发帖时间 PostTimeFormatted 回复时间  //Hot 最热 ViewCount 浏览量  ReplyCount 回复量
        pageIndex: 1,
        pageSize: 10,
        total: 0,
    }

    ForumHistory = [];
    navli: '推荐' | '板块' | '关注' = '推荐';

    Blacklist = [];
    loading;
    topList = [];
    checkTopic = "";

    constructor(public navCtrl: NavController, private serve: ForumService,
                public logSer: LogService, public modalCtrl: ModalController,
                private events: Events,
                private storage: Storage, private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        // 发布 自定义事件
        this.events.publish('messageTabBadge:change', {});
        this.logSer.visitLog('lt');
        this.forumList = [];
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

    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    // 新增动态
    PostAddComponent() {
        this.navCtrl.push(PostAddComponent, {data: {}});
    }

    // 前往动态列表
    goPostlist(data) {
        let HistoryName = ''
        if (this.navli == '板块') { //板块浏览历史
            HistoryName = 'userForumHistory';
        }
        if (this.navli == '关注') { // 关注的人的发帖列表
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

    toPostList(item) {
        const data = {
            Id: item.TopicId,
            CoverImage: item.TopicImageUrl,
            Name: item.TopicName,
            navli: this.navli
        }
        this.navCtrl.push(PostlistComponent, {data: data});
    }

    initData() {
        this.isdoInfinite = true;
        this.pageDate.pageIndex = 1;
        if (this.navli == '板块') {
            this.forum_topicplate_search();
            this.getHistory();
        } else if (this.navli == '推荐') {
            this.getListData();
        } else if (this.navli == '关注') {
            this.SearchNewRetFollower();
        }

        const data = {
            PageIndex: 1,
            PageSize: 6,
            IsNoHot: 1
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
        this.forumList = [];
        this.pageDate.Type = text;
        this.initData();
    }

    //修改排序方式 OrderBy
    changeOrder(order) {
        this.forumList = [];
        this.pageDate.OrderBy = order;
        this.initData();
    }

    //下拉刷新
    doRefresh(e) {
        this.isLoad = false;
        setTimeout(() => {
            e.complete();
            this.isdoInfinite = true;
        }, 1000);
        if (this.navli == '板块') {
            this.plateData.pageIndex = 1;
            this.plateList = [];
            this.forum_topicplate_search();
        }
        if (this.navli == '推荐') {
            this.pageDate.pageIndex = 1;
            this.forumList = [];
            this.getListData();
        }

        if (this.navli == '关注') {
            this.followerData.pageIndex = 1;
            this.followList = [];
            this.SearchNewRetFollower();
        }

        this.isdoInfinite = true;
    }

    //上拉加载更多
    doInfinite(e) {
        this.isLoad = false;
        if (this.navli == '板块' && this.plateData.total < this.plateData.total) {
            this.plateData.pageIndex++;
            this.forum_topicplate_search();
        }
        if (this.navli == '推荐' && this.forumList.length < this.pageDate.total) {
            this.pageDate.pageIndex++;
            this.getListData();
        }

        if (this.navli == '关注' && this.followList.length < this.followerData.total) {
            this.followerData.pageIndex++;
            this.SearchNewRetFollower();
        }

        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    SearchtopictagHistory = [];

    //navbar切换
    switchInformation(text) {
        this.isLoad = false;
        this.navli = text;
        if (this.navli == '板块' && this.plateList.length == 0) {
            this.forum_topicplate_search();
        } else if (this.navli == '推荐' && this.forumList.length == 0) {
            this.getListData();
        } else if (this.navli == '关注' && this.followList.length == 0) {
            this.SearchNewRetFollower();
        }
    }

    //动态信息
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
            "PageSize": 10,
            "TopicTagPlateId": this.checkTopic
        };
        this.serve.GetPostSearchhotpost(data).subscribe((res: any) => {
            this.dismissLoading()
            this.isLoad = true;
            if (res.data) {
                let arr = res.data.Posts.Items;
                if (arr.length != 0) {
                    this.forumList = this.forumList.concat(arr);
                }
                this.pageDate.total = res.data.Posts.TotalItems;
                if (arr == 0) {
                    // this.isdoInfinite = false;
                }
            }
        });
    }

    //板块列表
    forum_topicplate_search() {
        if (this.plateData.pageIndex == 1) {
            this.showLoading();
        }
        this.serve.newsearchforumtopicplate(this.plateData).subscribe((res: any) => {
            this.isLoad = true;
            if (!res.data) {
                return
            }
            let arr = res.data.Items;
            if (arr.length == 0) {
                // this.isdoInfinite = false;
            }
            this.plateData.total = res.data.TotalItems;
            this.plateList = this.plateList.concat(arr);
            this.dismissLoading();
        })
    }

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

    // 关注人的发帖信息
    SearchNewRetFollower() {
        this.showLoading();
        this.serve.SearchNewRetFollower(this.followerData).subscribe(res => {
            this.dismissLoading()
            this.isLoad = true;
            if (res.data) {
                let arr = res.data.Posts.Items;
                if (arr.length != 0) {
                    this.followList = this.followList.concat(arr);
                }
                this.followerData.total = res.data.Posts.TotalItems;
                if (arr == 0) {
                    // this.isdoInfinite = false;
                }
            }
        })
    }

    //搜索
    goToSearch() {
        this.navCtrl.push(SearchPage, {type: '动态'});
    }

    //微信分享
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
}
