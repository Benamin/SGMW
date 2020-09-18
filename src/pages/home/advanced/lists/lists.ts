import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';

import {HomeService} from "../../home.service";

@Component({
    selector: 'page-lists',
    templateUrl: 'lists.html',
})
export class AdvancedListsPage {
    page = {
        defaultImg: 'assets/imgs/default.jpg',
        plid: null,
        advancedArr: [
            {
                title: "课程",
                en: 'course',
                isOpen: false,
                listType: {
                    navliArr: [{
                        lable: 'all',
                        text: '全部',
                        total: 0,
                        isActived: true
                    },{
                        lable: 'doing',
                        text: '进行中',
                        total: 0,
                        isActived: false
                    },{
                        lable: 'finish',
                        text: '已完成',
                        total: 0,
                        isActived: false
                    },{
                        lable: 'not-started',
                        text: '未开始',
                        total: 0,
                        isActived: false
                    }],
                    // checkType: 'all'
                },
                lists: []
            },
            {
                title: "考试",
                en: 'exam',
                isOpen: false,
                listType: null,
                lists: []
            },
            {
                title: "其他",
                en: 'other',
                isOpen: false,
                listType: null,
                lists: []
            },
        ],
        getListsApi: null, // 请求接口服务
        Param: null,
        getParams: null,
        hasArea: false
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private loadCtrl: LoadingController,
        private homeSer: HomeService
    ) {
    }

    ionViewDidEnter() {
        
        this.page.plid = this.navParams.get('plid');
        console.log('JS:OK', this.page.plid);
        this.getAdvancedLists();
        // this.getAdvancedLists();
    }

    // 二级导航切换 （注：考试不会有）
    changeSecNav(classNavIndex, bool) {
        if (bool) return;
        console.log('bool', bool)
        let navliArr = Object.assign([], this.page.advancedArr[0].listType.navliArr);
        for (var i=0;i<navliArr.length; i++) {
            navliArr[i].isActived = false;
        }
        navliArr[classNavIndex].isActived = true;
        this.page.advancedArr[0].listType.navliArr = navliArr;
        // var otherIndex = 1
        // if (secNavIndex === 1) otherIndex = 0;
        // this.page.competitionLists = [];
        // this.page.navliArr[typeIndex].secNav[otherIndex].isActived = false;
        // this.page.navliArr[typeIndex].secNav[secNavIndex].isActived = true;
        // this.getList();
    }

    // 折叠
    changeFold(advancedIndex) {
        this.page.advancedArr[advancedIndex].isOpen = !this.page.advancedArr[advancedIndex].isOpen;
    }

    // 用户等级信息 获取学习情况
    getAdvancedLists() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.getAdvancedLists({
            plid: 6,
            csStatus: 2
        }).subscribe(
            (res) => {
                console.log('获取学习情况', res)
                if (res.code === 200) {
                    this.page.advancedArr[0].lists = res.data.product; // 课程
                    this.page.advancedArr[1].lists = res.data.stuexam; // 考试
                    // this.page.advancedArr[2].lists = res.data.product; // 其他
                }
                
                // this.page.myInfo = res.data;
                loading.dismiss();
            }, err => {
                loading.dismiss();
            }
        )
    }


}
