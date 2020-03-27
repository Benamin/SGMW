import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ForumService} from './forum.service';
import {SearchPage} from "../home/search/search";
import {PostlistComponent} from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ViewReplyComponent} from './view-reply/view-reply.component';
import {PostAddComponent} from './post-add/post-add.component';
import {LogService} from "../../service/log.service";

@Component({
    selector: 'page-forum',
    templateUrl: './forum.component.html'
})
export class ForumPage implements OnInit {

    forumLIst = [];
    isdoInfinite = true;
    no_list = false;
    pageDate = {
        OrderBy: "CreateTime",
        creater: "",
        name: "",
        pageIndex: 1,
        pageSize: 10,
        total: 0,
    }
    ForumHistory = [];
    navli: '热帖' | '板块' | '话题' = '热帖';
    conversationData = [];

    Blacklist = [];

    constructor(public navCtrl: NavController, private serve: ForumService,
                public logSer: LogService,
                private storage: Storage, private loadCtrl: LoadingController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.storage.get('Blacklist').then(value => {
            if (value) {
                this.Blacklist = value;
            }
        })
    }

    ionViewDidLoad() {
        this.logSer.visitLog('lt');
        this.forumLIst = [];
        this.conversationData = [];
        this.pageDate.pageIndex = 1;
        this.initData();
    }

    // 前往 评论列表
    showViewReply() {
        this.navCtrl.push(ViewReplyComponent);
    }

    // 前往帖子详情
    goPostsContent(data) {
        console.log(888, data)
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
            this.getLIistData();
        } else if (this.navli == '话题') {
            this.topicplateSearchtopictag();
        }
    }

    avtNav(text) {
        this.forumLIst = [];
        this.pageDate.OrderBy = text;
        this.initData();
    }

    doInfinite(e) {
        console.log('加载');
        this.pageDate.pageIndex++;
        if (this.navli == '板块') {
            this.forum_topicplate_search();
        }
        ;
        if (this.navli == '热帖') {
            this.getLIistData();
        }
        ;

        if (this.navli == '话题') {
            this.topicplateSearchtopictag();
        }
        ;

        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    topicplateSearchtopictag() {
        // this.pageDate.pageIndex=1;
        let data = {
            "PageIndex": this.pageDate.pageIndex,
            "PageSize": 10
        }
        this.serve.topicplateSearchtopictag(data).subscribe((res: any) => {
            console.log('话题列表', res)
            // this.conversationData=res.data.Items;
            let arr = res.data.Items;
            this.conversationData = this.conversationData.concat(arr);
            this.no_list = this.conversationData.length == 0 ? true : false;
        })
    }

    forum_topicplate_search() {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        if (this.pageDate.pageIndex == 1) {
            loading.present();
            setTimeout(() => {
                loading.present();
            }, 7000);
        }
        this.serve.forum_topicplate_search(this.pageDate).subscribe((res: any) => {
            console.log('板块列表', res);
            if (!res.data) {
                return
            }
            let arr = res.data.Items;
            if (arr.length == 0) {
                this.isdoInfinite = false;
            }

            this.forumLIst = this.forumLIst.concat(arr);
            this.no_list = this.forumLIst.length == 0 ? true : false;
            loading.dismiss();
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
        ;

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

    getLIistData() {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        loading.present();
        let data = {
            // "IsHotPost": "0",
            // "OrderBy": this.pageDate.OrderBy,
            // "OrderByDirection": "DESC",
            // "PageIndex": this.pageDate.pageIndex,
            // "PageSize": 10,

            "Title": "",
//   "TopicPlateId": "",
  "Status": 2,
  "Poster": "",
  "IsPlate": 0,
  "OrderBy": this.pageDate.OrderBy,
  "OrderByDirection": "DESC",
  "PageIndex": this.pageDate.pageIndex,
  "PageSize": 10
        };

        this.serve.GetPostSearchhotpost(data).subscribe((res: any) => {
        // this.serve.forum_post_search(data).subscribe((res: any) => {
            
            loading.dismiss();
            if (res.data) {
                // let arr = res.data.Items;
                let arr = res.data.ProductList;
                this.forumLIst = this.forumLIst.concat(arr);
                this.no_list = this.forumLIst.length > 0 ? false : true;
                if (arr == 0) {
                    this.isdoInfinite = false;
                }
            }
            console.log(res);
        });
    }

}
