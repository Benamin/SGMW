import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {ReplyInputPage} from "../reply-input/reply-input";
import {defaultHeadPhoto} from "../../../../app/app.constants";

@Component({
    selector: 'page-video-reply',
    templateUrl: 'video-reply.html',
})
export class VideoReplyPage {

    itemObj;
    replyList = [];
    defaultHeadPhoto = defaultHeadPhoto;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private homeSer: HomeService,
                private modalCtrl: ModalController,
                private viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
        this.itemObj = this.navParams.get("item");
        this.getList();
    }

    getList() {
        const data = {
            "SVId": this.itemObj.ID,//短视频的ID
            "IsGetComment": true,//是否获取评论的回复
            "Page": 1,
            "PageSize": 10,
            "OrderBy": "CreateTime",
            "IsAsc": "DESC",
            "IsHot": true,
            "SortDir": "DESC",
        }
        this.homeSer.GetShortVideoReplyList(data).subscribe(
            (res) => {
                this.replyList = res.data.Items;
            }
        )
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

    //打开输入框
    openReply(e) {
        e.stopPropagation();
        let modal = this.modalCtrl.create(ReplyInputPage, {SVID: this.itemObj.ID, placeholder: `留下你的精彩评论吧`});
        modal.onDidDismiss((data) => {
            this.getList();
        });
        modal.present();
    }

    //回复
    replyOtherPerson(item) {
        let modal = this.modalCtrl.create(ReplyInputPage, {
            SVID: this.itemObj.ID,
            placeholder: `回复${item.Replyer}:`,
            item: item
        });
        modal.onDidDismiss((data) => {
            this.getList();
        });
        modal.present();
    }
}
