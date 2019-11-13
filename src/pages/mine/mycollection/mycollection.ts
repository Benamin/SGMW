import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MineService } from "../mine.service";
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import { CourseDetailPage } from "../../learning/course-detail/course-detail";
import { timer } from "rxjs/observable/timer";
import { ForumService } from '../../forum/forum.service';
import {MyFollowsComponent} from '../my-follows/my-follows.component';
import {LogService} from "../../../service/log.service";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";

@Component({
    selector: 'page-mycollection',
    templateUrl: 'mycollection.html',
})
export class MycollectionPage {
    navli = '课程';
    collectionList = [];
    page = {
        page: 1,
        pageSize: 10,
        TotalCount: null
    };
    myfavoritespage = { "PageIndex": 1, "PageSize": 10 };
    isdoInfinite=true;
    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
        private loadCtrl: LoadingController,
        private logSer:LogService,
        private forumServe: ForumService) {
    }

    ionViewDidEnter() {
        this.logSer.visitLog('wdsc');
        this.collectionList=[];
        this.isdoInfinite=true;
        this.page.page=1;
        this.myfavoritespage.PageIndex=1;
        this.is_getData();
    }
    switchInformation(text) {
        this.collectionList=[];
        this.isdoInfinite=true;
        this.navli = text;
        this.page.page=1;
        this.myfavoritespage.PageIndex=1;
        this.is_getData();
    }


    getforum() {
        let loading = null;
        if(this.myfavoritespage.PageIndex==1){
          loading = this.loadCtrl.create({
            content:''
          });
          loading.present();
        }
        this.forumServe.myfavorites(this.myfavoritespage).subscribe((res:any) => {
            if (this.myfavoritespage.PageIndex == 1) {
                loading.dismiss();
            }
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


    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                this.collectionList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                loading.dismiss();
            }
        )
    }

   // 前往帖子详情
   goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
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


    //加载更多
    doInfinite(e) {
        if (this.collectionList.length == this.page.TotalCount || this.collectionList.length > this.page.TotalCount) {
            e.complete();
            this.isdoInfinite = false;
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                this.collectionList = this.collectionList.concat(res.data.ProductList);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.page=1;
        this.myfavoritespage.PageIndex=1;
        this.is_getData();
        timer(1000).subscribe(() => { e.complete(); });
    }


    is_getData(){
        if(this.navli=='课程'){
            this.getList();
        }else{
            this.getforum();
        }
    }
    isAddData(e){
        if(this.navli=='课程'){
            this.doInfinite(e);
        }else{
            this.myfavoritespage.PageIndex++;
            this.getforum();
            setTimeout(() => {
                e.complete();
            }, 1000);
        }
    }

}
