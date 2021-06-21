import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {defaultHeadPhoto, PCURL} from "../../app/app.constants";
import {CommonService} from "../../core/common.service";
import {ModalController, NavController} from "ionic-angular";
import {ForumService} from "../../pages/forum/forum.service";
import {PersonalCenterPage} from "../../pages/home/personal-center/personal-center";
import {Storage} from "@ionic/storage";
import {PostsContentComponent} from "../../pages/forum/posts-content/posts-content.component";
import {ShareWxComponent} from "../share-wx/share-wx";
import {PostlistComponent} from "../../pages/forum/postlist/postlist.component";
import {timer} from "rxjs/observable/timer";

declare var Wechat;
declare let videojs: any;

@Component({
    selector: 'app-forum-list-time',
    templateUrl: './forum-list-time.component.html'
})


export class ForumListTimeComponent {

    @Input() scene;
    @Output() share = new EventEmitter();

    defaultImg = './assets/imgs/competition/fengmian@2x.png'
    defaultHeadPhoto = defaultHeadPhoto;
    PosterList = [];
    videoObj = <any>{};


    constructor(public commonSer: CommonService, public navCtrl: NavController, private modalCtrl: ModalController, private storage: Storage, private serve: ForumService,) {
    }

    @Input() set followList(event) {
        this.PosterList = event.map(e => {
            e.PostTimeFormatted = e.PostTimeFormatted.replace(/-/g, '/');
            return e;
        })
        if (this.PosterList.length == 0) {
            Object.keys(this.videoObj).forEach(e => {
                // this.videoObj[e].dispose();
            })
        } else {
            // this.initVideo();
        }
    }

    initVideo() {
        timer(100).subscribe(() => {
            this.PosterList.forEach((e, index) => {
                if (e.Pvideo) {
                    let videoID = `${this.scene}_video_${e.Pvideo.ID}`;
                    let videoEle = document.getElementById(videoID);
                    if (!videoEle) {
                        console.log("videoEle未加载完成")
                        return
                    }
                    console.log("videoEle加载完成", videoEle);
                    if (this.videoObj[videoID]) {
                        this.videoObj[videoID].dispose();
                        let videoBox = document.getElementById('videoBox_' + e.Pvideo.ID);
                        videoBox.innerHTML = `<video id="${this.scene + '_video_' + e.Pvideo.ID}" class="video-js sgmw-video-js"
                           playsinline="true" webkit-playsinline="true"
                           width="100%" height="100%" controls
                           poster="${e.Pvideo.CoverUrl}"></video>`
                    }
                    console.log(this.videoObj[videoID]);
                    this.videoObj[videoID] = videojs(videoID, {
                        controls: true,
                        autoplay: false,
                        "sources": [{
                            //android 的用视频流地址播放 会出现视频画面模糊的问题 暂未解决只能根据视频地址播放
                            src: e.Pvideo.files.AttachmentUrl,
                            // src: e.Pvideo.files.DownLoadUrl,
                            type: 'application/x-mpegURL'
                        }],
                    })

                }
            });
        })
    }

    //详情
    goToDetail(item) {
        this.videoStop();
        this.navCtrl.push(PostsContentComponent, {data: item});
    }


    //点赞
    handleLike(item, e) {
        e.stopPropagation();
        if (item.IsGiveLike) {
            item['IsGiveLike'] = false;
            if (item.LikeCount > 0) item.LikeCount--;
        } else {
            item['IsGiveLike'] = true;
            item.LikeCount++;
        }
        console.log('' + item.IsGiveLike);
        if (item.isClick) return;

        item.isClick = true;
        setTimeout(() => {
            handleLike();
        }, 3000)

        let handleLike = () => {
            console.log('执行，' + item.IsGiveLike);
            if (item.IsGiveLike) {
                this.serve.forum_post_like(item.Id).subscribe((res: any) => {
                    item.isClick = false;
                });
            } else {
                this.serve.forum_post_cancellike(item.Id).subscribe((res: any) => {
                    item.isClick = false;
                });
            }
        }
    }

    // 微信分享
    wxShare(data) {
        let description = data.ContentWithoutHtml.replace(/\&nbsp;/g, '');
        let thumb = '';
        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        if (data.Images.length > 0) {
            thumb = data.Images[0].Src;
        }
        const obj = {
            title: data.Title,
            description: description,
            thumb: thumb,
            paramsUrl: `/#/bbsdetails/${data.Id}`
        }
        let modal = this.modalCtrl.create(ShareWxComponent, {data: obj});
        modal.present();
    }

    //他人详情
    toPersonInfo(item) {

        this.storage.get('user').then(value => {
            if (item.Poster !== value.MainUserID) {
                this.videoStop();
                this.navCtrl.push(PersonalCenterPage, {Poster: item.Poster})
            }
        });
    }

    videoStop() {
        const videoArr = <any>document.querySelectorAll("video");
        videoArr.forEach(e => e.pause());
    }

    //话题列表
    toPostList(item) {
        const data = {
            Id: item.TopicId,
            CoverImage: item.TopicImageUrl,
            Name: item.TopicName,
            navli: "话题"
        }
        this.navCtrl.push(PostlistComponent, {data: data});
    }

    getDuration(ev, item) {
        let value = Math.ceil(ev.target.duration);
        item.duration = value;
    }

    //列表视频不同时播放
    clickVideo(e) {
        e.stopPropagation();
        const videoArr = document.querySelectorAll("video");
        for (let i = 0; i < videoArr.length; i++) {
            if (videoArr[i] != e.target) {
                videoArr[i].pause();
            }
        }
    }
}
