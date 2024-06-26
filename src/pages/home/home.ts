import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Events, LoadingController, ModalController, NavController, Slides} from 'ionic-angular';
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
import {AdvancedLevelPage} from "./advanced/level/level";

import {InformationZonePage} from "./information-zone/information-zone";
import {AddAskPage} from "./want-to-ask/add-ask/add-ask";

import {InnerTrainPage} from "./inner-train/inner-train";
import {ForumService} from '../forum/forum.service';
import {PostsContentComponent} from '../forum/posts-content/posts-content.component';
import {GlobalData} from "../../core/GlobleData";
import {DoTestPage} from "./test/do-test/do-test";
import {LookTestPage} from "./test/look-test/look-test";
import {CompetitionListsPage} from "./competition/lists/lists";
import {CompetitionFWPage} from "./fw-competition/lists/lists";
import {MyShortVideoBoxPage} from "../mine/my-short-video-box/my-short-video-box";
import {GetRequestService} from "../../secret/getRequest.service";
import {RoleModalPage} from "./role-modal/role-modal";
import {StudyTaskPage} from "./study-task/study-task";
import {ShareWxComponent} from "../../components/share-wx/share-wx";
import {ThemeActivityComponent} from "../../components/theme-activity/theme-activity";
import {FocusCoursePage} from "../learning/focus-course/focus-course";
import {InnerCoursePage} from "../learning/inner-course/inner-course";
import {wantAskModalPage} from "./want-ask-modal/want-ask-modal";

declare let Swiper: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    @ViewChild('angular') angular: ElementRef;
    @ViewChild('imgWidth') imgWidth: ElementRef;
    @ViewChild('ThemeActivity') ThemeActivity: ThemeActivityComponent;
    @ViewChild(Slides) slides: Slides;

    type = 'teacher';
    personrType = 0;
    saleList = [];  //销售运营
    productList = new Array(6);  //产品体验
    teacherList = [];
    bannerList = [];
    defaultBannerImg = defaultImg;
    mineInfo;
    defaultImg = defaultImg;
    httpUrl = SERVER_HTTP_URL;
    forumLIst = [];
    navli: 'float' | 'product' = 'product';

    info = {
        new: 0,
    };

    wow;   //是否执行动画
    competitionParam = null;
    serveCompetitionParam = null;
    swiper;

    constructor(public navCtrl: NavController, public homeSer: HomeService, private loadCtrl: LoadingController,
                private learnSer: LearnService, private commonSer: CommonService, private storage: Storage,
                private appSer: AppService, public statusBar: StatusBar,
                private mineSer: MineService, private tabSer: TabService, private inAppBrowser: InAppBrowser,
                private renderer: Renderer2,
                private global: GlobalData,
                private getRequest: GetRequestService,
                private events: Events,
                private learSer: LearnService,
                private forum_serve: ForumService,
                private modalCtrl: ModalController) {
        this.statusBar.backgroundColorByHexString('#F8F8F8');
        let app_url = (window as any).localStorage.getItem("app_url");

        if (app_url) {
            this.openPosts(app_url);
            (window as any).localStorage.removeItem("app_url");
        }
        (window as any).handleOpenURL = (url: string) => {
            this.openPosts(url);
        };
        this.listenEvents();
    }

    //部分用户登录无角色 绑定信息之后才会有角色
    listenEvents() {
        // this.storage.set('TodayRemindMission', null); // 测试学习任务弹窗
        this.events.subscribe('RoleID', () => {
            this.storage.get('RoleID').then(value => {
                this.getBanner(value);
                this.getProductList();
            })
        })
    }

    ngOnInit() {
        this.GetTodayRemind();
        this.GetTodayRemindMission();
        this.storage.get('sgmwType').then((value) => {
            if (value && value.sgmwType == 3) {
                this.navCtrl.push(StudyPlanPage);
            }
            if (value && value.sgmwType == 4) {
                this.navCtrl.push(TestCenterPage);
            }
            if (value && value.sgmwType == 22) {
                this.navCtrl.push(PostsContentComponent, {data: {Id: value.Id, TopicPlateId: "", Name: ""}});
            }
        })
    }

    ionViewDidEnter() {
        this.GetTodayIsWantAsk();
        this.events.publish('messageTabBadge:change', {});
        this.storage.get('user').then(value => {
            if (value) {
                this.mineInfo = value;
            }
        });
        this.ThemeActivity.getData();
    }

    //首页初始化
    ionViewDidLoad() {

        //根据角色查询banner和产品列表
        this.storage.get('RoleID').then(value => {
            this.getBanner(value);
            this.getProductList();
        })

        this.storage.get('CourseId').then(value => {
            if (value) {
                this.navCtrl.push(CourseDetailPage, {id: value});
            }
        })

        this.getLIistData();
    }

    ionViewWillEnter() {
        //动画
        this.appSer.wowInfo.subscribe(
            (value) => {
                this.wow = value;
            }
        );

    }

    ionViewDidLeave() {
        this.appSer.setWow(false);
    }

    //轮播图启动轮播
    aotuPlay() {
        this.slides.startAutoplay();
    }

    //下拉刷新
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

    //获取轮播图
    getBanner(RoleID) {
        this.homeSer.getBannerList(RoleID).subscribe(
            (res) => {
                this.bannerList = [];
                this.bannerList = res.data.NewsItems;
                setTimeout(() => {
                    this.initBanner();
                }, 300)
            }
        )
    }

    initBanner() {
        this.swiper = new Swiper(".swiper-home-banner-container", {
            direction: 'horizontal',
            loop: true,//循环切换
            speed: 500,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            observer: true,
            observeParents: true,
            pagination: {
                el: '.swiper-pagination',
            },
            on: {
                slideChangeTransitionEnd: () => {
                    if (this.swiper) {  //手动切换后，pagination组件错乱
                        this.swiper.update();
                    }
                }
            }
        })
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

    //获取热门课程
    getProductList() {
        this.homeSer.GetHotProductList().subscribe(
            (res) => {
                let productList = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (i < 6) productList.push(res.data[i]) // 限制6条数据
                }
                this.productList = productList;
            }
        );
    }

    //获取课程分类
    getProductType() {
        this.homeSer.GetDictionaryByPCode("Subject").subscribe(
            (res) => {
                this.saleList = res.data;
            }
        );
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
        if (!e) {
            this.commonSer.toast('数据加载中,请稍后...');
            return
        }
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
        }
    }

    //banner图跳转
    goCourseBanner(e) {
        if (e.URLType == 0) {
            return;
        }
        if (e.URLType == 1) {

        }
        if (e.URLType == 2) {
            const arr = e.HttpURL.split('/');
            const ID = arr[arr.length - 1];
            if (e.HttpURL.includes('/#/courseDetail')) {  //课程
                this.getCourseDetailById(e.HttpURL);
                return;
            }
            if (e.HttpURL.includes('#/notice/detail/')) {   //资讯
                this.navCtrl.push(Componentsdetails, {dataId: ID});
                return;
            }
            if (e.HttpURL.includes('#/notice/xsgjdetail/')) {  //狼灭榜
                this.navCtrl.push(NumberOneDetailsComponent, {
                    data: {Id: ID}
                });
                return;
            }
            if (e.HttpURL.includes('#/bbsDetail/')) {   //论坛
                this.navCtrl.push(PostsContentComponent, {
                    data: {Id: ID, TopicPlateId: "", Name: ""}
                });
                return;
            }

            this.commonSer.openUrlByBrowser(e.HttpURL);  //打开外链

        }
    }

    /**
     * 前往课程
     * @param HttpURL=课程URL
     * type jzpx 集中培训课程  type=nx 内训课程
     * StructureType 1=老结构课程  2=新结构课程
     */
    getCourseDetailById(HttpURL) {
        // const HttpURL = "http://elearning.sgmw.com.cn/#/courseDetail/69591334-70ab-475a-9e4a-017820b694ac?type=jzpx&StructureType=2";
        const url = HttpURL.split('?');
        const arr = url[0].split('/');
        const ID = arr[arr.length - 1];
        const theRequest = <any>{};
        HttpURL.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => theRequest[k] = v);
        console.log(theRequest)
        if (theRequest && theRequest.type) {
            if (theRequest.type == 'jzpx') {
                this.navCtrl.push(FocusCoursePage, {id: ID});
            }
            if (theRequest.type == 'nx') {
                this.navCtrl.push(InnerCoursePage, {id: ID});
            }
        } else {
            this.navCtrl.push(CourseDetailPage, {id: ID, StructureType: theRequest.StructureType || 2});
        }
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

    // 前往 系列课程
    goJobLevel() {
        this.navCtrl.push(JobLevelPage);
    }

    // 前往 资料专区
    goInformationZone() {
        this.navCtrl.push(InformationZonePage);
    }

    // 前往 猜你想问
    goAddAskPage() {
        this.navCtrl.push(AddAskPage);
    }

    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    // 前往 认证进阶 的 勋章设置
    goAdvancedLevel() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.ValidationLevel({}).subscribe(
            (res) => {
                // console.log('goAdvancedLevel', res.data, res.data.status === 1);
                if (res.data.status === 1) { // 判断是1 else 是0 这里模拟方便

                    this.homeSer.GetRoleByPCode({code: 'Certification'}).subscribe(
                        (resRole) => {
                            loading.dismiss();
                            // console.log('GetRoleByPCode', resRole.data);
                            if (resRole.code === 200) {
                                let modal = this.modalCtrl.create(RoleModalPage, {roleList: resRole.data});
                                modal.onDidDismiss((data) => {
                                    if (data) {
                                        this.homeSer.InitializeLevel({leveltype: data.value}).subscribe(
                                            (resInit) => {
                                                if (resInit.code === 200) {
                                                    this.navCtrl.push(AdvancedLevelPage, {
                                                        leveltype: data,
                                                        roleList: resRole.data
                                                    });

                                                }
                                            }
                                        )

                                    }
                                })
                                modal.present();
                            }
                        }
                    )

                } else if (res.data.status === 0 && res.data.leveltype) {
                    this.homeSer.GetRoleByPCode({code: 'Certification'}).subscribe(
                        (resRole) => {
                            // console.log('GetRoleByPCode', resRole.data);
                            if (resRole.code === 200) {
                                loading.dismiss();
                                this.navCtrl.push(AdvancedLevelPage, {
                                    leveltype: {
                                        value: res.data.leveltype,
                                        label: res.data.LevelName
                                    }, roleList: resRole.data
                                });
                            }
                        }
                    )
                }
            }
        )
    }

    //前往学习任务
    goStudyTask() {
        this.navCtrl.push(StudyTaskPage);
    }

    // 获取热门动态
    getLIistData() {
        let data = {
            IsPlate: 0,
            OrderBy: "ViewCount",
            OrderByDirection: "DESC",
            PageIndex: 1,
            PageSize: 10,
            Poster: "",
            Status: 2,
            Title: "",
            TopicTagPlateId: "",
            Type: "Hot",
        };
        this.forum_serve.GetPostSearchhotpost(data).subscribe((res: any) => {
            if (res.data) {
                this.forumLIst = res.data.Posts.Items;
            }
        });
    }

    /**
     * 网页打开app之后 跳转
     * @param url 链接
     */
    openPosts(url) {
        let url_arr = url.split('/');
        // sgmw://forum/afd79774-4ad7-4c1f-838d-016e1d8705f7
        console.log(url);
        if (url.indexOf('Course') > -1) {  //其他app跳转进入
            const req = <any>this.getRequest.getParamsByHybrid(url)
            this.navCtrl.push(CourseDetailPage, {id: req.CourseId});
            return;
        }

        if (url.indexOf('consultation') > -1) {  //资讯
            this.navCtrl.push(Componentsdetails, {dataId: url_arr[3]});
            return
        }

        if (url.indexOf('forum') > -1) { // 论坛
            this.goPostsContent({Id: url_arr[3]});
            return;
        }

        if (url.indexOf('numberOne') > -1) { // 狼灭榜
            this.goNumberOne();
            return;
        }


        if (url.indexOf('learning') > -1) { //课程 分享进入
            url_arr = url.split('&Id=');
            this.getCourseDetailById(url_arr[1]);
            return;
        }

        if (url.indexOf('test') > -1) { // 考试
            url_arr = url.split('&Fid=');
            this.getPaperDetailByStu(url_arr[1]);
            return;
        }

        if (url.indexOf('shortVideo') > -1) { // 短视频
            const ID = url.split('&Id=')[1].split('&from')[0];
            this.navCtrl.push(MyShortVideoBoxPage, {ID: ID});
            return;
        }
        if (url.indexOf('forum/') > -1) { // 兼容旧版本分享，论坛
            // scheme_url+="forum/"+get_res[1]
            this.goPostsContent({Id: url_arr[3]});
        }
    }

    // 前往考试
    getPaperDetailByStu(Fid) {
        const PDATA = {
            Fid: Fid
        };
        this.homeSer.getPaperDetailByStu(PDATA).subscribe(
            (data) => {
                let ExamInfo = data.data.ExamInfo;
                if (ExamInfo.StudyState == 3) {
                    this.navCtrl.push(LookTestPage, {item: ExamInfo});
                } else {
                    const ExamBegin = this.commonSer.transFormTime(ExamInfo.ExamBegin);
                    const ExamEnd = this.commonSer.transFormTime(ExamInfo.ExamEnd);
                    this.homeSer.getSysDateTime().subscribe(
                        (res) => {
                            const sysDate = this.commonSer.transFormTime(res.data);
                            if (sysDate < ExamBegin) {
                                this.commonSer.toast('考试未开始');
                            } else if (sysDate > ExamEnd && ExamInfo.StudyState == 1) {
                                this.commonSer.toast('当前时间不可考试');
                            } else if (ExamBegin < sysDate && sysDate < ExamEnd) {
                                this.navCtrl.push(DoTestPage, {item: ExamInfo});  //未开始
                            } else if (ExamInfo.StudyState == 2) {   //未完成
                                this.navCtrl.push(DoTestPage, {item: ExamInfo});
                            }
                        }
                    )
                }

            });
    }


    TodayRemind: any = {};
    is_TodayRemind = false;
    TodayRemindMission: any = {};
    is_TodayRemindMission = false;

    GetTodayRemind() {
        this.homeSer.GetTodayRemind().subscribe((res: any) => {
            this.TodayRemind = res.data;
            this.storage.get('TodayRemind').then(val => {
                let date = new Date();
                let dateDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                if (val != dateDay) { // 是否点击了取消今日提醒
                    if (this.TodayRemind && this.TodayRemind.ISExam || this.TodayRemind && this.TodayRemind.Items.length > 0) {
                        this.is_TodayRemind = true;
                    }
                }
            });
        })
    }

    GetTodayRemindMission() {
        this.homeSer.GetTodayRemindMission().subscribe((res: any) => {
            console.log(999, res.data)
            this.TodayRemindMission = res;
            this.storage.get('TodayRemindMission').then(val => {
                let date = new Date();
                let dateDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                if (val != dateDay) { // 是否点击了取消今日提醒
                    if (this.TodayRemindMission.data && this.TodayRemindMission.data === true) {
                        this.is_TodayRemindMission = true;
                    }
                }
            });
        })
    }

    GetTodayIsWantAsk() {
        // this.storage.set('TodayTodayIsWantAsk', null); // 测试
        this.storage.get('TodayTodayIsWantAsk').then(val => {
            let dateDay = new Date().getTime();
            if (val === null || (val && dateDay - val > 24 * 60 * 60 * 1000 * 15)) {
                // 是否第一次 或者超过15天未弹出 意见反馈弹窗
                let modal = this.modalCtrl.create(wantAskModalPage, {});
                modal.onDidDismiss((data) => {
                    if (data) {
                        console.log(data.value, data)
                    }
                })
                modal.present();
            }
        });
    }

    // 开始学习
    startStudy(data) {
        console.log('.....开始学习', data)
        this.getCourseDetailById(data);
    }

    closeTodayRemind() {
        this.is_TodayRemind = false;
    }

    closeTodayRemindMission() {
        this.is_TodayRemindMission = false;
    }

    // 获取销售大赛ID 和 用户所属地区
    getCompetitionId() {
        this.competitionParam = {
            cid: '',
            userArea: ''
        }
        this.homeSer.GetCompetitionID({code: 'xsds'}).subscribe(
            (res) => {
                this.competitionParam.cid = res.data;
            }
        )
        this.homeSer.GetCompetitionListUserArea({}).subscribe(
            (res) => {
                this.competitionParam.userArea = res.data;
            }
        )
    }

    // 获取服务大赛ID 和 用户所属 区域列表 和 省份列表
    getServerCompetition() {
        this.serveCompetitionParam = {
            cid: null,
            ServerAreaArr: null,
            ServerProvinceArr: null
        }
        this.homeSer.GetCompetitionID({code: 'fwds'}).subscribe(
            (res) => {
                this.serveCompetitionParam.cid = res.data;
            }
        )
        // 获取区域列表
        this.homeSer.GetServerCompArea({}).subscribe(
            (res) => {
                this.serveCompetitionParam.ServerAreaArr = res.data;
            }
        )
        // 获取省份列表
        this.homeSer.GetServerCompProvince({}).subscribe(
            (res) => {
                this.serveCompetitionParam.ServerProvinceArr = res.data;
            }
        )

    }

    // 前往销售大赛
    goToXSCompetition() {
        if (!this.competitionParam.cid) {
            this.getCompetitionId();
            return
        }
        this.navCtrl.push(CompetitionListsPage, {
            competitionParam: this.competitionParam
        });
    }

    // 前往服务大赛
    goToFWCompetition() {
        if (!this.serveCompetitionParam.cid || !this.serveCompetitionParam.ServerAreaArr || !this.serveCompetitionParam.ServerProvinceArr) {
            this.getServerCompetition();
            return
        }
        this.navCtrl.push(CompetitionFWPage, {
            competitionParam: this.serveCompetitionParam
        });
    }

    //前往每日一学
    goToDayily() {
        const load = this.loadCtrl.create();
        load.present();
        this.homeSer.GetMeiryx({}).subscribe(
            (res) => {
                load.dismiss();
                if (res.data) {
                    this.navCtrl.push(Componentsdetails, {dataId: res.data.Id, navli: '每日一学'});
                } else {
                    this.commonSer.toast('今日没有学习资讯');
                }
            }
        )
    }

    wxShare(item) {
        let modal = this.modalCtrl.create(ShareWxComponent, {data: item});
        modal.present();
    }
}
