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

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private homeSer: HomeService,
                private commonSer: CommonService,
                private viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
        this.SVID = this.navParams.get('SVID');
        console.log(this.SVID);
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

    //提交
    submit() {
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
}
