import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import Swiper from 'swiper';
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home.service";
import {CommonService} from "../../../../core/common.service";
import {VideoReplyPage} from "../video-reply/video-reply";

declare let videojs: any;
declare var Wechat;

@Component({
    selector: 'page-video-box',
    templateUrl: 'video-box.html',
})
export class VideoBoxPage {
    like: true;
    videoObj;
    comment: '';
    videoList;
    itemID;

    initVideo = <any>{};

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService,
                private loading: LoadingController,
                private modalCtrl: ModalController,
                private homeSer: HomeService) {
        this.itemID = this.navParams.get('ID');
        this.getShortVideoList();
    }

    ionViewDidLoad() {
        const loading = this.loading.create();
        loading.present();
        const data = {
            GetMyList: 0,
            Title: "",
            Page: 1,
            PageSize: 100
        };
        this.homeSer.GetVideoLists(data).subscribe(
            (res) => {
                this.videoList = res.data.Items;
                this.videoObj = this.navParams.get("item");
                let mySwiper = new Swiper('.swiper-container', {
                    direction: 'vertical',
                    speed: 1000,// slide滑动动画时间
                    observer: true,
                    observeParents: false,
                    on: {
                        slideChangeTransitionStart: function () {
                            console.log(this.activeIndex);
                        },
                    },
                });
                timer(100).subscribe(() => {
                    this.videoList.forEach((e, index) => {
                        this.initVideo[`video${e.files.ID}`] = videojs(`video${e.files.ID}`, {
                            muted: false,
                            controls: true,
                            autoplay: false,
                            "sources": [{
                                src: e.files.AttachmentUrl,
                                type: 'application/x-mpegURL'
                            }],
                        })
                    });
                    loading.dismiss();
                })
            }
        )
    }

    //获取短视频
    getShortVideoList() {
        const data = {
            SVID: this.itemID
        };
        this.homeSer.GetTopDownShortVideoDetail(data).subscribe(
            (res) => {

            }
        )
    }

    ionViewDidLeave() {
        for (let i in this.initVideo) {
            this.initVideo[i].dispose();
        }
    }

    //评论
    goComment(item) {
        let modal = this.modalCtrl.create(VideoReplyPage, {item: item});
        modal.onDidDismiss((data) => {
            this.getVideoDetail(item);
        })
        console.log('modal.present');
        modal.present();
    }

    //获取视频详情
    getVideoDetail(item) {
        const data = {
            SVID: item.ID
        };
        this.homeSer.GetShortVideoDetail(data).subscribe(
            (res) => {
                item.LikeCount = res.data.LikeCount;
                item.IsLike = res.data.IsLike;
                item.ReplyCount = res.data.ReplyCount;
            }
        )
    }

    //点赞 1 or 取消点赞 2
    handleLike(item, option) {
        const data = {
            "SVID": item.ID,
            "IsADD": option
        };
        this.homeSer.shortVideoLike(data).subscribe(
            (res) => {
                if (res.data) {
                    this.getVideoDetail(item);
                } else {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    // 微信分享
    wxShare(data) {
        console.log('分享内容', data)
        let thumb = data.CoverUrl;
        Wechat.share({
            message: {
                title: data.Title, // 标题
                description: "", // 简介
                thumb: thumb, //帖子图片
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                // media: "YOUR_MEDIA_OBJECT_HERE",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: `http://a1.hellowbs.com/openApp.html?scheme_url=shortVideo&Id=${data.ID}`
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
