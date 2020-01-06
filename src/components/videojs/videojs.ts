import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StatusBar} from "@ionic-native/status-bar";
import {GlobalData} from "../../core/GlobleData";
import {VideoJsProvider} from "../../providers/video-js/video-js";
import {LearnService} from "../../pages/learning/learn.service";
import {AppService} from "../../app/app.service";
import {CommonService} from "../../core/common.service";

declare let videojs: any;

@Component({
    selector: 'videojs',
    templateUrl: 'videojs.html'
})
export class VideojsComponent implements OnDestroy {
    @ViewChild('example_video') example_video: ElementRef;

    videoPoster: string;
    videoInfo;
    video;
    videoEle;
    isPlay = false;   //判断视频播放状态

    constructor(private mobileAccess: MobileAccessibility,
                private statusBar: StatusBar,
                private commonSer: CommonService,
                private global: GlobalData,
                private appSer: AppService,
                private learnSer: LearnService,
                private vjsProvider: VideoJsProvider,
                private screenOrientation: ScreenOrientation) {
        const videoNum = this.global.videoNum;
        this.videoEle = `video${videoNum}`;
        timer(100).subscribe(() => {
            this.video = videojs(this.videoEle, {
                muted: false,
                controls: true,
                autoplay: true
            }, (event) => {
                this.screenOrientation.onChange().subscribe(
                    (res) => {
                        console.log(res);
                    }
                );
                this.video.on('fullscreenchange', () => {
                    if (!this.isPlay) return
                    if (this.video.isFullscreen()) {  //全屏
                        this.screenOrientation.lock('landscape');  //横屏
                        this.statusBar.hide();
                    }
                    if (!this.video.isFullscreen()) {
                        this.screenOrientation.lock('portrait');  //锁定竖屏
                        this.statusBar.show();
                    }
                });
                this.video.on('ended', () => {
                    console.log('video end')
                    this.isPlay = false;
                    this.screenOrientation.lock('portrait');  //锁定竖屏
                    document.webkitExitFullscreen();  //退出全屏
                    this.statusBar.show();
                    this.updateVideoStatus();
                })
                console.log(`播放器videojs${videoNum},初始化成功`);
                this.global.videoNum++;
            });
        });
    }


    //更新视频学习状态
    updateVideoStatus() {
        const data = {
            cid: this.videoInfo.TeachingID
        }
        this.learnSer.UpdateVideoStudySum(data).subscribe(
            (res) => {
                if (res.data) {
                    const data = {
                        type: 'videoPlayEnd',
                        source: 'videojs',
                    };
                    this.global.subscribeDone = false;
                    this.appSer.setFile(data);  //主页面接收消息
                } else {
                    this.commonSer.toast('学习进度更新失败')
                }
            }
        )
    }

    //页面离开暂停
    pageLeave() {
        if (this.video['player_']) {
            this.video.pause();
        }
    }

    destroy() {
        if (this.video) {
            console.log('dispose video');
            this.video.dispose();
        }
    }

    removeDanmu() {
        this.video.removeChild('danmu');
    }

    ngOnDestroy(): void {

    }

    get poster() {
        return this.videoPoster;
    }

    @Input() set poster(poster) {
        this.videoPoster = poster;
    }

    get GetVideo() {
        return this.videoInfo;
    }

    @Input() set GetVideo(videoInfo) {
        if (this.video && videoInfo) {
            this.isPlay = true;
            this.video.src({type: 'application/x-mpegURL', src: videoInfo.fileUrl});
            this.videoInfo = videoInfo;
            this.video.removeChild('TitleBar');
            // this.video.addChild(`danmu`,{text: `${videoInfo.DisplayName}`});
            this.video.addChild('TitleBar', {text: `${videoInfo.DisplayName}`});
        }
    }

}
