import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ModalController} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {askSearchModalPage} from "../ask-search-modal/ask-search-modal";

@Component({
    selector: 'page-ask-detail',
    templateUrl: 'ask-detail.html',
})
export class WantToAskDetailPage {
		userDefaultImg = './assets/imgs/userDefault.jpg'
    page = {
			askItem: null
    };

    constructor(public navCtrl: NavController, private homeSer: HomeService,private modalCtrl: ModalController, private loadCtrl: LoadingController, public navParams:NavParams,) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ionViewDidLoad() {
			this.page.askItem = this.navParams.get("item")
			console.log('666--item', this.navParams.get("item"))

    }
		
		showPic(itemPic) {
			let modal = this.modalCtrl.create(askSearchModalPage, {nowPic: itemPic });
			modal.onDidDismiss((data) => {
			    if (data) {
						console.log('999--onDidDismiss', data)
			    }
			})
			modal.present();
		}
}
