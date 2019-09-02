import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
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
import {defaultImg} from "../../app/app.constants";
import {MineService} from "../mine/mine.service";
import {TabService} from "../../core/tab.service";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild('angular') angular: ElementRef;
    @ViewChild('imgWidth') imgWidth: ElementRef;

    type = 'teacher';
    personrType = 0;
    saleList = [];  //销售运营
    productList = new Array(5);  //产品体验
    teacherList = [];
    bannerList = [];
    mineInfo;
    defaultImg = defaultImg;

    info = {
        new: 0,
    }

    constructor(public navCtrl: NavController, public homeSer: HomeService, private loadCtrl: LoadingController,
                private learnSer: LearnService, private commonSer: CommonService, private storage: Storage,
                private mineSer: MineService, private tabSer: TabService) {

        this.storage.get('user').then(value => {
            this.mineInfo = value;
        })
    }

    ionViewDidLoad() {
        this.getBanner();
        this.getGoodsTeacher();
        this.getProductList();
    }

    ionViewDidEnter() {
        this.info.new = 0;
        this.getNew();

    }

    selectType(type) {
        this.type = type;
    }

    saleToLearn(item, index) {
        const data = {
            item: item, headType: index
        }
        this.navCtrl.parent.select(1);
        this.storage.set('course',data);
        // this.tabSer.changeTabInContainerPage({index:1,item: item, headType: index});
        // timer(500).subscribe(() => {
        //     this.navCtrl.setRoot(LearningPage, {item: item, headType: index});
        // })
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

    //前往课程
    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    //前往课程
    goCourseBanner(e) {
        const arr = e.HttpURL.split('/');
        console.log(arr);
        this.navCtrl.push(CourseDetailPage, {id: arr[arr.length - 1]});
    }

}
