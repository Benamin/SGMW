import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-report',
    templateUrl: 'report.html',
})
export class ReportPage {

    autoManufacturers;
    content;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ReportPage');
    }

    //提交
    submit() {
        this.navCtrl.pop();
        this.commonSer.toast('提交成功');
    }

}