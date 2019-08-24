import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomeService} from "./home.service";
import {LearnService} from "../learning/learn.service";
import {CommonService} from "../../core/common.service";

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

    constructor(public navCtrl: NavController, public homeSer: HomeService,
                private learnSer:LearnService,private commonSer:CommonService) {


    }

    ionViewDidLoad() {
        this.getBanner();
        this.getGoodsTeacher();
        this.getProductList();
    }

    selectType(type) {
        this.type = type;
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
            }
        )
    }

    //优秀教师
    getGoodsTeacher() {
        this.homeSer.GetGoodTeacherList().subscribe(
            (res) => {
                this.teacherList = res.data.TeacherItems;
            }
        )
    }

    //获取产品分类 nlts
    getProductList() {
        this.homeSer.GetDictionaryByPCode('nlts').subscribe(
            (res) => {
                this.saleList = res.data;
            }
        )

        this.homeSer.GetDictionaryByPCode('cpty').subscribe(
            (res) => {
                this.productList = res.data;
            }
        )
    }

    async focusHandle(){
        const data = {
            TopicID:this.teacherList[this.personrType].UserId
        };
        await this.learnSer.SaveSubscribe(data).subscribe(
            (res)=>{
                this.commonSer.toast('关注成功');
            }
        )
        await this.getGoodsTeacher();
    }

    async cancleFocusHandle(){
        const data = {
            TopicID:this.teacherList[this.personrType].UserId
        };
        this.learnSer.SaveSubscribe(data).subscribe(
            (res)=>{
                this.commonSer.toast('取消关注成功');
            }
        )
        await this.getGoodsTeacher();
    }

}
