import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {HomeService} from "./home.service";
import {LearnService} from "../learning/learn.service";
import {CommonService} from "../../core/common.service";
import {LearningPage} from "../learning/learning";
import {GoodTeacherPage} from "./good-teacher/good-teacher";
import {SearchPage} from "./search/search";
import {NoDevPage} from "./no-dev/no-dev";
import {Storage} from "@ionic/storage";
import {NotificationPage} from "../mine/notification/notification";
import {CourseDetailPage} from "../learning/course-detail/course-detail";
import {TeacherPage} from "../learning/teacher/teacher";
import {defaultImg, SERVER_HTTP_URL} from "../../app/app.constants";
import {MineService} from "../mine/mine.service";
import {TabService} from "../../core/tab.service";
import {timer} from "rxjs/observable/timer";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {AppService} from "../../app/app.service";
import {StatusBar} from "@ionic-native/status-bar";
import {TestCenterPage} from "./test/test-center/test-center";
import {ConsultationPage} from '../consultation/consultation';
import {NumberOne} from '../number-one/number-one.component';
import {LivePage} from "./live/live";
import {ForumPage} from '../forum/forum.component';
import {Componentsdetails} from '../consultation/componentsdetails/componentsdetails.component';
import {NumberOneDetailsComponent} from '../number-one/numberOneDetails/numberOneDetails.component';
import {MyQuestion} from "./question/my-question/my-question";
import {RankingComponent} from "../ranking/ranking.component";
import {FocusTrainPage} from "./focus-train/focus-train";

import {StudyPlanPage} from "./study-plan/study-plan";
import {JobLevelPage} from "./job-level/job-level";

import {InnerTrainPage} from "./inner-train/inner-train";
import {FocusCoursePage} from "../learning/focus-course/focus-course";
import {InnerCoursePage} from "../learning/inner-course/inner-course";
import {ForumService} from '../forum/forum.service';
import {PostsContentComponent} from '../forum/posts-content/posts-content.component';
import {GlobalData} from "../../core/GlobleData";
import {DoTestPage} from "./test/do-test/do-test";
import {LookTestPage} from "./test/look-test/look-test";
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild('angular') angular: ElementRef;
    @ViewChild('imgWidth') imgWidth: ElementRef;
    @ViewChild(Slides) slides: Slides;

    type = 'teacher';
    personrType = 0;
    saleList = [];  //销售运营
    productList = new Array(5);  //产品体验
    teacherList = [];
    bannerList = [
        {SourceUrl: defaultImg}
    ];
    mineInfo;
    defaultImg = defaultImg;
    httpUrl = SERVER_HTTP_URL;
    forumLIst = [];
    navli: 'float' | 'product' = 'product';

    info = {
        new: 0,
    };

    wow;   //是否执行动画

    constructor(public navCtrl: NavController, public homeSer: HomeService, private loadCtrl: LoadingController,
                private learnSer: LearnService, private commonSer: CommonService, private storage: Storage,
                private appSer: AppService, public statusBar: StatusBar,
                private mineSer: MineService, private tabSer: TabService, private inAppBrowser: InAppBrowser,
                private renderer: Renderer2,
                private global: GlobalData,
                private learSer: LearnService,
                private forum_serve: ForumService) {
        this.statusBar.backgroundColorByHexString('#343435');
        this.storage.get('user').then(value => {
            if (value) {
                this.mineInfo = value;
                if (this.mineInfo.UserName && this.mineInfo.UserName.length > 3) {
                    this.mineInfo.UserName = this.mineInfo.UserName.slice(0, 3) + '...';
                }
            }
        });
        let app_url = (window as any).localStorage.getItem("app_url");
        if (app_url) {
            this.openPosts(app_url);
            (window as any).localStorage.removeItem("app_url");
        }
        (window as any).handleOpenURL = (url: string) => {
            this.openPosts(url);
        };
    }

    ionViewDidLoad() {
        this.storage.get('RoleID').then(value => {
            this.getBanner(value);
            this.getProductList(value);
        })
        this.getGoodsTeacher();
        this.getLIistData();
        this.GetTodayRemind();
    }

    ionViewWillEnter() {
        this.appSer.wowInfo.subscribe(
            (value) => {
                this.wow = value;
            }
        )
        this.info.new = 0;
        this.getNew();
    }

    ionViewDidLeave() {
        this.appSer.setWow(false);
    }

    aotuPlay() {
        this.slides.startAutoplay();
    }

    doRefresh(e) {
        this.ionViewDidLoad();
        timer(1000).subscribe((res) => {
            e.complete()
        });
    }


    ionViewWillLeave() {
        if (this.slides) {
            this.slides.stopAutoplay();
        }
    }

    selectType(type) {
        this.type = type;
    }

    saleToLearn(item, index) {
        const data = {
            item: item, headType: index + 1
        };
        this.storage.set('course', data);
        this.navCtrl.parent.select(1);
    }

    goToLearn(index) {
        this.navCtrl.setRoot(LearningPage, {item: this.productList[index], headType: 1});
        this.navCtrl.parent.select(1);
    }

    selectPerson(index) {
        this.personrType = index;
        const width = this.imgWidth.nativeElement.offsetWidth / 5;
        this.angular.nativeElement.style.left = index * width + width / 2 - 10 + 'px';
    }

    //获取轮播图
    getBanner(RoleID) {
        this.homeSer.getBannerList(RoleID).subscribe(
            (res) => {
                this.bannerList = res.data.NewsItems;
            }
        )
    }

    //优秀教师
    getGoodsTeacher() {
        this.homeSer.GetGoodTeacherList().subscribe(
            (res) => {
                this.teacherList = res.data.TeacherItems;
                if (this.teacherList.length > 5) {
                    this.teacherList.splice(5, this.teacherList.length - 5);
                    this.teacherList.forEach(e => {
                        if (e.UserName.length > 3) {
                            e.UserName = e.UserName.splice(0, 1) + '...';
                        }
                    })
                }
            }
        )
    }

    //获取产品分类 nlts
    async getProductList(RoleID) {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        loading.present();
        await this.homeSer.GetDictionaryByPCode("Subject").subscribe(
            (res) => {
                this.saleList = res.data;
            }
        );
        const data = {
            "page": 1,
            "pageSize": 4,
            "OrderBy": "CreateTime",
            "IsAsc": "DESC",
            "IsHot": true,
            "SortDir": "DESC",
            "RoleID": RoleID
        };
        await this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = res.data.ProductList;
            }
        );
        await loading.dismiss();
    }

    //更多课程
    moreCourse() {
        this.navCtrl.parent.select(1);
    }

    //关注
    async focusHandle(item) {
        const data = {
            TopicID: item.UserID
        };
        await this.learnSer.SaveSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('关注成功');
                this.getGoodsTeacher();
            }
        );
    }

    //取消关注
    async cancleFocusHandle(item) {
        const data = {
            TopicID: item.UserID
        };
        this.learnSer.CancelSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('取消关注成功');
                this.getGoodsTeacher();
            }
        )
    }

    //查询消息
    getNew() {
        const data = {
            "Type": 0,
            "Page": 1,
            "PageSize": 1000,
        };
        this.mineSer.GetUnReadUserNewsList(data).subscribe(
            (res) => {
                res.data.NewsList.forEach(e => {
                    if (e.Status == 0) {
                        this.info.new++;
                    }
                })
            }
        )
    }

    //更多教师
    moreTeacher() {
        this.navCtrl.push(GoodTeacherPage);
    }

    goToSearch() {
        this.navCtrl.push(SearchPage);
    }

    goToNotifation() {
        this.navCtrl.push(NotificationPage);
    }

    //教师详情
    teachDetail(item) {
        this.navCtrl.push(TeacherPage, {item: item});
    }

    goDev(title) {
        this.navCtrl.push(NoDevPage, {title: title});
    }

    //考试中心
    goTest() {
        this.navCtrl.push(TestCenterPage);
    }

    //前往课程
    goCourse(e) {
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id});
        }
    }

    //前往课程
    goCourseBanner(e) {
        if (e.URLType == 0) {
            return;
        }
        if (e.URLType == 1) {

        }
        if (e.URLType == 2) {
            if (e.HttpURL.includes('/#/courseDetail')) {
                const arr = e.HttpURL.split('/');
                this.getCourseDetailById(arr[arr.length - 1]);
            } else if (e.HttpURL.includes('#/notice/detail/')) {
                const arr = e.HttpURL.split('/');
                this.navCtrl.push(Componentsdetails, {
                    data: {
                        Id: arr[arr.length - 1]
                    }
                });
            } else if (e.HttpURL.includes('#/notice/xsgjdetail/')) {
                const arr = e.HttpURL.split('/');
                this.navCtrl.push(NumberOneDetailsComponent, {
                    data: {
                        Id: arr[arr.length - 1]
                    }
                });
            } else {
                this.commonSer.openUrlByBrowser(e.HttpURL);
            }
        }
    }

    //获取课程详情
    getCourseDetailById(id) {
        this.learSer.GetProductById(id).subscribe(
            (res) => {
                if (res.data) {
                    this.goCourse(res.data);
                }
            }
        );
    }

    goToNavli() {
        if (this.navli == 'product') {
            this.moreCourse()
        } else if (this.navli == 'float') {
            this.goForumComponent();
        }
    }

    // 前往资讯
    goConsultation() {
        this.navCtrl.push(ConsultationPage);
    }

    // 前往论坛
    goForumComponent() {
        this.navCtrl.push(ForumPage);
    }

    // 前往状元说
    goNumberOne() {
        this.navCtrl.push(NumberOne);
    }

    // 前往排行榜
    goRanking() {
        this.navCtrl.push(RankingComponent);
    }

    //前往直播
    goLive() {
        this.navCtrl.push(LivePage);
    }

    //前往问卷
    goQuestion() {
        this.navCtrl.push(MyQuestion);
    }

    //前往内训
    goInnerTrain() {
        this.navCtrl.push(InnerTrainPage);
    }

    //前往集中培训
    goFocusTrain() {
        this.navCtrl.push(FocusTrainPage);
    }

    // 前往学习计划
    goStudyPlan() {
        this.navCtrl.push(StudyPlanPage);
    }

    // 前往学习计划
    goJobLevel() {
        this.navCtrl.push(JobLevelPage);
    }


    // 前往帖子详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    // 获取热门帖子
    getLIistData() {
        this.forum_serve.GetPostSearchhotpost().subscribe((res: any) => {
            if (res.data) {
                this.forumLIst = res.data.UnTopPosts.Items;
                if (this.forumLIst.length > 4) {
                    this.forumLIst.length = 4;
                }
            }

        });
    }

    openPosts(url) {
        let url_arr = url.split('/');
        // sgmw://forum/afd79774-4ad7-4c1f-838d-016e1d8705f7
        if(url.indexOf('forum')> -1){ // 论坛
            url_arr;
          }else if(url.indexOf('learning')> -1){ //课程
            url_arr = url.split('&Id=');
            this.getCourseDetailById(url_arr[1])
          }else if(url.indexOf('test')> -1){ // 考试
            url_arr = url.split('&Fid=');
            this.getPaperDetailByStu(url_arr[1])
          }else{ // 兼容旧版本分享，论坛
            // scheme_url+="forum/"+get_res[1]
            this.goPostsContent({Id: url_arr[3]});
          }
    }

    // 前往考试
    getPaperDetailByStu(Fid){
        const PDATA = {
            Fid: Fid
        };
        this.homeSer.getPaperDetailByStu(PDATA).subscribe(
            (data) => {
                let ExamInfo=data.data.ExamInfo;
                if(ExamInfo.StudyState==3){
                    this.navCtrl.push(LookTestPage, {item: ExamInfo});
                }else{
                    const ExamBegin = this.commonSer.transFormTime(ExamInfo.ExamBegin);
                    const ExamEnd = this.commonSer.transFormTime(ExamInfo.ExamEnd);
                    this.homeSer.getSysDateTime().subscribe(
                        (res) => {
                            const sysDate = this.commonSer.transFormTime(res.data);
                            if (sysDate < ExamBegin) {
                                this.commonSer.toast('考试未开始');
                            }else if (sysDate > ExamEnd && ExamInfo.StudyState == 1) {
                                this.commonSer.toast('当前时间不可考试');
                            } else if (ExamBegin < sysDate && sysDate < ExamEnd) {
                                this.navCtrl.push(DoTestPage, {item: ExamInfo});  //未开始
                            } else if(ExamInfo.StudyState == 2){   //未完成
                                this.navCtrl.push(DoTestPage, {item: ExamInfo});
                            }
                        }
                    )
                }

        });
    }


    TodayRemind: any = {};
    is_TodayRemind = false;

    GetTodayRemind() {
        this.homeSer.GetTodayRemind().subscribe((res: any) => {
            this.TodayRemind = res.data;
            this.storage.get('TodayRemind').then(val => {
                let date = new Date();
                let dateDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                if (val != dateDay) { // 是否点击了取消今日提醒
                    if (this.TodayRemind.ISExam || this.TodayRemind.Items.length > 0) {
                        this.is_TodayRemind = true;
                    }
                }
            });
        })
    }

    // 开始学习
    startStudy(data) {
        this.getCourseDetailById(data);
        // this.getCourseDetailById('47bb05c6-194e-4087-92e9-016f4c1c8421');
    }

    closeTodayRemind() {
        this.is_TodayRemind = false;
    }
}
