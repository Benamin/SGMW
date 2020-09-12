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
        hasArea: false
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        // private loadCtrl: LoadingController,
        // private homeSer: HomeService
    ) {
    }

    ionViewDidEnter() {
        console.log('JS:OK')
    }

    // 前往 认证进阶 的 勋章设置
    goAdvancedLists() {
        this.navCtrl.push(AdvancedListsPage);
    }

}
