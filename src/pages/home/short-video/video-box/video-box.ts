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

    Page;  //页码
    searchKey;  //搜索关键字
    type;  //类型
    index;  //序号
    TotalCount;

    mySwiper;
    initSwiperBool;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService,
                private loadCtrl: LoadingController,
                private modalCtrl: ModalController,
                private homeSer: HomeService) {
        this.Page = this.navParams.get('Page');
        this.searchKey = this.navParams.get('searchKey');
        this.type = this.navParams.get('type');
        this.index = this.navParams.get('index');
    }

    ionViewDidLoad() {
        this.initSwiperBool = false;
        this.getList();
    }

    getList() {
        this.loading = this.loadCtrl.create({content: ''});
        this.loading.present();
        const data = {
            Title: this.searchKey,
            Page: this.Page,
            PageSize: 10,
            "OrderBy": this.type,
            "SortDir": "desc",
            "IsAsc": true,
            "TopicId": null
        };
        this.homeSer.GetShortVideoLists(data).subscribe(
            (res) => {
                this.videoList = res.data.Items;
                this.TotalCount = res.data.TotalCount;
                this.init();
            }
        )
    }

    //swiper&&videojs初始化
    init() {
        let that = this;
        that.mySwiper = new Swiper('.swiper-shortVideo-container', {
            direction: 'vertical',
            speed: 1000,// slide滑动动画时间
            observer: true,
            initialSlide: that.index,
            observeParents: true,
            on: {
                touchEnd: function (event) {
                    console.log('touchEnd', that.mySwiper.swipeDirection);
                    //你的事件
                    if (that.mySwiper.swipeDirection == 'prev') {  //上滑
                        if (this.activeIndex == 0 && that.Page === 1) {
                            that.commonSer.toast('已经是最第一个了');
                            return
                        }
                        if (this.activeIndex == 0 && that.Page > 1) {
                            that.Page--;
                            that.doInfinite('prev');
                            return;
                        }
                    }
                    if (that.mySwiper.swipeDirection == 'next') {  //下滑
                        if (this.activeIndex == that.videoList.length) {
                            that.commonSer.toast('已经是最后一个了');
                            return;
                        }
                        if (that.videoList.length != that.TotalCount && this.activeIndex + 1 == that.videoList.length) {
                            that.Page++;
                            that.doInfinite('next');
                        }
                    }
                },
                slidePrevTransitionStart: function () {  //上滑
                    let nextIndex = this.activeIndex + 1;
                    if (that.initVideo[`video${that.videoList[nextIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[nextIndex].files.ID}`].pause();
                    }
                    if (this.activeIndex == 1 && that.Page > 1 && that.initSwiperBool) {
                        that.Page--;
                        that.doInfinite('prev');
                    } else if (that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`].play();
                    }
                    console.log('slidePrevTransitionStart', this.activeIndex);
                },
                slideNextTransitionStart: function () {  //下滑
                    console.log('slideNextTransitionStart', this.activeIndex);
                    let preIndex = this.activeIndex - 1;
                    if (that.initVideo[`video${that.videoList[preIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[preIndex].files.ID}`].pause();
                    }
                    if (this.activeIndex == that.videoList.length - 2 && that.videoList.length != that.TotalCount
                        && that.initSwiperBool) {
                        that.Page++;
                        that.doInfinite('next');
                    } else if (that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`].play();
                    }
                },
                init: function () {
                    that.initSwiperBool = true;
                    console.log('init', this.activeIndex);
                }
            },
        });
        timer(500).subscribe(() => {
            that.videoList.forEach((e, index) => {
                that.initVideo[`video${e.files.ID}`] = videojs(`video${e.files.ID}`, {
                    controls: true,
                    autoplay: that.index === index ? true : false,
                    "sources": [{
                        src: e.files.DownLoadUrl,
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
        console.log(that.mySwiper)
    }

    /**
     * 查询上一个&&下一个
     * @param type 滑动方向 prev=>上一个 next=>下一个
     * @param item  //当前item
     */
    doInfinite(type) {
        const data = {
            Title: this.searchKey,
            Page: this.Page,
            PageSize: 10,
            "OrderBy": this.type,
            "SortDir": "desc",
            "IsAsc": true,
            "TopicId": null
        };
        this.homeSer.GetShortVideoLists(data).subscribe(
            (res) => {
                const loading = this.loadCtrl.create();
                loading.present();
                if (type == 'prev') {  //上滑
                    this.videoList = [...res.data.Items, ...this.videoList];
                    setTimeout(() => {
                        this.mySwiper.slideTo(9, 100);
                        loading.dismiss();
                    }, 500)
                } else {
                    this.videoList = [...this.videoList, ...res.data.Items];
                    setTimeout(() => {
                        this.mySwiper.slideTo(this.videoList.length - res.data.Items.length, 100);
                        loading.dismiss();
                    }, 500)
                }
                if (res.data.Items.length) this.loadVideo(res.data.Items);
                this.TotalCount = res.data.TotalCount;
            }
        )
    }

    loadVideo(arr) {
        timer(500).subscribe(() => {
            arr.forEach((e, index) => {
                this.initVideo[`video${e.files.ID}`] = videojs(`video${e.files.ID}`, {
                    controls: true,
                    autoplay: false,
                    "sources": [{
                        src: e.files.DownLoadUrl,
                        type: 'application/x-mpegURL'
                    }],
                });
                this.initVideo[`video${e.files.ID}`].on('loadedmetadata', () => {
                    this.initVideo[`video${e.files.ID}`].on('touchstart', () => {
                        if (this.initVideo[`video${e.files.ID}`].paused()) {
                            this.initVideo[`video${e.files.ID}`].play();
                        } else {
                            this.initVideo[`video${e.files.ID}`].pause();
                        }
                    })
                });

            });
        })
    }

    ionViewDidLeave() {

        this.mySwiper.destroy(true, true);
        for (let i in this.initVideo) {
            this.initVideo[i].dispose();
        }
    }

    //评论
    goComment(item) {
        let modal = this.modalCtrl.create(VideoReplyPage, {item: item});
        modal.onDidDismiss((data) => {
            this.getVideoDetail(item);
        });
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
