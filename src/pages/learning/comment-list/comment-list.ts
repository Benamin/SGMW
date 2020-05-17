import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {defaultHeadPhoto} from "../../../app/app.constants";
import {TalkReplyPage} from "../talk/talk-reply/talk-reply";

@Component({
    selector: 'page-comment-list',
    templateUrl: 'comment-list.html',
})
export class CommentListPage {
    @Input() TopicType;
    List;
    starList = new Array(5);
    defalutPhoto = defaultHeadPhoto;   //默认头像；

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
    }

    get cList() {
        return this.List;
    }

    @Input() set cList(value) {
        value.forEach(e => {
            if (e.QType == 2) {
                e.Content = JSON.parse(e.Content)
                console.log(e.Content);
            }
        })
        this.List = value;
    }

    goDetail(item) {
        if (this.TopicType == 'talk') {
            this.navCtrl.push(TalkReplyPage, {item: item});
        }
    }


}
