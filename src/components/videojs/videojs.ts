import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
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
import {a} from "@angular/core/src/render3";

declare let amp: any;

@Component({
    selector: 'videojs',
    templateUrl: 'videojs.html'
})
export class VideojsComponent implements OnDestroy {
    @ViewChild('example_video') example_video: ElementRef;
    @Output() showHeader = new EventEmitter<any>();

    videoPoster: string;
    videoInfo;
    myPlayer;
    videoEle;
    isPlay = false;   //判断视频播放状态

    videoPlayTime = 1;  //播放进度百分比
    videoDuration = 1;  //视频总时长
    IsPass = false;  //本视频是否观看完毕
    isFullScreen = false;  //视频是否全屏

    eleObj = <any>{};

    currentTime = 0;

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
        this.listenerApp();
        timer(100).subscribe(() => {
            this.myPlayer = amp(this.videoEle, {
                "muted": false,
                "controls": true,
                "autoplay": true,
                "language": "zh-hans",
                "enableFullscreen": true,
                "playbackSpeed": {
                    "enabled": true,
                    "initialSpeed": 1.0,
                    "speedLevels": [
                        {name: "x2.0", value: 2},
                        {name: "x1.75", value: 1.75},
                        {name: "x1.5", value: 1.5},
                        {name: "x1.25", value: 1.25},
                        {name: "x0.5", value: 0.5},
                    ]
                },
                "plugins": {
                    "hotkeys": {
                        //optional settings
                        "volumeStep": 0.1,
                        "seekStep": 5,
                        "enableMute": true,
                        "enableFullscreen": true,
                        "enableNumbers": true,
                        "enableJogStyle": false
                    }
                }
            }, (event) => {
                this.myPlayer.addEventListener('fullscreenchange', () => {
                    console.log("myPlayer fullscreenchange")
                    if (!this.isPlay) return;
                    if (this.myPlayer.isFullscreen()) {  //全屏
                        if (this.platform.is('ios')) {
                            this.appSer.setIOS('platformIOS');
                            this.appSer.setIOS('videoReset');
                        }
                    }
                });
                this.myPlayer.addEventListener('ended', () => {
                    this.isPlay = false;
                    this.changeScreen2();
                    this.statusBar.show();
                    //视频是附件则不更新进度
                    if (!this.videoInfo.IsAttachment) {
                        this.updateVideoStatus();
                    }
                })
                //视频加载完毕 获取视频总时长  加载全屏事件
                this.myPlayer.addEventListener("loadeddata", () => {
                    if (this.currentTime > 0) {
                        this.myPlayer.currentTime(this.currentTime);
                    }
                    this.videoDuration = this.myPlayer.duration();
                    this.eleObj.videojsEle = <any>document.querySelector(".video-js");
                    this.eleObj.controlbaricons = document.querySelector(".amp-controlbaricons-right");
                    this.eleObj.screenWidth = document.body.clientWidth;
                    this.eleObj.screenHeight = document.body.clientHeight;

                    let myFsBtn = document.querySelector(".my-fullscreen-btn");
                    if (!myFsBtn) {  //不存在则重新添加
                        this.eleObj.span = document.createElement("span");
                        this.eleObj.span.className = "my-fullscreen-btn my-fullscreen-btn-open";
                        this.eleObj.controlbaricons.appendChild(this.eleObj.span);
                        myFsBtn = document.querySelector(".my-fullscreen-btn");
                    }
                    myFsBtn.addEventListener("click", (event) => {
                        this.changeScreen();
                    })
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
                    this.saveVideoProcess(currentTime, this.videoInfo.ID);
                });
                //视频播放
                // this.myPlayer.addEventListener("play", () => {
                // })
                this.global.videoNum++;
            });
        });
    }

    //手动点击全屏按钮横屏or竖屏
    changeScreen() {
        if (this.isFullScreen) {  // 如果是横屏则变成竖屏
            this.eleObj.span.className = "my-fullscreen-btn my-fullscreen-btn-open";
            this.isFullScreen = false;
            this.statusBar.show();
            this.showHeader.emit("show");
            this.screenOrientation.lock('portrait');  //竖屏
            this.eleObj.videojsEle.style.width = this.eleObj.screenWidth + "px";
            this.eleObj.videojsEle.style.height = "200px";
        } else {  //如果是竖屏则变成横屏
            this.eleObj.span.className = "my-fullscreen-btn my-fullscreen-btn-close";
            this.isFullScreen = true;
            this.statusBar.hide();
            this.showHeader.emit("hide");
            this.screenOrientation.lock('landscape');  //横屏
            this.eleObj.videojsEle.style.width = this.eleObj.screenHeight + "px";
            this.eleObj.videojsEle.style.height = this.eleObj.screenWidth + "px";
        }
    }

    //播放结束自动触发 保持竖屏
    changeScreen2() {
        this.eleObj.span.className = "my-fullscreen-btn my-fullscreen-btn-open";
        this.isFullScreen = false;
        this.statusBar.show();
        this.showHeader.emit("show");
        this.screenOrientation.lock('portrait');  //竖屏
        this.eleObj.videojsEle.style.width = this.eleObj.screenWidth + "px";
        this.eleObj.videojsEle.style.height = "200px";
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
        }
    }

    /**
     * 存储视频播放进度
     * @param currentTime  播放时间
     * @param ID 视频ID
     */
    saveVideoProcess(currentTime, ID) {
        const currentTime2 = <any>Number(currentTime).toFixed(1);
        if (currentTime2 < 1) {
            return
        }
        this.storage.get("currentTime").then((value: any) => {
            if (value && value.length > 0) {
                if (value.toString().includes(ID)) {  //判断是否存在当前视频
                    value.forEach((e, index) => {  //存在替换时间
                        if (e && e.includes(ID)) {
                            value[index] = `${ID}:${currentTime2}`;
                        }
                    });
                } else {  //没有则重新添加
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
            if (videoInfo.IsPass || videoInfo.IsAttachment) {
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
                                this.currentTime = Number(time);
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

    //监听软件是否进入后台 --如果进入后台
    listenerApp() {
        document.addEventListener("resume", () => {
            if (this.myPlayer) {
                this.myPlayer.play();
            }
        }, false);
        document.addEventListener("pause", () => {
            if (this.myPlayer) {
                this.myPlayer.pause();
            }
        }, false);
    }
}
