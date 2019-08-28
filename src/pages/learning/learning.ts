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

    page = {
        SubjectID: '',
        page: '1',
        pageSize: "2000"
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private learnSer: LearnService, private homeSer: HomeService) {
    }

    ionViewDidLoad() {
        const item = this.navParams.get('item');
        if(item){
            this.page.SubjectID = item.ID;
            this.headType = this.navParams.get('headType');
            this.getProduct();
        }else{
            this.getSubjectList();
        }
    }

    getSubjectList() {
        this.homeSer.GetDictionaryByPCode("Subject").subscribe(
            (res) => {
                this.headList = res.data.map(e => {
                    return {type: e.TypeCode, name: e.TypeName}
                })
                this.selectType(this.headList[1], 1);
            }
        )

        // this.homeSer.GetDictionaryByPCodeByNative('Subject').then(
        //         //     (res) => {
        //         //
        //         //     }
        //         // )
    }

    selectType(title, index) {
        this.headType = index;
        this.code = title.type;
        this.homeSer.GetDictionaryByPCode(this.code).subscribe(
            (res) => {
                this.tabsList = res.data.map(e => {
                    return {type: e.TypeCode, name: e.TypeName, ID: e.ID}
                });
                this.page.SubjectID = this.tabsList[0].ID;
                this.getProduct();
            }
        )
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

        // this.learnSer.GetProductListByNative(data).then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.productList = res1.data.ProductList;
        //         loading.dismiss();
        //     }
        // )
    }

    getTabs(e) {
        this.page.SubjectID = e.ID;
        this.getProduct();
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
