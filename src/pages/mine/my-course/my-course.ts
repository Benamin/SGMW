import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-my-course',
    templateUrl: 'my-course.html',
})
export class MyCoursePage {
    navbarList = [
        {type: '2', name: '学习中'},
        {type: '1', name: '已完成'},
    ];

    page = {
        page: 1,
        pageSize: 10,
        TotalCount:null,
        studystate: 2,
    };

    courseList = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl:LoadingController) {
    }

    ionViewDidLoad() {
        this.getList();
    }

    getList() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            studystate:this.page.studystate
        };
        this.mineSer.GetMyProductList(data).subscribe(
            (res) => {
                this.courseList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                loading.dismiss();
            }
        )
    }

    changeType(e) {
        this.page.page = 1;
        this.page.studystate = e.type;
        this.getList();
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    //加载更多
    doInfinite(e) {
        if (this.courseList.length == this.page.TotalCount || this.courseList.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            studystate:this.page.studystate
        };
        this.mineSer.GetMyProductList(data).subscribe(
            (res) => {
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
        timer(1000).subscribe(() => {e.complete();});
    }

}
