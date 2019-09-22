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
import {TestCenterPage} from "./test-center/test-center";
import { ConsultationPage } from '../consultation/consultation';
import { NumberOne } from '../number-one/number-one.component';
import {LivePage} from "./live/live";
import { ForumPage } from '../forum/forum.component';
declare let md5;

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

    info = {
        new: 0,
    };

    wow;   //是否执行动画

    constructor(public navCtrl: NavController, public homeSer: HomeService, private loadCtrl: LoadingController,
                private learnSer: LearnService, private commonSer: CommonService, private storage: Storage,
                private appSer: AppService, public statusBar: StatusBar,
                private mineSer: MineService, private tabSer: TabService, private inAppBrowser: InAppBrowser,
                private renderer: Renderer2) {
        this.statusBar.backgroundColorByHexString('#343435');
        const hash = md5('value');
        this.storage.get('user').then(value => {
            this.mineInfo = value;
            if(this.mineInfo.UserName.length > 3){
                this.mineInfo.UserName = this.mineInfo.UserName.slice(0, 3) + '...';
            }
        });
    }

    ionViewDidLoad() {
        this.getBanner();
        this.getGoodsTeacher();
        this.getProductList();
    }

    ionViewWillEnter() {
        this.appSer.wowInfo.subscribe(
            (value) => {
                this.wow = value;
                console.log(this.wow);
            }
        )
        this.info.new = 0;
        this.getNew();
    }

    ionViewDidLeave() {
        this.appSer.setWow(false);
        console.log(this.wow);
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
        this.slides.stopAutoplay();
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
    getBanner() {
        this.homeSer.getBannerList().subscribe(
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
    async getProductList() {
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
            "IsAsc": "false",
            "IsHot": "true"
        };
        await this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = res.data.ProductList;
                console.log(this.productList);
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
            page: 1,
            pageSize: 1000
        };
        this.mineSer.GetUserNewsList(data).subscribe(
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
    goTest(){
        this.navCtrl.push(TestCenterPage);
    }

    //前往课程
    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    //前往课程
    goCourseBanner(e) {
        if (e.URLType == 0) {
            return;
        }
        if (e.URLType == 1) {

        }
        if (e.URLType == 2) {
            if (e.HttpURL.includes(this.httpUrl)) {
                const arr = e.HttpURL.split('/');
                this.navCtrl.push(CourseDetailPage, {id: arr[arr.length - 1]});
            } else {
                this.inAppBrowser.create(e.HttpURL, '_system');
            }
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

    //前往直播
    goLive(){
        this.navCtrl.push(LivePage);
    }
}
