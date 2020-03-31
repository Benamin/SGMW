import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../core/common.service";
import {HomeService} from "../../home.service";
import {timer} from "rxjs/observable/timer";
import Swiper from 'swiper';
import {VideoReplyPage} from "../../short-video/video-reply/video-reply";

declare let videojs: any;
declare var Wechat;

@Component({
    selector: 'page-competition-video',
    templateUrl: 'competition-video.html',
})
export class CompetitionVideoPage {

    like: true;
    videoObj;
    comment: '';
    videoList = [];
    itemID;
    loading;

    initVideo = <any>{};

    Page;  //页码
    TopicId;  //搜索关键字
    AreaID;  //类型
    index;  //序号
    TotalCount;
    mySwiper;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService,
                private loadCtrl: LoadingController,
                private modalCtrl: ModalController,
                private homeSer: HomeService) {
        this.Page = this.navParams.get('Page');
        this.TopicId = this.navParams.get('TopicId');
        this.AreaID = this.navParams.get('AreaID');
        this.index = this.navParams.get('index');
    }

    ionViewDidLoad() {
        // this.getShortVideoList();
        this.getList();
    }

    getList() {
        this.loading = this.loadCtrl.create({content: ''});
        this.loading.present();
        const data = {
            TopicId: this.TopicId,
            Page: this.Page,
            PageSize: 10,
            "AreaID": this.AreaID,
            "SortDir": "desc",
            "IsAsc": true,
        };
        this.homeSer.GetShortVideoCompitLists(data).subscribe(
            (res) => {
                this.videoList = res.data.LeaderboardItems.Items;
                this.TotalCount = res.data.LeaderboardItems.TotalCount;
                this.init();
            }
        )
    }

    //swiper&&videojs初始化
    init() {
        let that = this;
        this.mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            speed: 1000,// slide滑动动画时间
            observer: true,
            initialSlide: that.index,
            observeParents: false,
            on: {
                slideChangeTransitionStart: function () {
                },
                slidePrevTransitionStart: function () {  //上滑
                    console.log(this.activeIndex);
                    let nextIndex = this.activeIndex + 1;
                    if (that.initVideo[`video${that.videoList[nextIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[nextIndex].files.ID}`].pause();
                    }
                    if (this.activeIndex == 1 && that.Page > 1) {
                        that.Page--;
                        console.log('pre', this.activeIndex)
                        that.doInfinite('pre');
                    } else if (that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`].play();
                    }
                },
                slideNextTransitionStart: function () {  //下滑
                    console.log(this.activeIndex);
                    let preIndex = this.activeIndex - 1;
                    if (that.initVideo[`video${that.videoList[preIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[preIndex].files.ID}`].pause();
                    }
                    if (this.activeIndex == that.videoList.length - 2 && that.videoList.length != that.TotalCount) {
                        that.Page++;
                        console.log('next', this.activeIndex)
                        that.doInfinite('next');
                    } else if (that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`]) {
                        that.initVideo[`video${that.videoList[this.activeIndex].files.ID}`].play();
                    }
                }
            },
        });
        timer(500).subscribe(() => {
            that.videoList.forEach((e, index) => {
                that.initVideo[`video${e.files.ID}`] = videojs(`video${e.files.ID}`, {
                    controls: true,
                    autoplay: false,
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
    }

    /**
     * 查询上一个&&下一个
     * @param type 滑动方向 pre=>上一个 next=>下一个
     * @param item  //当前item
     */
    doInfinite(type) {
        const data = {
            TopicId: this.TopicId,
            Page: this.Page,
            PageSize: 10,
            "AreaID": this.AreaID,
            "SortDir": "desc",
            "IsAsc": true,
        };
        this.homeSer.GetShortVideoCompitLists(data).subscribe(
            (res) => {
                if (res.data.Items.length) this.loadVideo(res.data.LeaderboardItems.Items);
                if (type == 'pre') {  //上滑
                    this.videoList.unshift(res.data.LeaderboardItems.Items);
                } else {
                    this.videoList = [...this.videoList, ...res.data.LeaderboardItems.Items];
                }
                this.TotalCount = res.data.LeaderboardItems.TotalCount;
            }
        )
    }

    loadVideo(arr) {
        timer(100).subscribe(() => {
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
        for (let i = 0; i < this.mySwiper.length; i++) {
            this.mySwiper[i].destroy(true, true);
        }
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
