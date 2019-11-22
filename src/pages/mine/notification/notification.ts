import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {NotificationDetailPage} from "../notification-detail/notification-detail";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {

    notificationList = [];
    page = {
        page: 1,
        pageSize: 10,
        TotalCount: null,
        isLoad:false,
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl:LoadingController) {
    }

    ionViewDidEnter() {
        this.getList();
    }

    getList() {
        let loading = this.loadCtrl.create({
            content:''
        });
        loading.present();
        const data = {
            page: 1,
            pageSize: this.page.pageSize
        };
        this.mineSer.GetUserNewsList(data).subscribe(
            (res) => {
                this.notificationList = res.data.NewsList;
                this.page.TotalCount = res.data.TotalCount;
                this.page.isLoad = true;
                loading.dismiss();
            }
        )
    }

    goDetail(e) {
        this.navCtrl.push(NotificationDetailPage, {id: e.Id});
    }

    //加载更多
    doInfinite(e) {
        if (this.notificationList.length == this.page.TotalCount || this.notificationList.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.mineSer.GetUserNewsList(data).subscribe(
            (res) => {
                this.notificationList = this.notificationList.concat(res.data.NewsList);
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
