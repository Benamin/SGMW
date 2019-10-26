import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {StatusBar} from "@ionic-native/status-bar";

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

    constructor(private mobileAccess: MobileAccessibility,
                private statusBar:StatusBar,
                private screenOrientation: ScreenOrientation) {
        timer(100).subscribe(() => {
            this.video = videojs("#example_video", {
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
                console.log('videojs播放器初始化成功')
            })
        });
    }

    ngOnDestroy(): void {
        this.video.dispose();
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
