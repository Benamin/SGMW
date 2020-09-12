import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';

import {HomeService} from "../../home.service";

@Component({
    selector: 'page-lists',
    templateUrl: 'lists.html',
})
export class AdvancedListsPage {
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

}
