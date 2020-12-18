import {Component, Input, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {CommentComponent} from "../../../../components/comment/comment";
import {LearnService} from "../../learn.service";
import {CommonService} from "../../../../core/common.service";
import {defaultImg} from "../../../../app/app.constants";
import {timer} from "rxjs/observable/timer";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {AppService} from "../../../../app/app.service";
import {StatusBar} from "@ionic-native/status-bar";
import {FloatVideoBoxComponent} from "../../../../components/float-video-box/float-video-box";
import {GlobalData} from "../../../../core/GlobleData";

@Component({
    selector: 'page-talk-reply',
    templateUrl: 'talk-reply.html',
})
export class TalkReplyPage {

    item;
    data = [];
    defaultImg = defaultImg;
    video;
    isHidden = true;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public learnSer: LearnService,
                public global: GlobalData,
                public commonSer: CommonService,
                public modalCtrl: ModalController) {
        this.item = this.navParams.get('item');
    }

    ionViewDidLoad() {
        this.global.CourseEnterSource = "CourseTalk";
        this.getReplayList();
    }

    //回复列表
    getReplayList() {
        const data = {
            "PostReplyId": this.item.ID,
            "keyword": "",
            "IsAdminDeleted ": false
        };
        this.learnSer.replycomment_search(data).subscribe(
            (res) => {
                this.data = res.data.Items;
            }
        )
    }

    //打开回复弹窗
    openComment() {
        let modal = this.modalCtrl.create(CommentComponent, {
            placeholder: '请输入回复内容',
            type: 'talk',
        });
        modal.onDidDismiss(res => {
            if (res) {
                this.handleTalk(res);
            }
        });
        modal.present();
    }

    //提交回复
    handleTalk(resp) {
        let data = {
            "PostReplyId": this.item.ID,//评论的回帖编号
            "Content": resp.replyContent,//评论内容
            "MentionUser": this.item.UserID,//回复用户的 loginName
            "CurrentUser": ""
        }
        this.learnSer.replycomment_add(data).subscribe(
            (res) => {
                if (res.data) {
                    this.commonSer.toast('回复成功');
                }
                this.getReplayList();
            }
        )
    }

    //视频弹窗
    openVideo(item) {
        if (!item.StuAnswer) {
            this.commonSer.toast('视频未转码完成');
            return
        }
        let modal = this.modalCtrl.create(FloatVideoBoxComponent, {src: item.StuAnswer});
        modal.present();
    }
}
