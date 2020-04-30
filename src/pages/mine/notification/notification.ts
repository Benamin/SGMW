import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {NotificationDetailPage} from "../notification-detail/notification-detail";
import {StudyPlanPage} from "../../home/study-plan/study-plan";
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
        Type: 1
    };

    navliArr=[{
        lable: 'system',
        text: '系统消息'
    }, {
        lable: 'training',
        text: '培训通知'
    }, {
        lable: 'test',
        text: '考试通知'
    }];
    checkType = "system";

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
            pageSize: this.page.pageSize,
            Type: this.page.Type
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

    changeCheckType(checkType) {
        if (this.checkType === checkType) return;
        this.checkType = checkType;
        if (checkType === 'system') this.page.Type = 1;
        if (checkType === 'training') this.page.Type = 3;
        if (checkType === 'test') this.page.Type = 4;
        this.page.page = 1;
        this.getList();
    }

    goDetail(item) {
        // console.log(7777, this.checkType)
        if (this.checkType === 'training') { // 3-培训消息、4考试消息、除3-4以外都是系统消息
            // console.log(888, item)
            this.getDetail(item);
        } else { //  || this.checkType === 'test'
            this.navCtrl.push(NotificationDetailPage, {id: item.Id});
        }
    }

    getDetail(item) {
        const data = {
            id: item.Id
        };
        this.mineSer.GetNewsById(data).subscribe(
            (res) => {
                // this.detail = res.data;
                this.navCtrl.push(StudyPlanPage, { CrateTime: item.PlanTime });
                this.page.isLoad = true;
            }
        )
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
            pageSize: this.page.pageSize,
            Type: this.page.Type
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
