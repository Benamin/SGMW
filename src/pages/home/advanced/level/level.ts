import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';

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
        nowProgress: 0
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private loadCtrl: LoadingController,
        private homeSer: HomeService
    ) {
    }

    ionViewDidEnter() {
        this.getAdvancedLevel();
    }

    // 前往 认证进阶 的 勋章设置
    goAdvancedLists(plid) {
        this.navCtrl.push(AdvancedListsPage, { plid: plid });
    }

    // 用户等级信息
    getAdvancedLevel() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.getAdvancedLevel({}).subscribe(
            (res) => {
                if (res.code === 200) {
                    // console.log('Lv:', res)
                   let nowLevel = Number(res.data.Level.split('LV')[1]);
                   this.page.levelInformation =  res.data.levelInformation;
                   this.page.nowLevel = nowLevel;
                   let nowProgress = Number(res.data.schedule) || 0;
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

}
