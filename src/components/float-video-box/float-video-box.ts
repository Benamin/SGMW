import {Component, Input} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {defaultImg} from "../../app/app.constants";
import {NavParams, Platform, ViewController} from "ionic-angular";
import {AppService} from "../../app/app.service";
import {StatusBar} from "@ionic-native/status-bar";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {CommonService} from "../../core/common.service";
import {GlobalData} from "../../core/GlobleData";


declare let amp: any;

@Component({
    selector: 'float-video-box',
    templateUrl: 'float-video-box.html'
})
export class FloatVideoBoxComponent {
    @Input() isHidden;

    defaultImg = defaultImg;
    video;
    videoEle;
    videoSrc;

    constructor(private platform: Platform,
                public viewCtrl: ViewController,
                private appSer: AppService,
                private statusBar: StatusBar,
                private navParams: NavParams,
                private global: GlobalData,
                private screenOrientation: ScreenOrientation,
                public commonSer: CommonService,) {
    }

    ionViewDidLoad() {
        this.videoSrc = this.navParams.get('src');
        this.initVideo();
    }

    initVideo() {
        const videoNum = this.global.videoNum;
        this.videoEle = `video${videoNum}`;
        timer(100).subscribe(() => {
            this.video = videojs(this.videoEle, {
                muted: false,
                "sources": [{
                    src: this.videoSrc,
                    type: 'application/x-mpegURL'
                }],
                controls: true,
                autoplay: true
            }, (event) => {
                this.video.on('fullscreenchange', () => {
                    if (this.video.isFullscreen()) {  //全屏
                        if (this.platform.is('ios')) {
                            this.appSer.setIOS('platformIOS');
                            this.appSer.setIOS('videoReset');
                        }
                        this.screenOrientation.lock('landscape');  //横屏
                        this.statusBar.hide();
                    }
                    if (!this.video.isFullscreen()) {
                        this.screenOrientation.lock('portrait');  //锁定竖屏
                        this.statusBar.show();
                    }
                });
                this.video.on('ended', () => {
                    this.screenOrientation.lock('portrait');  //锁定竖屏
                    if (this.platform.is('ios')) {
                        this.appSer.setIOS('videoReset');
                        document.getElementsByTagName('video')[0].webkitExitFullscreen();
                    }
                    if (this.platform.is('android')) {
                        this.video.exitFullscreen();
                    }
                    this.statusBar.show();
                })
                this.video.on('touchstart', () => {
                    if (this.video.paused()) {
                        this.video.play();
                    } else {
                        this.video.pause();
                    }
                })
                this.global.videoNum++;
            });
        });
    }

    destroy() {
        this.viewCtrl.dismiss();
        if (this.video) {
            this.video.dispose();
        }
    }

}
