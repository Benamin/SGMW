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
        page: '1',
        pageSize: "2000"
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
                this.getOneType(0);
            }
        }))
    }

    doRefresh(e){
        this.getProduct();
        timer(1000).subscribe((res)=>{e.complete()});
    }

    ionViewWillLeave() {
        this.productList = [];
        this.storage.set('course', null);
    }

    getOneType(index) {
        this.homeSer.GetDictionaryByPCode("Subject").subscribe(
            (res) => {
                this.headList = res.data.map(e => {
                    return {type: e.TypeCode, name: e.TypeName}
                })
                this.getSecondType(this.headList[index], index);
            }
        )
    }

    //二级菜单
    getSecondType(title, index) {
        this.loading = this.loadCtrl.create({
            content: '加载中...'
        });
        this.loading.present();
        this.scrollTabs.isShow = false;
        this.headType = index;
        this.code = title.type;
        this.homeSer.GetDictionaryByPCode(this.code).subscribe(
            (res) => {
                this.tabsList = res.data.map(e => {
                    return {type: e.TypeCode, name: e.TypeName, ID: e.ID}
                });
                if (res.data.length > 0) {
                    this.page.SubjectID = this.tabsList[0].ID;
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
        this.page.SubjectID = e.ID;
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
                this.loading.dismiss();
            }
        )
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    doInfinite(e) {
        e.complete();
    }

}
