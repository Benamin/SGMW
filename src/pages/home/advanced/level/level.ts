import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ActionSheetController, ModalController } from 'ionic-angular';
import {CommonService} from "../../../../core/common.service";
import {HomeService} from "../../home.service";
import {AdvancedListsPage} from "../lists/lists";
import {RuleModalPage} from "../rule-modal/rule-modal";

@Component({
    selector: 'page-level',
    templateUrl: 'level.html',
})
export class AdvancedLevelPage {
    page = {
        defaultImg: 'assets/imgs/default.jpg',
        checkType: 'exam',
        navliArr: [
            {
                navBtnText: '课程',
                navBtnEn: 'course',
                isActived: true
            },
            {
                navBtnText: '考试',
                navBtnEn: 'exam',
                isActived: false
            },
            {
                navBtnText: 'KPI',
                navBtnEn: 'kpi',
                isActived: false
            },
            {
                navBtnText: '评分',
                navBtnEn: 'points',
                isActived: false
            }
        ],
        courseTypeArr: [
            {
                navBtnText: '待开始',
                navBtnEn: 'wait',
                isActived: true
            },
            {
                navBtnText: '进行中',
                navBtnEn: 'doing',
                isActived: false
            },
            {
                navBtnText: '已完成',
                navBtnEn: 'finish',
                isActived: false
            },
            {
                navBtnText: '更多',
                navBtnEn: 'more',
                isActived: false
            }
        ],
        nowClick: 'course',
        nowClickSec: 'wait',
        mineInfo: null,
        Lists: [],
        getListsApi: null, // 请求接口服务
        Param: null,
        getParams: null,
        hasArea: false,
        levelInformation: [],
        nowLevel: 0,
        nowProgress: 0,
        isNowLevel: null, // sales destructive clerk
        roleList: [],
        leveltype: null,
        levelTypeText: null
    }

    constructor(
        public navCtrl: NavController,
        private commonSer: CommonService,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        private loadCtrl: LoadingController,
        private homeSer: HomeService,
        private modalCtrl: ModalController
    ) {}

    ionViewDidEnter() {

        this.page.roleList = this.navParams.get('roleList');
        if(!this.page.leveltype) this.page.leveltype = this.navParams.get('leveltype').value;
        if(!this.page.levelTypeText) this.page.levelTypeText = this.navParams.get('leveltype').label;
        // this.getAdvancedLevel();
    }

    showRuleModal () {
        let modalData = {
            leveltype: '实习顾问',
            title: '实习顾问是按照上汽通实习顾问是按照上汽通',
            content: '经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾问完成x门课程后升级为销售顾问经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾问完成x门课程后升级为销售顾问经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾问完成x门课程后升级为销售顾问经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾问完成x门课程后升级为销售顾问经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾问完成x门课程后升级为销售顾问经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾问完成x门课程后升级为销售顾问经销商销售人员需在入职后完成x门课程才可升级为实习顾问，实习顾'
        }
        let modal = this.modalCtrl.create(RuleModalPage, { ruleData: modalData });
        modal.onDidDismiss((data) => {
            if (data) { console.log('关闭modal：', data) }
        })
        modal.present();
    }

    changeNav (navIndex, bool) {
        console.log('changeNav', navIndex, bool)
        if (bool && this.page.nowClick === this.page.navliArr[navIndex].navBtnEn) return;
        for (var i=0; i<this.page.navliArr.length; i++) {
            this.page.navliArr[i].isActived = false;
        }
        this.page.navliArr[navIndex].isActived = true;
    }
    changeSecNav (navSecIndex, bool) {
        console.log('changeNav', navSecIndex, bool)
        if (bool && this.page.nowClickSec  === this.page.courseTypeArr[navSecIndex].navBtnEn) return;
        for (var i=0; i<this.page.courseTypeArr.length; i++) {
            this.page.courseTypeArr[i].isActived = false;
        }
        this.page.courseTypeArr[navSecIndex].isActived = true;
    }

    // 前往 认证进阶 的 勋章设置
    goAdvancedLists(item) {
        console.log(this.page.nowLevel , item.Hierarchy - 2)
        let canClick = this.page.nowLevel >= (item.Hierarchy - 2);
        this.navCtrl.push(AdvancedListsPage, { plid: item.ID, canClick: canClick, Level: item.Level });
    }

    // 用户等级信息
    getAdvancedLevel() {
        // console.log('leveltype99:', this.page.leveltype)
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.getAdvancedLevel({ leveltype: this.page.leveltype }).subscribe(
            (res) => {
                if (res.code === 200) {
                    // console.log('Lv:', res)
                    //    let nowLevel = Number(res.data.Level.split('LV')[1]);
                    let nowLevel = res.data.Hierarchy - 1;
                    this.page.levelInformation =  res.data.levelInformation;
                    this.page.nowLevel = nowLevel;
                    // let schedule = res.data.schedule;
                    // let nowProgress = schedule;
                    // if (typeof schedule === 'string' && schedule.indexOf(" %") != -1) {
                    //  nowProgress = Number(schedule.split(' ')[0]);
                    // } else {
                    //  nowProgress = Number(schedule);
                    // }

                    //    console.log('nowProgress', nowProgress)
                    // let nowProgress = 30; // 模拟
                    this.page.nowProgress = res.data.schedule;
                }  else {
                    this.commonSer.toast(res.message);
                }

                // this.page.myInfo = res.data;
                loading.dismiss();
            }, err => {
                loading.dismiss();
            }
        )
    }

    showActionSheet() {
        let btnArr = []
        for (let i =0; i<this.page.roleList.length; i++) {
            let obj = {
                text: this.page.roleList[i].label,
                role: this.page.leveltype === this.page.roleList[i].value ? 'destructive' : '',
                handler: () => {
                    // console.log('this', this, this.page, i)
                    let loading = this.loadCtrl.create({
                        content: ''
                    });

                    this.homeSer.ValidationLevel({}).subscribe(
                        (res) => {
                            // if (res.data.status === 1) { // 判断是1 else 是0 这里模拟方便
                            this.homeSer.InitializeLevel({ leveltype: this.page.roleList[i].value }).subscribe(
                                (resInit) => {
                                    if (resInit.code === 200) {

                                        this.page.leveltype = this.page.roleList[i].value;
                                        this.page.levelTypeText = this.page.roleList[i].label;
                                        loading.dismiss();
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

}
