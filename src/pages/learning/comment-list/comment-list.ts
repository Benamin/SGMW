import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {defaultHeadPhoto} from "../../../app/app.constants";
import {TalkReplyPage} from "../talk/talk-reply/talk-reply";
import {LearnService} from "../learn.service";
import {CommonService} from "../../../core/common.service";
import {GlobalData} from "../../../core/GlobleData";

@Component({
    selector: 'page-comment-list',
    templateUrl: 'comment-list.html',
})
export class CommentListPage {
    @Input() TopicType;
    List;
    starList = new Array(5);
    defalutPhoto = defaultHeadPhoto;   //默认头像；

    disBtn;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public commonSer: CommonService,
                public global: GlobalData,
                private learnSer: LearnService) {
    }

    ionViewDidLoad() {
        this.global.CourseEnterSource = "CourseComment";
    }

    get cList() {
        return this.List;
    }

    @Input() set cList(value) {
        value.forEach(e => {
            if (e.qtype == 1 || e.qtype == 2) {
                e.Contents = JSON.parse(e.Contents)
            }
        })
        this.List = value;
    }

    //点赞
    handleLike(item) {
        if (item.IsMyLike) return;
        if (this.disBtn) return;
        if (item.IsMyDisLike) {
            this.commonSer.toast('已经踩过不能点赞');
            return;
        }
        this.disBtn = true;
        const data = {
            TalkId: item.ID
        };
        this.learnSer.Liketalk(data).subscribe(
            (res) => {
                if (res.Result == 0) {
                    item.IsMyLike = true;
                    item.LikeCount++;
                    this.commonSer.toast('感谢点赞');
                }
                this.disBtn = false;
            }
        )
    }

    //取消点赞
    handleCancelLike(item) {
        if (this.disBtn) return;
        if (!item.IsMyLike) return;
        this.disBtn = true;
        const data = {
            TalkId: item.ID
        };
        this.learnSer.CancelLiketalk(data).subscribe(
            (res) => {
                if (res.Result == 0) {
                    item.IsMyLike = false;
                    if (item.LikeCount-- < 1) item.LikeCount = 0;
                    this.commonSer.toast('取消点赞成功');
                }
                this.disBtn = false;
            }
        )
    }

    //踩
    handleDisLike(item) {
        if (this.disBtn) return;
        if (item.IsMyDisLike) return;
        if (item.IsMyLike) {
            this.commonSer.toast('已经点赞不能踩');
            return;
        }
        this.disBtn = true;
        const data = {
            TalkId: item.ID
        };
        this.learnSer.DisLiketalk(data).subscribe(
            (res) => {
                if (res.Result == 0) {
                    item.DisLikeCount++;
                    item.IsMyDisLike = true;
                }
                this.disBtn = false;
            }
        )
    }

    //取消踩
    handleCancelDisLike(item) {
        if (this.disBtn) return;
        if (!item.IsMyDisLike) return;
        this.disBtn = true;
        const data = {
            TalkId: item.ID
        };
        this.learnSer.CancelDisLiketalk(data).subscribe(
            (res) => {
                if (res.Result == 0) {
                    item.IsMyDisLike = false;
                    if (item.DisLikeCount-- < 1) item.DisLikeCount = 0;
                }
                this.disBtn = false;
            }
        )
    }

    goDetail(item) {
        if (this.TopicType == 'talk') {
            this.navCtrl.push(TalkReplyPage, {item: item});
        }
    }


}
