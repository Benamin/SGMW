import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {VideoReplyPage} from "../../home/short-video/video-reply/video-reply";

declare let videojs: any;
declare var Wechat;

@Component({
    selector: 'page-my-short-video-box',
    templateUrl: 'my-short-video-box.html',
})
export class MyShortVideoBoxPage {
    like: true;
    itemId;
    loading;
    videoObj;
    itemObj;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService,
                private loadCtrl: LoadingController,
                private platform: Platform,
                private modalCtrl: ModalController,
                private homeSer: HomeService) {
        this.itemId = this.navParams.get('ID');
    }

    ionViewDidLoad() {
        this.getVideoDetail();
    }

    getVideoDetail() {
        const data = {
            SVID: this.itemId
        };
        this.homeSer.GetShortVideoDetail(data).subscribe(
            (res) => {
                if (res.data) {
                    this.itemObj = res.data;
                    this.videoObj = videojs(`myvideojs`, {
                        controls: true,
                        autoplay: true,
                        "sources": [{
                            //android 的用视频流地址播放 会出现视频画面模糊的问题 暂未解决只能根据视频地址播放
                            src: this.platform.is('ios') ? this.itemObj.files.AttachmentUrl : this.itemObj.files.DownLoadUrl,
                            type: 'application/x-mpegURL'
                        }],
                    });
                    this.videoObj.on('loadedmetadata', () => {
                        this.videoObj.on('touchstart', () => {
                            if (this.videoObj.paused()) {
                                this.videoObj.play();
                            } else {
                                this.videoObj.pause();
                            }
                        })
                    });
                } else {
                    this.navCtrl.pop();
                    this.commonSer.toast(res.message);
                }
            }
        )
    }


    ionViewDidLeave() {
        this.videoObj.dispose();
    }

    //评论
    goComment() {
        let modal = this.modalCtrl.create(VideoReplyPage, {item: this.itemObj});
        modal.onDidDismiss((data) => {
            this.getVideoDetail();
        })
        modal.present();
    }


//点赞 1 or 取消点赞 2
    handleLike(option) {
        const data = {
            "SVID": this.itemId,
            "IsADD": option
        };
        this.homeSer.shortVideoLike(data).subscribe(
            (res) => {
                if (res.data) {
                    this.getVideoDetail();
                } else {
                    this.commonSer.alert(res.message);
                }
            }
        )
    }

// 微信分享
    wxShare() {
        let thumb = this.itemObj.CoverUrl;
        Wechat.share({
            message: {
                title: this.itemObj.Title, // 标题
                description: "", // 简介
                thumb: thumb, //动态图片
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                // media: "YOUR_MEDIA_OBJECT_HERE",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: `http://a1.hellowbs.com/openApp.html?scheme_url=shortVideo&Id=${this.itemObj.ID}`
                }
            },
            scene: Wechat.Scene.SESSION
        }, function () {
            // alert("Success");
        }, function (reason) {
            // alert("Failed: " + reason);
        });
    }

}
