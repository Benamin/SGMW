import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine/mine.service";
import {CourseDetailPage} from "../learning/course-detail/course-detail";
import {timer} from "rxjs/observable/timer";
import {LogService} from "../../service/log.service";

@IonicPage()
@Component({
    selector: 'page-course',
    templateUrl: 'course.html',
})
export class CoursePage {
    navbarList = [
        {type: '2', name: '学习中'},
        {type: '1', name: '已完成'},
    ];

    page = {
        page: 1,
        pageSize: 10,
        studystate: 2,
        TotalItems: 0,
        load:false
    };

    courseList = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private logSer:LogService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.logSer.visitLog('wdxx');
        this.getList();
    }

    doRefresh(e) {
        this.page.page = 1;
        this.getList();
        timer(1000).subscribe((res) => {
            e.complete()
        });
    }

    getList() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            studystate: this.page.studystate
        };
        this.mineSer.GetMyProductList(data).subscribe(
            (res) => {
                this.courseList = res.data.ProductList;
                this.page.TotalItems = res.data.TotalCount;
                loading.dismiss();
                this.page.load = true;
            }
        )
    }

    changeType(e) {
        this.page.page = 1;
        this.page.studystate = e.type;
        this.page.load = false;
        this.getList();
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
    }

    //下拉加载更多
    doInfinite(e) {
        if (this.courseList.length == this.page.TotalItems || this.courseList.length > this.page.TotalItems) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            studystate: this.page.studystate
        };
        this.mineSer.GetMyProductList(data).subscribe(
            (res) => {
                this.courseList = this.courseList.concat(res.data.ProductList);
                this.page.TotalItems = res.data.TotalCount;
                e.complete();
            }
        )
    }

}


