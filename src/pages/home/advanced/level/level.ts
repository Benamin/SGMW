import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';//引入
import {NavController, NavParams, LoadingController, ActionSheetController, ModalController} from 'ionic-angular';
import {CommonService} from "../../../../core/common.service";
import {HomeService} from "../../home.service";
import {AdvancedListsPage} from "../lists/lists";
import {RuleModalPage} from "../rule-modal/rule-modal";
import {FocusCoursePage} from "../../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../../learning/inner-course/inner-course";
import {CourseDetailPage} from "../../../learning/course-detail/course-detail";
import {DoTestPage} from "../../test/do-test/do-test";

import {Storage} from "@ionic/storage";

@Component({
    selector: 'page-level',
    templateUrl: 'level.html',
})
export class AdvancedLevelPage {
    page = {
        defaultImg: 'assets/imgs/default.png',
        checkType: 'exam',
        navliArr: [
            {
                navBtnText: '学习',
                navBtnEn: 'course',
                isActived: true,
                lists: []
            },
            {
                navBtnText: '认证',
                navBtnEn: 'exam',
                isActived: false,
                lists: []
            }
            // ,
            // {
            //     navBtnText: 'KPI',
            //     navBtnEn: 'kpi',
            //     isActived: false,
            //     lists: []
            // },
            // {
            //     navBtnText: '线下认证',
            //     navBtnEn: 'points',
            //     isActived: false,
            //     lists: []
            // }
        ],
        // courseTypeArr: [
        //     {
        //         navBtnText: '待开始',
        //         navBtnEn: 'wait',
        //         isActived: true
        //     },
        //     {
        //         navBtnText: '进行中',
        //         navBtnEn: 'doing',
        //         isActived: false
        //     },
        //     {
        //         navBtnText: '已完成',
        //         navBtnEn: 'finish',
        //         isActived: false
        //     },
        //     {
        //         navBtnText: '更多',
        //         navBtnEn: 'more',
        //         isActived: false
        //     }
        // ],
        nowClick: 'course',
        nowClickSec: 'more',
        mineInfo: null,
        Lists: [],
        getListsApi: null, // 请求接口服务
        Param: null,
        getParams: null,
        hasArea: false,
        levelInformation: [],
        nowLevelText: '',
        nowLevel: null,
        nowProgress: 0,
        isNowLevel: null, // sales destructive clerk
        roleList: [],
        leveltype: null,
        levelTypeText: null,
        plid: null,
        isLoaded: false,
        canClick: false,
        nowLevelIndex: null,
        firstTime: true,
        TotalCount: 0,
        Page: 1,
        PageSize: 10
    }

    constructor(
        public navCtrl: NavController,
        private commonSer: CommonService,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        private loadCtrl: LoadingController,
        private homeSer: HomeService,
        private modalCtrl: ModalController,
        private storage: Storage,
        public sanitizer: DomSanitizer
    ) {
        //获取个人信息
        this.storage.get('user').then(value => {
            this.page.mineInfo = value;

        });
    }

    ionViewDidEnter() {
        this.page.roleList = this.navParams.get('roleList');
        if (!this.page.leveltype) this.page.leveltype = this.navParams.get('leveltype').value;
        if (!this.page.levelTypeText) this.page.levelTypeText = this.navParams.get('leveltype').label;
        let noLoading = true
        this.getAdvancedLevel(noLoading);
    }

    getModalData() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        let nowPlId = null;
        if (this.page.plid === 'theLast') {
            nowPlId = this.page.levelInformation[this.page.levelInformation.length - 1].ID;
        } else {
            let levelInformation = this.page.levelInformation;
            for (let i = 0; i < levelInformation.length; i++) {
                if (levelInformation[i].actived === true) {
                    nowPlId = this.page.levelInformation[i].ID;
                }
            }
        }
        this.homeSer.LevelRemake({PlId: nowPlId}).subscribe(
            (res) => {
                if (res.code === 200) {

                    console.log('888', res.data.Remake)
                    this.showRuleModal(res.data.Remake);

                } else {
                    this.commonSer.toast(res.message);
                }

                loading.dismiss();
            }, err => {
                loading.dismiss();
            }
        )
    }

    showRuleModal(Remake) {
        let typeTitle = '';
        let levelInformation = this.page.levelInformation;
        for (let i = 0; i < levelInformation.length; i++) {
            if (levelInformation[i].actived === true) {
                typeTitle = levelInformation[i].Level;
            }
        }
        let modalData = {
            leveltype: typeTitle,
            title: '',
            content: Remake
        }
        let modal = this.modalCtrl.create(RuleModalPage, {ruleData: modalData});
        modal.onDidDismiss((data) => {
            if (data) {
                console.log('关闭modal：', data)
            }
        })
        modal.present();
    }

    // 前往 认证进阶 的 勋章设置
    switchLevel(levelTypeIndex, bigThanMyLevel) {
        if (bigThanMyLevel) return; // 大于当前等级不能点击
        this.page.nowLevelIndex = levelTypeIndex;
        let levelInformation = this.page.levelInformation;
        let item = levelInformation[levelTypeIndex];

        for (let i = 0; i < levelInformation.length; i++) {
            if (item.Hierarchy === levelInformation[i].Hierarchy) {
                levelInformation[i].actived = true;
            } else {
                if (levelInformation[i]) levelInformation[i].actived = false;
            }
        }

        if (levelTypeIndex === levelInformation.length - 1) {
            this.initLists();
            this.page.isLoaded = true;
            this.page.plid = 'theLast';
            return
        }

        this.page.canClick = this.page.nowLevel >= (item.Hierarchy - 1);
        // console.log(99999, this.page.canClick);
        // id取下一个的ID
        this.page.plid = this.page.levelInformation[levelTypeIndex + 1].ID;
        // this.page.nowLevel = item.Hierarchy - 1;
        this.page.isLoaded = false;
        this.initLists();
        this.setParams();
        // this.navCtrl.push(AdvancedListsPage, { plid: item.ID, canClick: canClick, Level: item.Level });
    }

    // 一级导航（当前列表类型）切换
    changeNav(navIndex, bool) {
        this.page.isLoaded = false;
        this.initLists();
        console.log('changeNav', navIndex, bool)
        if (bool && this.page.nowClick === this.page.navliArr[navIndex].navBtnEn) return;
        for (var i = 0; i < this.page.navliArr.length; i++) {
            this.page.navliArr[i].isActived = false;
        }
        this.page.navliArr[navIndex].isActived = true;
        this.page.nowClick = this.page.navliArr[navIndex].navBtnEn
        console.log('nowClick777', this.page.nowClick)
        console.log('8888----nowLevelIndex', this.page.nowLevelIndex, 9999, this.page.levelInformation)
        // 若是最後一個
        if (this.page.nowLevelIndex === null) {
            if (this.page.levelInformation.length > 0 && this.page.nowLevel + 1 === this.page.levelInformation[this.page.levelInformation.length - 1].Hierarchy) {
                this.initLists();
                this.page.isLoaded = true;
                return

            }
        } else if (this.page.nowLevelIndex !== null) {
            if (this.page.levelInformation.length > 0 && this.page.levelInformation[this.page.nowLevelIndex].Hierarchy === this.page.levelInformation[this.page.levelInformation.length - 1].Hierarchy) {
                this.initLists();
                this.page.isLoaded = true;
                return
            }
        }
        console.log('changeNav-888')
        this.setParams();
    }

    // 用户等级信息
    getAdvancedLevel(noLoading = null) {
        // console.log('leveltype99:', this.page.leveltype)
        let loading = this.loadCtrl.create({
            content: ''
        });
        if (!noLoading) loading.present();
        console.log('888*****leveltype', this.page.leveltype)
        this.homeSer.getAdvancedLevel({leveltype: this.page.leveltype}).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code === 200) {
                    this.page.nowLevelText = res.data.Level;
                    let levelInformation = res.data.levelInformation;

                    this.page.nowProgress = res.data.schedule;
                    let nowLevel
                    if (res.data.Hierarchy === 0) {
                        nowLevel = 0;
                        for (let i = 0; i < res.data.levelInformation.length; i++) {
                            res.data.levelInformation[i].Hierarchy = res.data.levelInformation[i].Hierarchy + 1;
                        }
                    } else {
                        nowLevel = res.data.Hierarchy - 1;
                    }
                    this.page.nowLevel = nowLevel;

                    // 测试
                    // this.page.nowProgress = 0.8;
                    // let nowLevel = 2
                    // this.page.nowLevel = nowLevel;


                    if (!this.page.firstTime) {
                        let oldlevelInformation = this.page.levelInformation
                        oldlevelInformation = this.tranLevelText(oldlevelInformation);
                        let item = null;
                        for (let i = 0; i < oldlevelInformation.length; i++) {
                            if (oldlevelInformation[i].actived === true) {
                                item = oldlevelInformation[i];
                            }
                        }
                        this.page.canClick = this.page.nowLevel >= (item.Hierarchy - 1);
                        this.initLists();
                        this.setParams(noLoading);
                        return
                    }
                    this.page.firstTime = false;

                    for (let i = 0; i < levelInformation.length; i++) {
                        if (nowLevel === levelInformation[i].Hierarchy - 1) {
                            levelInformation[i].actived = true;
                        } else {
                            if (levelInformation[i]) levelInformation[i].actived = false;
                        }
                    }
                    levelInformation = this.tranLevelText(levelInformation);
                    this.page.levelInformation = levelInformation;


                    // console.log('nowProgress', nowProgress)
                    if (levelInformation.length > 0) {
                        this.initLists();
                        // for (var i=0; i<levelInformation.length; i++) {
                        if (res.data.Hierarchy === levelInformation[0].Hierarchy) {
                            this.page.plid = levelInformation[1].ID;
                            // let item = this.page.levelInformation[1];
                            this.setParams(noLoading);
                            this.page.canClick = true;
                        } else {

                            let isFullLevel = false;
                            let Hindex = null
                            for (var i = 0; i < levelInformation.length; i++) {
                                if (res.data.Hierarchy === levelInformation[i].Hierarchy) Hindex = i;
                                // 当前已经满等级
                                if (res.data.Hierarchy === levelInformation[levelInformation.length - 1].Hierarchy) isFullLevel = true;
                            }
                            if (isFullLevel === true) {
                                this.page.isLoaded = true;
                            } else {
                                this.page.plid = levelInformation[Hindex + 1].ID;
                                this.setParams();
                                this.page.canClick = true;
                            }
                        }
                    }


                } else {
                    this.commonSer.toast(res.message);
                }
            }, err => {
                loading.dismiss();
            }
        )
    }

    assembleHTML(strHTML: any) {
        return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    }

    tranLevelText(levelInformation) {
        // 等级 字数 超出四个 换行 (旧 换行)
        // for (let i = 0; i < levelInformation.length; i++) {
        //     // levelInformation[i].Level = '啦啦店'; // 测试
        //     // console.log(66666, levelInformation[i].Level.substring(2))
        //     if (levelInformation[i].Level.length >= 4) {
        //         let nowLevelTranLength = Math.ceil(levelInformation[i].Level.length / 2);
        //         levelInformation[i].LevelText = `
        //               <div>${levelInformation[i].Level.substring(0, nowLevelTranLength)}</div>
        //               <div>${levelInformation[i].Level.substring(nowLevelTranLength)}</div>`;
        //     } else {
        //         levelInformation[i].LevelText = levelInformation[i].Level;
        //     }
        //     // console.log('Level', 8888888, levelInformation[i].Level)
        // }
        return levelInformation;
    }

    setParams(noLoading = null) {
        let getListsApi = null;
        let getParams = {
            csStatus: 2,          //-1 未开始 0进行中 1已完成 2全部
            plid: this.page.plid                //等级ID
        }

        switch (this.page.nowClick) { // 列表类型 课程/考试/KPI/评分
            case 'course':
                // 课程
                getParams = Object.assign({}, getParams, {
                    Conditions: 'All',
                    PageCurrent: this.page.Page,
                    PageSize: this.page.PageSize
                });
                getListsApi = (data) => {
                    return this.homeSer.QueryCoursePage(data);
                };
                break
            case 'exam':
                // 考试
                getListsApi = (data) => {
                    return this.homeSer.QueryExam(data)
                };
                break
            // case 'kpi':
            //     // KPI
            //     getListsApi = (data) => {
            //         return this.homeSer.QueryKpiInformation(data)
            //     };
            //     break
            // case 'points':
            //     // 评分
            //     getListsApi = (data) => {
            //         return this.homeSer.QuerySpeakScore(data)
            //     };
            //     break
        }
        // if (this.page.nowClick === 'course' || this.page.nowClick === 'exam') {
        //     switch (this.page.nowClickSec) { // 课程/考试  对应的列表 状态
        //         case 'wait':
        //             // 未开始
        //             getParams = Object.assign({}, getParams, {csStatus: -1})
        //             break
        //         case 'doing':
        //             // 0进行中
        //             getParams = Object.assign({}, getParams, {csStatus: 0})
        //             break
        //         case 'finish':
        //             // 1已完成
        //             getParams = Object.assign({}, getParams, {csStatus: 1})
        //             break
        //         case 'more':
        //             // 2全部
        //             getParams = Object.assign({}, getParams, {csStatus: 2})
        //             break
        //     }
        // }

        this.page.getListsApi = getListsApi;
        this.page.getParams = getParams;
        this.getLists(noLoading);
    }

    getLists(noLoading = null) {
        this.page.isLoaded = false;
        let loading = this.loadCtrl.create({
            content: ''
        });
        if (!noLoading) loading.present();

        console.log('getParams', this.page.getParams)
        this.page.getListsApi(this.page.getParams).subscribe(
            (res) => {

                if (res.code === 200) {

                    switch (this.page.nowClick) { // 列表类型 课程/考试/KPI/评分
                        case 'course':
                            // 课程
                            this.page.navliArr[0].lists = res.data.productListItems;
                            this.page.TotalCount = res.data.totalcount;
                            break
                        case 'exam':
                            // 考试
                            this.page.navliArr[1].lists = res.data;
                            break
                        // case 'kpi':
                        //     // KPI
                        //     this.page.navliArr[2].lists = res.data;
                        //     break
                        // case 'points':
                        //     // 评分
                        //     this.page.navliArr[3].lists = res.data;
                        //     break
                    }
                    this.page.isLoaded = true;
                    console.log('getListsApi', res)

                }
                loading.dismiss();
            }, err => {
                loading.dismiss();
            }
        )

    }

    initLists() {
        for (var i = 0; i < this.page.navliArr.length; i++) {
            this.page.navliArr[i].lists = [];
        }
    }

    // 二级导航（课程/考试状态）切换
    // changeSecNav(navSecIndex, bool) {
    //     if (bool) return;
    //     this.page.isLoaded = false;
    //     this.initLists();
    //     console.log('changeNav', navSecIndex, bool)
    //     for (var i = 0; i < this.page.courseTypeArr.length; i++) {
    //         this.page.courseTypeArr[i].isActived = false;
    //     }
    //
    //     this.page.courseTypeArr[navSecIndex].isActived = true;
    //     this.page.nowClickSec = this.page.courseTypeArr[navSecIndex].navBtnEn
    //     this.setParams();
    // }

    // 前往 更多课程
    goAdvancedLists() {
        let item = null;
        let levelInformation = this.page.levelInformation
        for (let i = 0; i < levelInformation.length; i++) {
            if (levelInformation[i].actived === true) {
                item = levelInformation[i + 1]; // 获取当前亮的按钮 下一级的 level
            }
        }

        console.log('nowLevel', item, '888***canClick', this.page.canClick)
        this.page.plid = item.ID;
        if (item) {
            this.navCtrl.push(AdvancedListsPage, {
                plid: item.ID,
                canClick: this.page.canClick,
                Level: this.page.nowLevelText
            });
        }
    }

    // 切换角色
    showActionSheet() {
        let btnArr = []
        for (let i = 0; i < this.page.roleList.length; i++) {
            let obj = {
                text: this.page.roleList[i].label,
                role: this.page.leveltype === this.page.roleList[i].value ? 'destructive' : '',
                handler: () => {
                    // console.log('this', this, this.page, i)
                    let loading = this.loadCtrl.create({
                        content: ''
                    });
                    loading.present();

                    this.homeSer.ValidationLevel({}).subscribe(
                        (res) => {
                            // if (res.data.status === 1) { // 判断是1 else 是0 这里模拟方便
                            this.homeSer.InitializeLevel({leveltype: this.page.roleList[i].value}).subscribe(
                                (resInit) => {
                                    if (resInit.code === 200) {
                                        this.initLists();
                                        this.page.leveltype = this.page.roleList[i].value;
                                        this.page.levelTypeText = this.page.roleList[i].label;
                                        loading.dismiss();
                                        this.page.firstTime = true;
                                        this.page.nowLevelIndex = null;
                                        this.page.TotalCount = 0;
                                        this.page.Page = 1;
                                        this.page.PageSize = 10;
                                        console.log('leveltype', this.page.leveltype)
                                        this.getAdvancedLevel();

                                    }
                                }
                            )
                        }
                    )
                }
            }
            btnArr.push(obj)
        }
        // console.log('btnArr', btnArr)
        const actionSheet = this.actionSheetCtrl.create({
            cssClass: 'levelAction',
            buttons: btnArr
        });
        actionSheet.present();
    }

    // 点击课程列表项 获取课程详情
    goCourse(e) {
        // let canClick = this.page.nowLevel >= (e.Hierarchy - 2);
        if (!this.page.canClick) {
            this.commonSer.alert('请先完成当前级别学习!');
            return
        }
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType, enterResource: "level"});
        }
    }

    // 点击考试列表
    goExam(item) {
        if (!this.page.canClick) {
            this.commonSer.alert('请先完成当前级别学习!');
            return
        }
        if (item.ID) item.Fid = item.ID;
        let canTest = item.IsExam === true; // bool true可以考试  false 不可以考试
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

    //加载更多
    doInfinite(e) {
        console.log('8888-----', this.page.navliArr[0].lists.length, this.page.TotalCount)
        if (this.page.navliArr[0].lists.length == this.page.TotalCount || this.page.navliArr[0].lists.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.Page++;
        const data = {
            PageCurrent: this.page.Page,
            PageSize: this.page.PageSize,
            csStatus: 2,
            plid: this.page.plid,
            Conditions: 'All'
        };
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.QueryCoursePage(data).subscribe(
            (res) => {
                this.page.navliArr[0].lists = this.page.navliArr[0].lists.concat(res.data.productListItems);
                this.page.TotalCount = res.data.totalcount;
                e.complete();
                loading.dismiss();
            }
        )
    }

}
