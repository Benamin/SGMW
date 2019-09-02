import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {CourseDetailPage} from "./course-detail/course-detail";
import {LearnService} from "./learn.service";
import {pageSize} from "../../app/app.constants";
import {HomeService} from "../home/home.service";


@IonicPage()
@Component({
    selector: 'page-learning',
    templateUrl: 'learning.html',
})
export class LearningPage {

    code = "Subject";
    tabsList = [];
    productList = [];
    headList = [];
    headType;
    isShow = false;
    page = {
        SubjectID: '',
        page: '1',
        pageSize: "2000"
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private learnSer: LearnService, private homeSer: HomeService) {
    }

    ionViewDidEnter() {
        const data = this.navParams.get('item');
        if (data) {   //其他路径转入
            console.log('item');
            this.page.SubjectID = data.ID;
            this.headType = this.navParams.get("headType");
            this.getOneType(this.headType);
        } else {  //tab栏进入
            console.log('tabs');
            this.getOneType(0);
        }
    }

    getOneType(index) {
        console.log('one')
        this.homeSer.GetDictionaryByPCode("Subject").subscribe(
            (res) => {
                this.headList = res.data.map(e => {
                    return {type: e.TypeCode, name: e.TypeName}
                })
                this.getSecondType(this.headList[0], index);
            }
        )
    }

    //二级菜单
    getSecondType(title, index) {
        this.isShow = false;
        this.headType = index;
        console.log(this.headType);
        this.code = title.type;
        this.homeSer.GetDictionaryByPCode(this.code).subscribe(
            (res) => {
                if (res.data.length > 0) {
                    this.tabsList = res.data.map(e => {
                        return {type: e.TypeCode, name: e.TypeName, ID: e.ID}
                    });
                    this.page.SubjectID = this.tabsList[0].ID;
                    this.getProduct();
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
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        loading.present();
        const data = {
            SubjectID: this.page.SubjectID,
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = res.data.ProductList;
                loading.dismiss();
            }
        )
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    doInfinite(e) {
        e.complete();
    }

    doRefresh(e) {
        e.complete();
    }

}
