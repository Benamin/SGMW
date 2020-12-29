import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StatusBar} from "@ionic-native/status-bar";
import {GlobalData} from "../../core/GlobleData";
import {LearnService} from "../../pages/learning/learn.service";
import {AppService} from "../../app/app.service";
import {CommonService} from "../../core/common.service";
import {Platform} from "ionic-angular";
import {Storage} from "@ionic/storage";

declare let amp: any;

@Component({
    selector: 'videojs',
    templateUrl: 'videojs.html'
})
export class VideojsComponent implements OnDestroy {
    @ViewChild('example_video') example_video: ElementRef;

    videoPoster: string;
    videoInfo;
    myPlayer;
    videoEle;
    isPlay = false;   //判断视频播放状态

    videoPlayTime = 1;  //播放进度百分比
    videoDuration = 1;  //视频总时长
    IsPass = false;  //本视频是否观看完毕

    constructor(private mobileAccess: MobileAccessibility,
                private statusBar: StatusBar,
                private commonSer: CommonService,
                private global: GlobalData,
                private appSer: AppService,
                private platform: Platform,
                private storage: Storage,
                private learnSer: LearnService,
                private screenOrientation: ScreenOrientation) {
        const videoNum = this.global.videoNum;
        this.videoEle = `video${videoNum}`;

        timer(100).subscribe(() => {
            this.myPlayer = amp(this.videoEle, {
                muted: false,
                controls: true,
                autoplay: true,
                "language": "zh-hans",
                "playbackSpeed": {
                    "enabled": true,
                    initialSpeed: 1.0,
                    speedLevels: [
                        {name: "x2.0", value: 2},
                        {name: "x1.75", value: 1.75},
                        {name: "x1.5", value: 1.5},
                        {name: "x1.25", value: 1.25},
                        {name: "x0.5", value: 0.5},
                    ]
                }
            }, (event) => {
                this.myPlayer.addEventListener('fullscreenchange', () => {
                    if (!this.isPlay) return;
                    if (this.myPlayer.isFullscreen()) {  //全屏
                        if (this.platform.is('ios')) {
                            this.appSer.setIOS('platformIOS');
                            this.appSer.setIOS('videoReset');
                        }
                        this.screenOrientation.lock('landscape');  //横屏
                        this.statusBar.hide();
                    }
                    if (!this.myPlayer.isFullscreen()) {
                        this.screenOrientation.lock('portrait');  //锁定竖屏
                        this.statusBar.show();
                    }
                });
                this.myPlayer.addEventListener('ended', () => {
                    this.isPlay = false;
                    this.screenOrientation.lock('portrait');  //锁定竖屏
                    if (this.platform.is('ios')) {
                        this.appSer.setIOS('videoReset');
                        document.getElementsByTagName('video')[0].webkitExitFullscreen();
                    }
                    if (this.platform.is('android')) {
                        this.myPlayer.exitFullscreen();
                    }
                    this.statusBar.show();
                    this.updateVideoStatus();
                })
                //获取视频总时长
                this.myPlayer.addEventListener("loadeddata", () => {
                    this.videoDuration = this.myPlayer.duration();
                })
                //视频暂停时
                // this.myPlayer.addEventListener("touchstart", () => {
                //     if (this.myPlayer.paused()) {
                //         this.myPlayer.play();
                //     } else {
                //         this.myPlayer.pause();
                //     }
                // });
                //播放时间变化
                this.myPlayer.addEventListener("timeupdate", () => {
                    let currentTime = this.myPlayer.currentTime().toFixed(2);
                    if (currentTime > 0) {
                        this.videoPlayTime = <any>((currentTime / this.videoDuration) * 100).toFixed(2);
                    }
                });
                //视频播放
                // this.myPlayer.addEventListener("play", () => {
                // })
                this.global.videoNum++;
            });
        });
    }


    //更新视频学习状态
    updateVideoStatus() {
        const data = {
            cid: this.videoInfo.TeachingID,
            postsCertID: this.global.PostsCertID
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
        if (this.myPlayer['player_']) {
            this.myPlayer.pause();
            if (this.videoInfo) {
                this.saveVideoProcess(this.myPlayer.currentTime(), this.videoInfo.ID);
            }
        }
    }

    //存储视频播放进度
    saveVideoProcess(currentTime, ID) {
        const currentTime2 = <any>Number(currentTime).toFixed(1);
        if (currentTime2 < 1) {
            return
        }
        this.storage.get("currentTime").then((value: any) => {
            if (value && value.length > 0) {
                if (value.toString().includes(ID)) {
                    value.forEach((e, index) => {
                        if (e && e.includes(ID)) {
                            value[index] = `${ID}:${currentTime2}`;
                        }
                    });
                } else {
                    value.splice(9, 1);
                    value.unshift(`${ID}:${currentTime2}`);
                }
                this.storage.set('currentTime', value);
            }
        })
    }


    //页面离开，切换视频
    destroy() {
        if (this.myPlayer) {
            // this.video.dispose();
        }
    }

    removeDanmu() {
        this.myPlayer.removeChild('danmu');
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

    //跳转视频播放进度
    jumpVideoProcess() {
    }

    @Input() set GetVideo(videoInfo) {
        if (this.myPlayer && videoInfo) {

            //存储视频播放进度
            if (this.myPlayer.currentTime()) {
                this.saveVideoProcess(this.myPlayer.currentTime(), this.videoInfo.ID);
            }

            this.isPlay = true;

            let type = 'application/x-mpegURL';
            if (this.platform.is('android')) {
                videoInfo.fileUrl = videoInfo.fileUrl.replace('manifest(format=m3u8-aapl)', 'manifest(format=mpd-time-csf)')
                videoInfo.fileUrl = videoInfo.fileUrl.replace('manifest(format=m3u8-cmaf)', 'manifest(format=mpd-time-cmaf)')
                type = "application/dash+xml"
            }
            this.myPlayer.src({type: type, src: videoInfo.fileUrl});

            //禁止or启用拖动进度条
            let control = <any>document.querySelector(".vjs-progress-control")
            if (videoInfo.IsPass) {
                control.style.pointerEvents = "auto";  //启用
            } else {
                control.style.pointerEvents = "none";
            }
            this.videoInfo = videoInfo;

            //继续播放component
            this.storage.get('currentTime').then((value: any) => {
                if (value && value.length > 0) {
                    value.forEach(e => {
                        if (e && e.includes(this.videoInfo.ID)) {
                            const time = e.split(':')[1];
                            if (Number(time) > 0) {
                                this.myPlayer.continuePlay({
                                    time: this.commonSer.toTime(time),
                                    num: time
                                });
                            }
                        }
                    })
                }
            })

            // //标题component
            // this.myPlayer.titleOverlay({
            //     "name": videoInfo.DisplayName,
            //     "horizontalPosition": "left",
            //     "verticalPosition": "center"
            // })
        }
    }

}
