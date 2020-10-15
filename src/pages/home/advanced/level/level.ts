import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';

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
        leveltype: null
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        private loadCtrl: LoadingController,
        private homeSer: HomeService
    ) {
    }

    ionViewDidEnter() {
        this.page.roleList = this.navParams.get('roleList');
        this.page.leveltype = this.navParams.get('leveltype');
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
        console.log('leveltype99:', this.page.leveltype)
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
                   let schedule = res.data.schedule;
                   let nowProgress = Number(schedule) || 0;
                   if (typeof schedule === 'string' && schedule.indexOf(" %") != -1) {
                    nowProgress = Number(schedule.split(' ')[0]);
                   } else {
                    nowProgress = Number(schedule);
                   }
                   
                   console.log('nowProgress', nowProgress)
                // let nowProgress = 30; // 模拟
                   this.page.nowProgress = nowProgress
                } else {
                    // console.log('获取学习情况', res)
                }
                
                // this.page.myInfo = res.data;
                loading.dismiss();
            }, err => {
                loading.dismiss();
            }
        )
    }

    showActionSheet() {
        console.log('leveltype', this.page.leveltype, this.page.roleList)
        let btnArr = []
        for (let i =0; i<this.page.roleList.length; i++) {
            let obj = {
                text: this.page.roleList[i].label,
                role: this.page.leveltype === this.page.roleList[i].value ? 'destructive' : '',
                handler: () => {
                    console.log('this', this, this.page, i)
                    console.log('销售顾问', this.page.roleList[i].value)
                    let loading = this.loadCtrl.create({
                        content: ''
                    });
                    
                    this.homeSer.InitializeLevel({ leveltype: this.page.leveltype }).subscribe(
                        (resRole) => {
                            if (resRole.code === 200) {
                                this.page.leveltype = this.page.roleList[i].value
                                loading.dismiss();
                                this.getAdvancedLevel();
                            }
                        }
                    )
                }
            }
            btnArr.push(obj)
        }
        // let btnArr = [
        //     {
        //         text: '销售顾问',
        //         role: that.page.isNowLevel === 'sales' ? 'destructive' : '',
        //         handler: () => {
        //             console.log('销售顾问')
        //         }
        //     },
        //     {
        //         text: '店长',
        //         role: that.page.isNowLevel === 'destructive' ? 'destructive' : '',
        //         handler: () => {
        //             console.log('店长')
        //         }
        //     },
        //     {
        //         text: '店员',
        //         role: that.page.isNowLevel === 'clerk' ? 'destructive' : '',
        //         handler: () => {
        //             console.log('店员')
        //         }
        //     }
        // ]
        console.log('btnArr', btnArr)
        const actionSheet = this.actionSheetCtrl.create({
            cssClass: 'levelAction',
            buttons: btnArr
        });
        actionSheet.present();
    }

}
