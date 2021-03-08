import {Component} from '@angular/core';
import { NavController, NavParams, ViewController,ToastController } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
// import {defaultHeadPhoto} from "../../../../app/app.constants";

@Component({
    selector: 'page-ask-search-modal',
    templateUrl: 'ask-search-modal.html',
})
export class askSearchModalPage {

    nowItemObj = null;
    roleList = [];
		page = {
			title: '',
			page: 1
		}
    // defaultHeadPhoto = defaultHeadPhoto;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                public toastCtrl: ToastController,
								private keyboard: Keyboard) {}

    ionViewDidLoad() {
        this.roleList = this.navParams.get('roleList');
        console.log('roleList', this.roleList)
    }
		
		showKey() { this.keyboard.show(); }
		//按键
		search(event) {
		    if (event && event.keyCode == 13) {
		        this.page.page = 1;
		        this.getList();
		        //搜索日志
		        if (this.page.title) {
		            console.log(this.page.title)
		            // this.logSer.keyWordLog(this.page.title);
		        }
		    }
		}
		doSearch() {
		    console.log('当前搜索', this.page.title);
		}

    getList() {
        
    }

    selectItem(item) {
        this.nowItemObj = item;
    }

    // doSearch() {
    //     if (this.nowItemObj) {
    //         this.viewCtrl.dismiss(this.nowItemObj);
    //     } else {
    //         let toast = this.toastCtrl.create({
    //             message: '请选择类型',
    //             position: 'middle',
    //             duration: 1000
    //         });
    //         toast.present();
    //     }
        
    // }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

}
