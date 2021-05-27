import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {ForumService} from '../forum.service';
import {PostsContentComponent} from '../posts-content/posts-content.component';
import {PostAddComponent} from '../post-add/post-add.component';
import {SearchPage} from "../../home/search/search";
import {Storage} from "@ionic/storage";
import {ShareWxComponent} from "../../../components/share-wx/share-wx";
import {PersonalCenterPage} from "../../home/personal-center/personal-center";

@Component({
    selector: 'page-postlist',
    templateUrl: './postlist.component.html'
})
export class PostlistComponent implements OnInit {
    ngOnInit(): void {
        // throw new Error("Method not implemented.");
        this.lidata = this.navParams.get('data');
        this.initList();
    }

    lidata = {Id: "", PostCount: null};
    IsTopOpt = null;
    pageDate: any = {
        creater: "",
        PageIndex: 1,
        pageSize: 5,
        status: 2,
        title: "",
        total: 111,
        OrderBy: "CreateTime",  // CreateTime 发帖时间    PostTimeFormatted 回复时间
        OrderByDirection: 'Desc',
        Type: "New",   // New 最新  CreateTime 发帖时间    PostTimeFormatted 回复时间 //Hot 最热 ReplyCount  ViewCount
    }
    forumLIst = [];
    isdoInfinite = true;
    no_list = false;

    Blacklist = [];

    constructor(private serve: ForumService,
                public navParams: NavParams,
                public navCtrl: NavController,
                private storage: Storage,
                private modalCtrl: ModalController,
                private loadCtrl: LoadingController) {
    }

    ionViewDidEnter() {
        this.storage.get('Blacklist').then(value => {
            if (value) {
                this.Blacklist = value;
            }
        })
    }

    //修改排序方式 OrderBy
    changeOrder(order) {
        this.forumLIst = [];
        this.pageDate.OrderBy = order;
        this.initList();
    }

    initList() {
        this.lidata = this.navParams.get('data');
        console.log(this.lidata);
        if (this.lidata['navli'] && this.lidata['navli'] == '推荐') {
            this.pageDate.TopicTagPlateId = this.lidata.Id;  // 测试时使用初始化 ID 默认使用默认板块
        } else {
            this.pageDate.topicPlateId = this.lidata.Id;  // 测试时使用初始化 ID 默认使用默认板块
        }
        this.forumLIst = [];
        this.pageDate.PageIndex = 1;
        this.no_list = false;
        this.forum_post_search();
    }

    l

    // 我收藏的动态
    myfavorites() {
        this.serve.myfavorites({"PageIndex": 1, "PageSize": 10}).subscribe(res => {
        })
    }


    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    // 新增动态
    PostAddComponent(data) {
        this.navCtrl.push(PostAddComponent, {data: data});
    }

    avtNav(type) {
        this.no_list = false;
        this.isdoInfinite = true;
        this.forumLIst = [];
        this.pageDate.PageIndex = 1;
        this.pageDate.Type = type;

        if (type === "New") this.pageDate.OrderBy = "CreateTime";
        if (type === "Hot") this.pageDate.OrderBy = "ViewCount";

        this.forum_post_search();
    }

    // 获取动态列表
    forum_post_search() {
        let loading = null;
        if (this.pageDate.PageIndex == 1) {
            loading = this.loadCtrl.create({
                content: ''
            });
            loading.present();
            setTimeout(() => {
                loading.dismiss();
            }, 5000);
        }
        this.serve.forum_post_search(this.pageDate).subscribe((res: any) => {
            if (this.pageDate.PageIndex == 1) {
                loading.dismiss();
            }
            if (!res.data) {
                return
            }
            let arr = res.data.Posts.Items;
            if (!this.lidata.PostCount) {
                this.lidata.PostCount = res.data.Posts.TotalItems;
            }
            // let arr=res.data.Posts.Items;

            if (!this.IsTopOpt) {
                for (let n = 0; n < arr.length; n++) {
                    if (arr[n].IsTop) {
                        this.IsTopOpt = arr[n];
                        break;
                    }
                }
            }
            arr.forEach(element => {
                element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime);
            });

            if (arr.length == 0) {
                this.isdoInfinite = false;
            }

            this.forumLIst = this.forumLIst.concat(arr);
            this.no_list = this.forumLIst.length == 0 ? true : false;
        });
    }


    doInfinite(e) {
        this.pageDate.PageIndex++;
        this.forum_post_search();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    doRefresh(e) {
        this.pageDate.PageIndex = 1;
        this.forumLIst = [];
        this.forum_post_search();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    goToSearch() {
        this.navCtrl.push(SearchPage, {type: '动态'});
    }

    wxShare(item) {
        let modal = this.modalCtrl.create(ShareWxComponent, {data: item});
        modal.present();
    }

    goToPersonalCenter(item) {
        console.log('666-item', item.Poster)
        this.navCtrl.push(PersonalCenterPage, {Poster: item.Poster});
    }
}
