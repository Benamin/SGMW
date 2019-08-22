import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TeacherPage} from "../teacher/teacher";
import {CourseCommentPage} from "../course-comment/course-comment";
import {timer} from "rxjs/observable/timer";
import {LearnService} from "../learn.service";
import {AppService} from "../../../app/app.service";


@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html',
})
export class CourseDetailPage {

    pId;
    product = {
        detail: <any>null,
        chapter: null,
        videoPath:null
    };
    learnList = [];
    navbarList = [
        {type: '1', name: '简介'},
        {type: '2', name: '章节'},
        {type: '3', name: '教师'},
        {type: '4', name: '评价'},
        {type: '5', name: '相关'},
    ];

    signObj = {
        isSign: false,
    };

    collectionObj = {
        isCollection: false
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController,public appSer:AppService) {
        this.pId = this.navParams.get('id');
        this.appSer.fileInfo.subscribe(
            (res)=>{
                console.log(res);
            }
        )
    }

    async ionViewDidLoad() {
        const data = {
            pid: this.pId
        };
        await this.learSer.GetProductById(this.pId).subscribe(
            (res) => {
                this.product.detail = res.data;
            }
        );
        await this.getProductInfo();
    }

    //课程详情、课程章节、相关课程、课程评价
    async getProductInfo() {
        let loading = this.loadCtrl.create({
            content: '课程正在打开...'
        });
        loading.present();
        const data = {
            pid: this.pId
        };
        await this.learSer.GetAdminChapterListByProductID(this.pId).subscribe(
            (res) => {
                this.product.chapter = res.data;
            }
        )
        await this.learSer.GetRelationProductList(data).subscribe(
            (res) => {
                this.learnList = res.data.ProductList;
            }
        )
        const data1 = {
            // topicID: this.product.detail.PrId
        };
        // await this.learSer.GetCommentSum(data1).subscribe(
        //     (res) => {
        //
        //     }
        // )
        await loading.dismiss();
    }

    teachDetail() {
        this.navCtrl.push(TeacherPage, {item: this.product.detail.Teachers[0]});
    }

    goTeacher(title) {
        this.navCtrl.push(CourseCommentPage, {title: title});
    }

    goCourse(e) {
        console.log(e);
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    //报名
    sign() {
        const data = {
            pid: this.pId
        };
        this.learSer.BuyProduct(data).subscribe(
            (res) => {
                this.signObj.isSign = true;
                timer(1000).subscribe(() => this.signObj.isSign = false);
            }
        )
    }

    //收藏
    collection() {
        const data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.SaveCollectionByCSID(data).subscribe(
            (res) => {
                this.ionViewDidLoad();
                this.collectionObj.isCollection = true;
                timer(1000).subscribe(() => this.collectionObj.isCollection = false);
            }
        )
    }

    //取消收藏
    cancleCollection() {
        const data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.CancelCollectionByCSID(data).subscribe(
            (res) => {
                this.ionViewDidLoad();
            }
        )
    }

    getInfo(e){
        console.log(e);
    }
}
