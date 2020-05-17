import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {timer} from "rxjs/observable/timer";
import {StatusBar} from "@ionic-native/status-bar";
import {GlobalData} from "../../../core/GlobleData";
import {AppService} from "../../../app/app.service";
import {LearnService} from "../learn.service";
import {VideoJsProvider} from "../../../providers/video-js/video-js";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {defaultImg} from "../../../app/app.constants";

declare let videojs: any;

@Component({
    selector: 'page-look-talk-video-exam',
    templateUrl: 'look-talk-video-exam.html',
})
export class LookTalkVideoExamPage {

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: null,
        ExamInfo: null
    };
    doneTotal = 0;
    video;

    defaultImg = defaultImg;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public loadCtrl: LoadingController,
                public homeSer: HomeService,
                private statusBar: StatusBar,
                private global: GlobalData,
                private appSer: AppService,
                private platform: Platform,
                private learnSer: LearnService,
                private vjsProvider: VideoJsProvider,
                private screenOrientation: ScreenOrientation,
                public commonSer: CommonService) {
    }

    ionViewDidLoad() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const item = this.navParams.get('item');
        const data = {
            Fid: item.Fid
        };
        this.homeSer.getPaperDetailByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toast(res.Message);
                }
                this.exam.QnAInfos = res.data.QnAInfos;
                this.exam.ExamInfo = res.data.ExamInfo;
                if (this.exam.ExamInfo.JopType == 2) {
                    this.initVideo();
                }
                loading.dismiss();
            }
        )
    }

    initVideo() {
        timer(100).subscribe(() => {
            this.video = videojs('videoExam', {
                muted: false,
                type: 'application/x-mpegURL',
                src: this.exam.QnAInfos[0].StuAnswer,
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
            });
        });
    }

}
