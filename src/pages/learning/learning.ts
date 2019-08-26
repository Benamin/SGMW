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

    tabsList = [];
    productList = [];
    headList = [];
    headType = 1;

    page = {
        page: '1',
        pageSize: "200"
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private learnSer: LearnService, private homeSer: HomeService) {
    }

    ionViewDidLoad() {
        this.getProduct();
        this.getSubjectList();
        this.tabsList = [
            {name: "不限", type: '0'},
            {name: "新宝骏", type: '1'},
            {name: "经典宝骏", type: '2'},
            {name: "五菱", type: '3'},
            {name: "新能源", type: '4'},
            {name: "专家团队", type: '5'},
            {name: "用户体验", type: '6'},
        ];
        this.headList = [
            {type: 1, name: '产品体验'},
            {type: 2, name: '销售运营'},
            {type: 3, name: '能力提升'},
            {type: 4, name: '服务运营'},
        ]
    }

    getSubjectList() {
        this.homeSer.GetDictionaryByPCode('Subject').subscribe(
            (res) => {

            }
        )

        this.homeSer.GetDictionaryByPCodeByNative('Subject').then(
            (res) => {

            }
        )
    }

    getProduct() {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        loading.present();
        const data = {
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
        console.log(e);
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
