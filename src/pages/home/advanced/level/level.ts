import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import {CommonService} from "../../../../core/common.service";
import {HomeService} from "../../home.service";
import {AdvancedListsPage} from "../lists/lists";

@Component({
    selector: 'page-level',
    templateUrl: 'level.html',
})
export class AdvancedLevelPage {
    page = {
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
        private homeSer: HomeService
    ) {
    }

    ionViewDidEnter() {
        this.page.roleList = this.navParams.get('roleList');
        this.page.leveltype = this.navParams.get('leveltype').value;
        this.page.levelTypeText = this.navParams.get('leveltype').label;
        
        this.getAdvancedLevel();
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
        // console.log('leveltype', this.page.leveltype, this.page.roleList)
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
                            // console.log('goAdvancedLevel', res.data, res.data.status === 1);
                            if (res.data.status === 1) { // 判断是1 else 是0 这里模拟方便
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
                            } else {
                                this.page.leveltype = this.page.roleList[i].value;
                                this.page.levelTypeText = this.page.roleList[i].label;
                                loading.dismiss();
                                this.getAdvancedLevel();
                            }
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
