import {Component} from '@angular/core';
import { NavController, NavParams, ViewController,ToastController } from 'ionic-angular';
import {defaultHeadPhoto} from "../../../app/app.constants";

@Component({
    selector: 'page-role-modal',
    templateUrl: 'role-modal.html',
})
export class RoleModalPage {

    nowItemObj = null;
    roleList = [];
    defaultHeadPhoto = defaultHeadPhoto;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        // this.getList();
        this.roleList = this.navParams.get('roleList');
        console.log('roleList', this.roleList)
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
