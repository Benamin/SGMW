import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {CommonService} from "../../../../core/common.service";

@Component({
    selector: 'page-reply-input',
    templateUrl: 'reply-input.html',
})
export class ReplyInputPage {

    replyContent;
    SVID;
    itemObj;
    placeholder;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private homeSer: HomeService,
                private commonSer: CommonService,
                private viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
        this.SVID = this.navParams.get('SVID');
        this.placeholder = this.navParams.get('placeholder');
        this.itemObj = this.navParams.get('item');
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

    //评论
    submit() {
        if (this.itemObj) {
            this.comment();
            return
        }
        const data = {
            "SVID": this.SVID,//短视频ID
            "Content": this.replyContent,//评论内容
        };
        this.homeSer.ShortVideoReplyAdd(data).subscribe(
            (res) => {
                if (res.data) {
                    this.viewCtrl.dismiss();
                } else {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //回复评论
    comment() {
        const data = {
            "SVReplyId": this.itemObj.SVReplyId,//回复的评论ID
            "Content": this.replyContent,//回复内容
        };
        this.homeSer.replyComment(data).subscribe(
            (res) => {
                if (res.data) {
                    this.viewCtrl.dismiss();
                } else {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

}
