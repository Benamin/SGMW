import {Component, ViewChild} from '@angular/core';
import {Content, Events, LoadingController, NavController, NavParams, Refresher} from 'ionic-angular';
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
import {Badge} from "@ionic-native/badge";

@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;

    notificationList = [];
    page = {
        page: 1,
        pageSize: 10,
        TotalCount: null,
        isLoad: false,
        BigType: 0,
        IsHaveNextPage: false
    };

    navliArr = [{
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

    constructor(private events: Events, public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService, public commonSer: CommonService, public homeSer: HomeService,
                private loadCtrl: LoadingController, private badge: Badge) {
    }

    ionViewDidEnter() {
        this.badge.clear().then(() => {
        });
        this.showLoading();
    }

    getList() {
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
                this.dismissLoading();
                // 发布 自定义事件
                this.events.publish('messageTabBadge:change', {});
            }
        )
    }

    changeCheckType(checkType) {
        this.showLoading();
        if (this.checkType === checkType) return;
        this.checkType = checkType;
        if (checkType === 'all') this.page.BigType = 0;
        if (checkType === 'system') this.page.BigType = 1;
        if (checkType === 'communication') this.page.BigType = 2;
        if (checkType === 'study') this.page.BigType = 3;
        this.page.page = 1;
        this.getList();
    }

    /**
     * 前往详情
     * 2=系统通知  3=培训通知  4=考试通知  5=课程通知 Csid 6=主题活动 TaId 22 动态回复通知 PostId
     * @param item
     */
    goDetail(item) {
        const data = {
            id: item.Id
        };
        this.mineSer.GetNewsById(data).subscribe(
            (res) => {
                this.page.isLoad = true;
            }
        )
        if (item.Type === 3) { // 系统消息分三种 Type=1系统后台消息  Type=3-培训消息、Type=4考试消息
            this.navCtrl.push(StudyPlanPage, {CrateTime: item.PlanTime});
        } else if (item.Type === 5) {
            // type=5  课程学习通知  csid=课程id courseName=课程名称
            this.goCourse(item);
        } else if (item.Type === 6) {
            // type=6 主题活动通知 taid   ActivityName=主题活动名称
            this.toTheme(item);
        } else if (item.Type === 22 || item.Type === 30 || item.Type === 33) {
            // 互动通知  type=22等于回复 type=30动态点赞 UserName=姓名 HeadPhoto=头部图片 Title=动态标题  Content=内容
            this.goPostsContent(item);
        } else if (item.Type === 31 || item.Type === 32) {
            // 互动通知  type=31 课程讨论点赞
            // 互动通知 type=32 课程讨论回复
            this.goCourse(item);
        } else { // 考试通知 type=4 系统通知  type=2
            this.navCtrl.push(NotificationDetailPage, {id: item.Id});
        }
    }

    // 前往主题活动
    toTheme(obj) {
        if (!obj.TaId) {
            this.commonSer.toast('暂无主题活动');
            return
        }
        this.navCtrl.push(ThemeActivityPage, {Id: obj.TaId});
    }

    //前往课程
    goCourse(e, PostId = null) {
        if (!e) {
            this.commonSer.toast('数据加载中,请稍后...');
            return
        }
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: PostId ? PostId : e.csid});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: PostId ? PostId : e.csid});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: PostId ? PostId : e.csid, StructureType: e.StructureType});
        }
    }

    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: {Id: data.PostId, TopicPlateId: "", Name: ""}});
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
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }
}
