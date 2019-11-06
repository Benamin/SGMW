import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StatusBar} from "@ionic-native/status-bar";
import {GlobalData} from "../../core/GlobleData";
import {VideoJsProvider} from "../../providers/video-js/video-js";

declare let videojs: any;

@Component({
    selector: 'videojs',
    templateUrl: 'videojs.html'
})
export class VideojsComponent implements OnDestroy {
    @ViewChild('example_video') example_video: ElementRef;

    videoPoster: string;
    videoSrc: string;
    video;
    videoEle;

    constructor(private mobileAccess: MobileAccessibility,
                private statusBar: StatusBar,
                private globleData: GlobalData,
                private vjsProvider:VideoJsProvider,
                private screenOrientation: ScreenOrientation) {
        const videoNum = this.globleData.videoNum;
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
                    if (this.video.isFullscreen()) {  //全屏
                        this.screenOrientation.lock('landscape');  //横屏
                        this.statusBar.hide();
                    }
                    if (!this.video.isFullscreen()) {
                        this.screenOrientation.lock('portrait');  //锁定竖屏
                        this.statusBar.show();
                    }
                    console.log(this.video.isFullscreen());
                })
                console.log('videojs播放器初始化成功');
                this.globleData.videoNum++;
            })
            this.video.addChild('TitleBar', {text: "标题"})
        });
    }

    //页面离开暂停
    pageLeave() {
        if (this.video['player_']) {
            this.video.pause();
        }
    }

    destroy() {
        if (this.video) {
            this.video.dispose();
        }
    }

    ngOnDestroy(): void {

    }

    get src() {
        return this.videoSrc;
    }

    @Input() set src(src) {
        if (this.video && src) {
            this.video.src({type: 'application/x-mpegURL', src: src});
            this.videoSrc = src;
        }
    }

    get poster() {
        return this.videoPoster;
    }

    @Input() set poster(poster) {
        this.videoPoster = poster;
    }

}
