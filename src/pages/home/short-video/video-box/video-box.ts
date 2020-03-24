import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import Swiper from 'swiper';
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home.service";
import {CommonService} from "../../../../core/common.service";
import {VideoReplyPage} from "../video-reply/video-reply";

declare let videojs: any;

@Component({
    selector: 'page-video-box',
    templateUrl: 'video-box.html',
})
export class VideoBoxPage {
    like: true
    videoObj;
    comment: '';
    videoList;

    initVideo = <any>{};

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService,
                private modalCtrl: ModalController,
                private homeSer: HomeService) {
    }

    ionViewDidLoad() {
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
                    })
                })
            }
        )

        console.log(this.videoObj);
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
            console.log('modal.onDidDismiss:', data);
        })
        console.log('modal.present')
        modal.present();
    }

    //点赞or取消点赞
    handleLike(item, option) {
        const data = {
            "SVID": item.files.ID,
            "IsADD": option
        };
        item.IsLike = option == 1;
        this.homeSer.shortVideoLike(data).subscribe(
            (res) => {
                if (res.data) {

                } else {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

}
