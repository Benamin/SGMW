import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CommentComponent} from "../../../../components/comment/comment";

@Component({
    selector: 'page-talk-reply',
    templateUrl: 'talk-reply.html',
})
export class TalkReplyPage {

    data;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public modalCtrl: ModalController) {
        this.data = this.navParams.get('item');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TalkReplyPage');
    }

    openComment() {
        let modal = this.modalCtrl.create(CommentComponent, {
            placeholder: '请输入回复内容',
            type: 'talk',
        });
        modal.onDidDismiss(res => {
            if (res) {
                console.log('回复内容', res)
            }
        });
        modal.present();
    }

}
