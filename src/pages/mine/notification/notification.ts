import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {NotificationDetailPage} from "../notification-detail/notification-detail";
import {StudyPlanPage} from "../../home/study-plan/study-plan";
import {timer} from "rxjs/observable/timer";
import {CommonService} from "../../../core/common.service";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {ThemeActivityPage} from "../../home/theme-activity/theme-activity";
import {HomeService} from "../../home/home.service";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService, public commonSer:CommonService, public homeSer: HomeService,
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
        } else if(item.Type === 5) {
            // type=5  课程学习通知  csid=课程id courseName=课程名称
            this.goCourse(item);
        } else if(item.Type === 6) {
            // type=6 主题活动通知 taid   ActivityName=主题活动名称
            this.toTheme(item);
        }else if(item.Type === 22) {
            // 互动通知  type=22等于回复  UserName=姓名 HeadPhoto=头部图片 Title=帖子标题  Content=内容
            item.Id = item.TaId
            this.goPostsContent(item);
        } else { // 考试通知 type=4 系统通知  type=2
            this.navCtrl.push(NotificationDetailPage, {id: item.Id});
        }
    }

    // 前往主题活动
    toTheme(obj) {
        if (!obj.Taid) {
            this.commonSer.toast('暂无主题活动');
            return
        }
        this.navCtrl.push(ThemeActivityPage, {Id: obj.Taid});
    }

    //前往课程
    goCourse(e) {
        if (!e) {
            this.commonSer.toast('数据加载中,请稍后...');
            return
        }
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.csid});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.csid});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.csid, StructureType: e.StructureType});
        }
    }

    // 前往帖子详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
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
