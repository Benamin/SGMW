import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

declare let videojs: any;

@IonicPage()
@Component({
    selector: 'page-test',
    templateUrl: 'test.html',
})
export class TestPage {

    videojs;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.videojs = videojs('example_video_1');
        this.videojs.src({
            src: "http://elearningmedia.sgmw.com.cn/5fc83fc0-113b-49f4-9ec6-9663cceaf354/五菱宏光Plus产品简介黄昌标.ism/manifest(format=m3u8-aapl)",
            // src: "http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8",
            type: "application/x-mpegURL"
        })
        // this.videojs.play();

    }

    ionViewDidLeave() {
        console.log('dispose')
        this.videojs.dispose();
    }

}
