import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {CourseDetailPage} from "./course-detail/course-detail";
import {LearnService} from "./learn.service";
import {pageSize} from "../../app/app.constants";
import {HomeService} from "../home/home.service";
import {Storage} from "@ionic/storage";
import {ScrollTabsComponent} from "../../components/scroll-tabs/scroll-tabs";
import {timer} from "rxjs/observable/timer";


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
    };
    loading;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private learnSer: LearnService, private homeSer: HomeService, private storage: Storage) {
    }

    ionViewDidEnter() {
        this.storage.get('course').then((value => {
            if (value) {   //其他路径转入
                this.page.SubjectID = value.item.ID;
                this.headType = value.headType;
                this.getOneType(this.headType);
            } else {  //tab栏进入
                this.headType = 'all';
                this.getOneType(0);
            }
        }))
    }

    doRefresh(e) {
        this.page.page = 1;
        this.getProduct();
        timer(1000).subscribe((res) => {
            e.complete();
        });
    }

    ionViewWillLeave() {
        this.productList = [];
        this.storage.set('course', null);
    }

    getOneType(index) {
        const data = {
            code:"Subject"
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
        console.log(this.scrollTabs.select.index)
        this.page.page = 1;
        this.headType = index;
        this.loading = this.loadCtrl.create({
            content: '加载中...'
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
                console.log(this.tabsList);
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
        const data = {
            SubjectID: this.page.SubjectID,
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                this.loading.dismiss();
            }
        )
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
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
            pageSize: this.page.pageSize
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = this.productList.concat(res.data.ProductList);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )

    }

}
