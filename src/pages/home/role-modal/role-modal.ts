import {Component} from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import {HomeService} from "../home.service";
import {defaultHeadPhoto} from "../../../app/app.constants";

@Component({
    selector: 'page-role-modal',
    templateUrl: 'role-modal.html',
})
export class RoleModalPage {

    itemObj;
    replyList = [];
    defaultHeadPhoto = defaultHeadPhoto;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private homeSer: HomeService,
                private viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
        
    }

    getList() {
        
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

}
