import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {CourseDetailPage} from "./course-detail/course-detail";
import {LearnService} from "./learn.service";
import {pageSize} from "../../app/app.constants";
import {HomeService} from "../home/home.service";
import {Storage} from "@ionic/storage";
import {ScrollTabsComponent} from "../../components/scroll-tabs/scroll-tabs";
import {timer} from "rxjs/observable/timer";
import {LogService} from "../../service/log.service";
import {FocusCoursePage} from "./focus-course/focus-course";
import {InnerCoursePage} from "./inner-course/inner-course";


@IonicPage()
@Component({
    selector: 'page-learning',
    templateUrl: 'learning.html',
})
export class LearningPage {
    @ViewChild('scrollTabs') scrollTabs: ScrollTabsComponent;

    code = "Subject";
    tabsList = [];
    productList = [];
    headList = [];
    headType;
    page = {
        SubjectID: '',
        page: 1,
        pageSize: "10",
        TotalCount: 0,
        isLoading: false,
    };
    loading;
    title;
    keyWord;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private logSer: LogService,
                private learnSer: LearnService, private homeSer: HomeService, private storage: Storage) {
        this.page.SubjectID = this.navParams.get('SubjectID');
        this.keyWord = this.navParams.get('keyWord');
        if (this.keyWord) {
            this.title = '课程';
        } else {
            this.title = this.navParams.get('title');
            this.keyWord = '';
        }
    }

    ionViewDidLoad() {
        this.logSer.visitLog('zxkc');
        this.getProduct();
    }

    doRefresh(e) {
        this.page.page = 1;
        this.getProduct();
        timer(1000).subscribe((res) => {
            e.complete();
        });
    }

    ionViewWillLeave() {
        // this.productList = [];
        this.storage.set('course', null);
    }

    getOneType(index) {
        const data = {
            code: "Subject"
        }
        this.learnSer.GetDictionaryByPCode(data).subscribe(
            (res) => {
                this.headList = res.data.map(e => {
                    return {type: e.TypeCode, name: e.label, ID: e.value}
                });
                this.headList.unshift({type: 'allOne', name: '全部', ID: 'all'});
                this.getSecondType(this.headList[index], index);
            }
        )
    }

    //二级菜单
    getSecondType(title, index) {
        this.scrollTabs.select.index = 0;
        this.page.page = 1;
        this.headType = index;
        this.loading = this.loadCtrl.create({
            content: ''
        });
        this.loading.present();
        this.scrollTabs.isShow = false;
        this.code = title.type;
        this.homeSer.GetDictionaryByPCode(this.code).subscribe(
            (res) => {
                this.tabsList = res.data.map(e => {
                    return {type: e.TypeCode, name: e.TypeName, ID: e.ID}
                });
                this.tabsList.unshift({type: 'allTwo', name: '全部'});
                if (res.data.length > 0) {
                    this.page.SubjectID = title.ID;
                    this.getProduct();
                } else if (this.code == 'allOne') {
                    this.page.SubjectID = null;
                    this.getProduct();
                } else {
                    this.productList = [];
                    this.loading.dismiss();
                }
            }
        )
    }

    //根据三级菜单获取产品
    setSubjectID(e) {
        if (e) this.page.SubjectID = e.ID;
        if (!e) this.page.SubjectID = null;
        this.getProduct();
    }

    getProduct() {
        this.loading = this.loadCtrl.create();
        this.loading.present();
        const data = {
            title: this.keyWord,
            SubjectID: this.page.SubjectID,
            page: this.page.page,
            pageSize: this.page.pageSize,
            "OrderBy": "CreateTime",
            "SortDir": "DESC",
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.page.isLoading = true;
                this.productList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                this.loading.dismiss();
            }
        )
    }

    goCourse(e) {
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
        }
    }

    doInfinite(e) {
        if (this.productList.length == this.page.TotalCount || this.productList.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            SubjectID: this.page.SubjectID,
            page: this.page.page,
            pageSize: this.page.pageSize,
            "OrderBy": "CreateTime",
            "SortDir": "DESC",
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = this.productList.concat(res.data.ProductList);
                this.page.TotalCount = res.data.TotalCount;
                this.page.isLoading = true;
                e.complete();
            }
        )
    }

}
