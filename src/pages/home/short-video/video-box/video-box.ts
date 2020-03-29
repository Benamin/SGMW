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
    videoList = [];
    itemID;
    loading;

    initVideo = <any>{};

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService,
                private loadCtrl: LoadingController,
                private modalCtrl: ModalController,
                private homeSer: HomeService) {
        this.itemID = this.navParams.get('ID');
        this.getShortVideoList();
    }

    ionViewDidLoad() {

    }

    //获取短视频
    getShortVideoList() {
        this.loading = this.loadCtrl.create();
        this.loading.present();
        const data = {
            SVID: this.itemID
        };
        this.homeSer.GetTopDownShortVideoDetail(data).subscribe(
            (res1) => {
                this.homeSer.GetShortVideoDetail(data).subscribe(
                    (res2) => {
                        if (res1.data.TopItem.CoverUrl) {
                            this.videoList.push(res1.data.TopItem);
                        }
                        this.videoList.push(res2.data);
                        if (res1.data.DownItem.CoverUrl) {
                            this.videoList.push(res1.data.DownItem);
                        }
                        this.init();
                    }
                );
            }
        )
    }

    //swiper&&videojs初始化
    init() {
        let that = this;
        let mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            speed: 1000,// slide滑动动画时间
            observer: true,
            initialSlide: that.videoList[0].ID == that.itemID ? 0 : 1,
            observeParents: false,
            on: {
                slideChangeTransitionStart: function () {
                },
                slidePrevTransitionStart: function () {
                    if (this.activeIndex == 0) that.getTopAndDown('pre', that.videoList[this.activeIndex]);
                },
                slideNextTransitionStart: function () {
                    if (that.videoList.length == this.activeIndex + 1) that.getTopAndDown('next', that.videoList[this.activeIndex]);
                }
            },
        });
        timer(100).subscribe(() => {
            that.videoList.forEach((e, index) => {
                that.initVideo[`video${e.files.ID}`] = videojs(`video${e.files.ID}`, {
                    controls: true,
                    autoplay: false,
                    "sources": [{
                        src: e.files.AttachmentUrl,
                        type: 'application/x-mpegURL'
                    }],
                })
                that.initVideo[`video${e.files.ID}`].on('loadedmetadata', () => {
                    that.initVideo[`video${e.files.ID}`].on('touchstart', () => {
                        if (that.initVideo[`video${e.files.ID}`].paused()) {
                            that.initVideo[`video${e.files.ID}`].play();
                        } else {
                            that.initVideo[`video${e.files.ID}`].pause();
                        }
                    })
                });

            });
            that.loading.dismiss();
        })
    }

    /**
     * 查询上一个&&下一个
     * @param type 滑动方向 pre=>上一个 next=>下一个
     * @param item  //当前item
     */
    getTopAndDown(type, item) {
        const data = {
            SVID: item.ID
        };
        this.homeSer.GetTopDownShortVideoDetail(data).subscribe(
            (res) => {
                if (type == 'next' && res.data.DownItem.CoverUrl) {  //通过CoverUrl是否为null进行判断是否有下一个
                    this.videoList.push(res.data.DownItem);
                    timer(100).subscribe(() => {
                        const fileId = res.data.DownItem.files.ID;
                        this.initVideo[`video${fileId}`] = videojs(`video${fileId}`, {  //video初始化
                            controls: true, autoplay: false,
                            "sources": [{src: res.data.DownItem.files.AttachmentUrl, type: 'application/x-mpegURL'}],
                        })
                        this.initVideo[`video${fileId}`].on('loadedmetadata', () => {
                            this.initVideo[`video${fileId}`].on('touchstart', () => {
                                if (this.initVideo[`video${fileId}`].paused()) {
                                    this.initVideo[`video${fileId}`].play();
                                } else {
                                    this.initVideo[`video${fileId}`].pause();
                                }
                            })
                        });
                    })
                }
                if (type == 'pre' && res.data.TopItem.CoverUrl) {
                    this.videoList.unshift(res.data.TopItem);
                    timer(100).subscribe(() => {
                        const fileId = res.data.TopItem.files.ID;
                        this.initVideo[`video${fileId}`] = videojs(`video${fileId}`, {  //video初始化
                            controls: true, autoplay: false,
                            "sources": [{src: res.data.TopItem.files.AttachmentUrl, type: 'application/x-mpegURL'}],
                        })
                        this.initVideo[`video${fileId}`].on('loadedmetadata', () => {
                            this.initVideo[`video${fileId}`].on('touchstart', () => {
                                if (this.initVideo[`video${fileId}`].paused()) {
                                    this.initVideo[`video${fileId}`].play();
                                } else {
                                    this.initVideo[`video${fileId}`].pause();
                                }
                            })
                        });
                    })
                }
            }
        );
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
                    this.commonSer.alert(res.message);
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
