import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, LoadingController, NavController, NavParams, Refresher} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {timer} from "rxjs/observable/timer";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";

@Component({
    selector: 'page-my-course',
    templateUrl: 'my-course.html',
})
export class MyCoursePage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;
    navbarList = [
        {type: '2', name: '学习中'},
        {type: '1', name: '已完成'},
    ];

    page = {
        page: 1,
        pageSize: 10,
        TotalCount: null,
        studystate: 2,
    };

    courseList = [];
    isLoad = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.showLoading();
    }

    getList() {
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            studystate: this.page.studystate
        };
        this.mineSer.GetMyProductList(data).subscribe(
            (res) => {
                this.courseList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                this.isLoad = true;
                this.dismissLoading()
            }
        )
    }

    changeType(e) {
        this.showLoading();
        this.page.page = 1;
        this.page.studystate = e.type;
        this.getList();
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
        if (this.courseList.length == this.page.TotalCount || this.courseList.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.isLoad = false;
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            studystate: this.page.studystate
        };
        this.mineSer.GetMyProductList(data).subscribe(
            (res) => {
                this.isLoad = true;
                this.courseList = this.courseList.concat(res.data.ProductList);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.page = 1;
        this.getList();
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }

}
