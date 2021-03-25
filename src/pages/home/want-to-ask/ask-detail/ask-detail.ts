import {Component} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
// import {askSearchModalPage} from "../ask-search-modal/ask-search-modal";

@Component({
    selector: 'page-ask-detail',
    templateUrl: 'ask-detail.html',
})
export class WantToAskDetailPage {
	userDefaultImg = './assets/imgs/userDefault.jpg'
    preImgSrc = "";
    page = {
			askItem: null
    };
    // private modalCtrl: ModalController,
    constructor(public navCtrl: NavController, public navParams:NavParams) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ionViewDidLoad() {
			this.page.askItem = this.navParams.get("item")
			console.log('666--item', this.navParams.get("item"))

    }

    //office、pdf、图片、视频
    openFile(file) {
        this.preImgSrc = file;
    }
		
    // showPic(itemPic) {
    //     let modal = this.modalCtrl.create(askSearchModalPage, {nowPic: itemPic });
    //     modal.onDidDismiss((data) => {
    //         if (data) {
    //                 console.log('999--onDidDismiss', data)
    //         }
    //     })
    //     modal.present();
    // }
}
