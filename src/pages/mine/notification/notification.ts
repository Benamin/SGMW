import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
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
        BigType: 0,
	IsHaveNextPage: false
    };
		
    navliArr=[{
        lable: 'all',
        text: '全部'
    }, {
        lable: 'system',
        text: '系统消息'   //培训和考试通知
    }, {
        lable: 'communication',
        text: '互动通知'
    }, {
        lable: 'study',
        text: '学习通知'   //课程学习和主题活动
    }];
    
    checkType = "all";

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
            BigType: this.page.BigType
        };
        this.mineSer.GetUserNewsList(data).subscribe(
            (res) => {
							this.page.IsHaveNextPage = res.data.IsHaveNextPage;
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
        if (checkType === 'all') this.page.BigType = 0;
        if (checkType === 'system') this.page.BigType = 1;
        if (checkType === 'communication') this.page.BigType = 2;
				if (checkType === 'study') this.page.BigType = 3;
        this.page.page = 1;
        this.getList();
    }

    goDetail(item) {
        if (item.Type === 3) { // 系统消息分三种 Type=1系统后台消息  Type=3-培训消息、Type=4考试消息
            this.getDetail(item);
        } else {
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
        if (!this.page.IsHaveNextPage) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize,
            BigType: this.page.BigType
        };
        this.mineSer.GetUserNewsList(data).subscribe(
            (res) => {
							this.page.IsHaveNextPage = res.data.IsHaveNextPage;
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
