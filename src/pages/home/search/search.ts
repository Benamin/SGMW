import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { LearnService } from "../../learning/learn.service";
import { CourseDetailPage } from "../../learning/course-detail/course-detail";
import { ForumService } from '../../forum/forum.service';
import { Keyboard } from "@ionic-native/keyboard";
import { PostlistComponent } from '../../forum/postlist/postlist.component';
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";


@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    navli: '论坛' | '课程'|null = null;
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
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private keyboard: Keyboard,
        private learnSer: LearnService,
        private loadCtrl: LoadingController,
        private forumService: ForumService,
       ) {
        this.show = true;
        this.navli = this.navParams.get('type') ? this.navParams.get('type') : '课程';
    }
    postList=[];
    navulShow=false;
    switchIn(text) {
        this.navli = text;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }

    ionViewDidLeave() {
    }

    clear() {
        this.show = false;
        this.navCtrl.pop();
    }
    is_getData() {
        if (this.navli == '课程') {
            this.GetProductList({ keyCode: 13 });
        } else {
            this.forum_post_search();
        }
    }

    loadingNum=0;
    loading=null;
    search(event) {
        if (event && event.keyCode == 13) {
            this.pageDate.pageIndex = 1;
            this.page.page = 1;

            this.productList = [];
            this.topicplate=[];
            this.postList=[];
           
            this.loading = this.loadCtrl.create({
              content:''
            });

            this.loading.present();
            this.loadingNum=0;
            setTimeout(() => {
                this.loading.dismiss();
                this.navulShow=true;
            }, 1200);

            this.GetProductList(event);
            this.forum_post_search();
            this.forum_topicplate_search();
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
            this.pageDate.pageIndex ++;
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


    forum_post_search(e=null) {
        this.pageDate.Title = this.page.title;
        this.showTips = false;
        this.forumService.forum_post_search(this.pageDate).subscribe((res: any) => {
            let arr = res.data.Items;
            arr.forEach(element => {
                element.PostRelativeTime = this.forumService.PostRelativeTimeForm(element.PostRelativeTime);
            });
            this.postList = this.postList.concat(arr);
            this.pageDate.TotalCount = res.data.TotalItems;
            if(e){
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
            console.log('论坛结果', res);
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
            this.navCtrl.push(CourseDetailPage, {id: e.Id});
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
            pageSize: this.page.pageSize
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
            pageSize: this.page.pageSize
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
                pageSize: this.page.pageSize
            }
            this.learnSer.GetProductList(data).subscribe(
                (res) => {
                    this.keyboard.hide();
                    this.productList = res.data.ProductList;
                    this.page.TotalCount = res.data.TotalCount
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
        this.navCtrl.push(PostlistComponent, { data: data });
    }

    // 前往帖子详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, { data: data });
    }
}
