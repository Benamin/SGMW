import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, Loading, LoadingController, NavController, NavParams, Refresher} from 'ionic-angular';
import {MineService} from "../mine.service";
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {timer} from "rxjs/observable/timer";
import {ForumService} from '../../forum/forum.service';
import {MyFollowsComponent} from '../my-follows/my-follows.component';
import {LogService} from "../../../service/log.service";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";

@Component({
    selector: 'page-mycollection',
    templateUrl: 'mycollection.html',
})
export class MycollectionPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;
    navli = '课程';
    collectionList = [];
    page = {
        page: 1,
        pageSize: 10,
        TotalCount: null
    };
    isLoad = false;
    myfavoritespage = {"PageIndex": 1, "PageSize": 10};
    isdoInfinite = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl: LoadingController,
                private logSer: LogService,
                private forumServe: ForumService) {
    }

    ionViewDidLoad() {
        this.logSer.visitLog('wdsc');
        this.collectionList = [];
        this.isdoInfinite = true;
        this.page.page = 1;
        this.myfavoritespage.PageIndex = 1;
        this.showLoading()
    }

    switchInformation(text) {
        this.collectionList = [];
        this.isdoInfinite = true;
        this.navli = text;
        this.page.page = 1;
        this.myfavoritespage.PageIndex = 1;
        this.showLoading()
    }


    getforum() {
        this.isLoad = false;
        this.forumServe.myfavorites(this.myfavoritespage).subscribe((res: any) => {
            this.isLoad = true;
            let arr = res.data.Items;
            arr.forEach(element => {
                element.PostRelativeTime = this.forumServe.PostRelativeTimeForm(element.PostRelativeTime);
            });
            if (arr.length == 0) {
                this.isdoInfinite = false;
            }
            this.dismissLoading();
            this.collectionList = this.collectionList.concat(arr);
        });
    }


    getList() {
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.isLoad = false;
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                this.dismissLoading()
                this.isLoad = true;
                this.collectionList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
            }
        )
    }

    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
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
        this.page.page = 1;
        this.myfavoritespage.PageIndex = 1;
        this.is_getData();
    }


    is_getData() {
        if (this.navli == '课程') {
            this.getList();
        } else {
            this.getforum();
        }
    }

    isAddData(e) {
        if (this.navli == '课程') {
            this.doInfinite(e);
        } else {
            this.myfavoritespage.PageIndex++;
            this.getforum();
        }
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }

}
