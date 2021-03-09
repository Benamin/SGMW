import {Component} from '@angular/core';
import { NavController, NavParams, ViewController,ToastController } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
// import {defaultHeadPhoto} from "../../../../app/app.constants";

@Component({
    selector: 'page-ask-search-modal',
    templateUrl: 'ask-search-modal.html',
})
export class askSearchModalPage {
		nowPic = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                public toastCtrl: ToastController,
								private keyboard: Keyboard) {}

    ionViewDidLoad() {
        this.nowPic = this.navParams.get('nowPic');
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

}
