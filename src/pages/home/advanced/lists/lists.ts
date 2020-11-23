import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';

import {HomeService} from "../../home.service";
// import {LookTestPage} from "../../test/look-test/look-test";
import {CommonService} from "../../../../core/common.service";
import {DoTestPage} from "../../test/do-test/do-test";
// import {LearnService} from "../../../learning/learn.service";
import {FocusCoursePage} from "../../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../../learning/inner-course/inner-course";
import {CourseDetailPage} from "../../../learning/course-detail/course-detail";

@Component({
    selector: 'page-lists',
    templateUrl: 'lists.html',
})
export class AdvancedListsPage {
    page = {
        Level: '',
        defaultImg: 'assets/imgs/default.jpg',
        canClick: false,
        plid: null,
        advancedArr: [
            {
                title: "课程",
                en: 'course',
                isOpen: false,
                listType: {
                    navliArr: [{
                        lable: 'all',
                        text: '全部', // 2 0 1 -1
                        total: 0,
                        isActived: true
                    }, {
                        lable: 'doing',
                        text: '进行中',
                        total: 0,
                        isActived: false
                    }, {
                        lable: 'finish',
                        text: '已完成',
                        total: 0,
                        isActived: false
                    }, {
                        lable: 'not-started',
                        text: '未开始',
                        total: 0,
                        isActived: false
                    }],
                    // checkType: 'all'
                },
                lists: []
            },
            // {
            //     title: "考试",
            //     en: 'exam',
            //     isOpen: false,
            //     listType: null,
            //     lists: []
            // },
            // {
            //     title: "KPI",
            //     en: 'kpi',
            //     isOpen: false,
            //     listType: null,
            //     lists: []
            // },
            // {
            //     title: "评分结果",
            //     en: 'points',
            //     isOpen: false,
            //     listType: null,
            //     lists: []
            // },
        ],
        getListsApi: null, // 请求接口服务
        Param: null,
        getParams: null,
        hasArea: false,
        isLoaded: false
    }

    constructor(
        private commonSer: CommonService,
        // private learSer: LearnService,
        public navCtrl: NavController,
        public navParams: NavParams,
        private loadCtrl: LoadingController,
        private homeSer: HomeService
    ) {
    }

    ionViewDidEnter() {
        this.page.Level = this.navParams.get('Level');
        this.page.canClick = this.navParams.get('canClick');
        this.page.plid = this.navParams.get('plid');
        // console.log('JS:OK', this.page.plid);
        this.getAdvancedLists(2);
        // this.getAdvancedLists();
    }

    // 二级导航切换 （注：考试不会有）
    changeSecNav(classNavIndex, bool) {
        if (bool) return;
        // console.log('bool', bool)
        let navliArr = Object.assign([], this.page.advancedArr[0].listType.navliArr);
        for (var i = 0; i < navliArr.length; i++) {
            navliArr[i].isActived = false;
        }
        navliArr[classNavIndex].isActived = true;
        this.page.advancedArr[0].listType.navliArr = navliArr;

        switch (classNavIndex) {
            case 0:
                this.getAdvancedLists(2);
                break
            case 1:
                this.getAdvancedLists(0);
                break
            case 2:
                this.getAdvancedLists(1);
                break
            case 3:
                this.getAdvancedLists(-1);
                break
        }
    }

    // 折叠
    changeFold(advancedIndex) {
        this.page.advancedArr[advancedIndex].isOpen = !this.page.advancedArr[advancedIndex].isOpen;
    }

    // 用户等级信息 获取学习情况
    getAdvancedLists(learningState) {

        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        // learningState 课程状态 -1 未开始 0进行中 1已完成 2 所有
        let paramsObj = {
            plid: this.page.plid,
            csStatus: learningState,
            Conditions: 'All'
        }
        // let paramsObj = { // 测试使用
        //     plid: 6,
        //     csStatus: 2
        // }
        this.page.isLoaded = false;
        this.homeSer.QueryCourse(paramsObj).subscribe(
            (res) => {
                // console.log('获取学习情况', res)
                if (res.code === 200) {
                    this.page.advancedArr[0].lists = res.data; // 课程
                    // this.page.advancedArr[1].lists = res.data.stuexam; // 考试
                    // this.page.advancedArr[2].lists = res.data.UserKpis; // KPI
                    // this.page.advancedArr[3].lists = res.data.Speaking; // 评分结果
                }

                // this.page.myInfo = res.data;
                this.page.isLoaded = true;
                loading.dismiss();
            }, err => {
                loading.dismiss();
            }
        )
    }

    //获取课程详情
    goCourse(e) {
        if (!this.page.canClick) {
            this.commonSer.alert('请先完成当前级别学习!');
            return
        }
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
        }
    }

    // 点击考试列表
    goExam(item) {
        if (!this.page.canClick) {
            this.commonSer.alert('请先完成当前级别学习!');
            return
        }
        if (item.ID) item.Fid = item.ID;
        let canTest = this.page.advancedArr[0].lists.every(e => e.studystate === 2)

        if (!canTest) {
            this.commonSer.alert('请先完成课程内容!');
            return;
        }

        //1、所有课程完成 即可考试 不考虑 考试的开始时间和结束时间
        //2、未通过可以继续考试
        if (item.TotalScore < item.PassScore) {
            this.navCtrl.push(DoTestPage, {item: item, sourceType: 'advance'});
        } else {
            this.commonSer.alert('恭喜您！考试已通过！');
        }
    }

    //考试有效期校验
    checkTesttime(item) {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const ExamBegin = this.commonSer.transFormTime(item.ExamBegin);
        const ExamEnd = this.commonSer.transFormTime(item.ExamEnd);
        this.homeSer.getSysDateTime().subscribe(
            (res) => {
                loading.dismiss();
                const sysDate = this.commonSer.transFormTime(res.data);
                if (sysDate < ExamBegin) {
                    this.commonSer.toast('考试未开始');
                } else if (sysDate > ExamEnd && item.StudyState == 1) {
                    this.commonSer.toast('当前时间不可考试');
                } else if (ExamBegin < sysDate && sysDate < ExamEnd) {
                    this.navCtrl.push(DoTestPage, {item: item});  //未开始
                } else if (item.StudyState == 2) { // 未完成
                    this.navCtrl.push(DoTestPage, {item: item});
                }
            }
        )
    }


}
