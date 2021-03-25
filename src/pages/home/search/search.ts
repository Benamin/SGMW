import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../../learning/learn.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {ForumService} from '../../forum/forum.service';
import {Keyboard} from "@ionic-native/keyboard";
import {PostlistComponent} from '../../forum/postlist/postlist.component';
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {LogService} from "../../../service/log.service";
import {PersonalCenterPage} from "../personal-center/personal-center";
import {Storage} from "@ionic/storage";
import {defaultHeadPhoto} from "../../../app/app.constants";


@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    navli: '论坛' | '课程' | null = null;
    productList = [];
    page = {
        title: '',
        page: 1,
        pageSize: 10,
        TotalCount: null,
    };
    pageDate: any = {
        creater: "",
        pageIndex: 1,
        pageSize: 10,
        status: 2,
        title: "",
        TotalCount: null,
        total: 111,
        OrderBy: 'PostTimeFormatted',
        OrderByDirection: 'desc'
    }
    show;
    showTips = true;
    topicplate = [];
    defaultHeadPhoto = defaultHeadPhoto;


    // 默认不为空
    emptyShow = false

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private keyboard: Keyboard,
                public storage: Storage,
                private learnSer: LearnService,
                private loadCtrl: LoadingController,
                private forumService: ForumService,
                public logSer: LogService
    ) {
        this.show = true;
        this.navli = this.navParams.get('type') ? this.navParams.get('type') : '课程';
    }

    postList = [];
    navulShow = false;

    switchIn(text) {
        this.navli = text;
    }

    ionViewDidLoad() {
    }

    ionViewDidLeave() {
    }

    clear() {
        this.show = false;
        this.navCtrl.pop();
    }

    is_getData() {
        if (this.navli == '课程') {
            this.GetProductList({keyCode: 13});
        } else {
            this.forum_post_search();
        }
    }

    loadingNum = 0;
    loading = null;

    search(event) {
        if (event && event.keyCode == 13) {
            this.pageDate.pageIndex = 1;
            this.page.page = 1;

            this.productList = [];
            this.topicplate = [];
            this.postList = [];

            this.loading = this.loadCtrl.create({
                content: ''
            });

            this.loading.present();
            this.loadingNum = 0;
            setTimeout(() => {
                this.loading.dismiss();
                this.navulShow = true;
            }, 1200);

            this.showTips = true
            this.emptyShow = false

            this.GetProductList(event);
            this.forum_post_search();
            this.forum_topicplate_search();

            //搜索日志
            if (this.page.title) this.logSer.keyWordLog(this.page.title);
        }
    }

    addData(e) {
        if (this.navli == '课程') {
            this.doInfinite(e);
        } else {
            if (this.pageDate.TotalCount && this.pageDate.TotalCount == this.postList.length || this.postList.length > this.page.TotalCount) {
                e.complete();
                return
            }
            this.pageDate.pageIndex++;
            this.forum_post_search(e);
        }
    }

    Refresh(event) {
        if (this.navli == '课程') {
            this.doRefresh(event);
        } else {
            this.pageDate.pageIndex = 1;
            this.productList = [];


            this.forum_post_search();
            this.forum_topicplate_search();
        }
    }

    forum_post_search(e = null) {
        this.pageDate.Title = this.page.title;
        this.showTips = false;
        this.forumService.forum_post_search_old(this.pageDate).subscribe((res: any) => {
            let arr = res.data.Items;
            // let arr=res.data.UnTopPosts.Items;
            // let arr=res.data.Posts.Items;
            arr.forEach(element => {
                element.PostRelativeTime = this.forumService.PostRelativeTimeForm(element.PostRelativeTime);
            });
            this.postList = this.postList.concat(arr);
            this.pageDate.TotalCount = res.data.TotalItems;
            if (e) {
                e.complete();
            }
        });

    }

    forum_topicplate_search() {
        let topicplateDate = {
            creater: "",
            name: this.page.title,
            pageIndex: 1,
            pageSize: 200,
            total: 0,
        }
        this.topicplate = [];
        this.showTips = false;
        this.forumService.forum_topicplate_search(topicplateDate).subscribe((res: any) => {
            this.topicplate = res.data.Items;
            if(this.topicplate.length == 0){
                this.emptyShow = true
            }
        });
    }


    showKey() {
        this.keyboard.show();
    }

    goCourse(e) {
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
        }
    }

    doInfinite(e) {
        if (this.page.TotalCount == this.productList.length || this.productList.length > this.page.TotalCount) {
            e.complete();
            return
        }
        this.page.page++;
        const data = {
            title: this.page.title,
            page: this.page.page,
            pageSize: this.page.pageSize,
            "OrderBy": "CreateTime",
            "SortDir": "DESC",
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = this.productList.concat(res.data.ProductList);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        );
    }

    doRefresh(e) {
        const data = {
            title: this.page.title,
            page: 1,
            pageSize: this.page.pageSize,
            "OrderBy": "CreateTime",
            "SortDir": "DESC",
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        );
    }

    GetProductList(event) {
        this.showTips = false;
        if (event && event.keyCode == 13) {
            const data = {
                title: this.page.title,
                page: this.page.page,
                pageSize: this.page.pageSize,
                "OrderBy": "CreateTime",
                "SortDir": "DESC",
            }
            this.learnSer.GetProductList(data).subscribe(
                (res) => {
                    this.keyboard.hide();
                    this.productList = res.data.ProductList;
                    this.page.TotalCount = res.data.TotalCount
                    if(this.productList.length == 0){
                        this.emptyShow = true
                        console.log(this.emptyShow)
                    }
                }
            );
        }
    }

    // 前往发帖列表
    goPostlist(data) {
        let userForumHistory: any = window.localStorage.getItem('userForumHistory');
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
        window.localStorage.setItem('userForumHistory', JSON.stringify(arr));

        this.navCtrl.push(PostlistComponent, {data: data});
    }

    // 前往帖子详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    //点赞
    handleLike(item, e) {
        e.stopPropagation();
        if (item.isClick) return;

        item.isClick = true;
        if (item.IsGiveLike) {
            this.forumService.forum_post_cancellike(item.Id).subscribe((res: any) => {
                item['IsGiveLike'] = false;
                if (item.LikeCount > 0) item.LikeCount--;
                item.isClick = false;
            });
        } else {
            this.forumService.forum_post_like(item.Id).subscribe((res: any) => {
                item['IsGiveLike'] = true;
                item.LikeCount++;
                item.isClick = false;
            });
        }
    }

    //他人详情
    toPersonInfo(item) {
        this.storage.get('user').then(value => {
            if (item.Poster !== value.MainUserID) {
                this.navCtrl.push(PersonalCenterPage, {Poster: item.Poster})
            }
        });
    }
}
