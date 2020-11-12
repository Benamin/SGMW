import {Component} from '@angular/core';
import { NavController, NavParams, ViewController,ToastController } from 'ionic-angular';

@Component({
    selector: 'page-rule-modal',
    templateUrl: 'rule-modal.html',
})
export class RuleModalPage {

    nowItemObj = null;
    ruleData = null
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        this.ruleData = this.navParams.get('ruleData');
        console.log('ruleData', this.ruleData)
    }

    getList() {
        
    }

    selectItem(item) {
        this.nowItemObj = item;
    }

    sureSelect() {
        if (this.nowItemObj) {
            this.viewCtrl.dismiss(this.nowItemObj);
        } else {
            let toast = this.toastCtrl.create({
                message: '请选择类型',
                position: 'middle',
                duration: 1000
            });
            toast.present();
        }
        
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

}
