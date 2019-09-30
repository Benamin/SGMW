import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

declare let amp: any;

@IonicPage()
@Component({
    selector: 'page-test',
    templateUrl: 'test.html',
})
export class TestPage {

    myPlayer;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.myPlayer = amp('vid1', { /* Options */
                "nativeControlsForTouch": false,
                autoplay: false,
                controls: true,
                width: "640",
                height: "400",
                poster: ""
            }, ()=> {
                console.log('Good to go!');
            }
        );
        this.myPlayer.src([{
            // src: "http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest",
            src:'http://elearningmedia.sgmw.com.cn/5fc83fc0-113b-49f4-9ec6-9663cceaf354/%E4%BA%94%E8%8F%B1%E5%AE%8F%E5%85%89Plus%E4%BA%A7%E5%93%81%E7%AE%80%E4%BB%8B%E9%BB%84%E6%98%8C%E6%A0%87.ism/manifest(format=m3u8-aapl)',
            type: "application/vnd.ms-sstr+xml"
        }]);
        //enterFullscreen()
    }

    ionViewDidLeave() {
        this.myPlayer.dispose();
    }

    changeVide1(){
        this.myPlayer.src([{
            src: "http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest",
            // src:'http://elearningmedia.sgmw.com.cn/5fc83fc0-113b-49f4-9ec6-9663cceaf354/%E4%BA%94%E8%8F%B1%E5%AE%8F%E5%85%89Plus%E4%BA%A7%E5%93%81%E7%AE%80%E4%BB%8B%E9%BB%84%E6%98%8C%E6%A0%87.ism/manifest(format=m3u8-aapl)',
            type: "application/vnd.ms-sstr+xml"
        }]);
    }

    changeVide2(){
        this.myPlayer.src([{
            // src: "http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest",
            src:'http://elearningmedia.sgmw.com.cn/5fc83fc0-113b-49f4-9ec6-9663cceaf354/%E4%BA%94%E8%8F%B1%E5%AE%8F%E5%85%89Plus%E4%BA%A7%E5%93%81%E7%AE%80%E4%BB%8B%E9%BB%84%E6%98%8C%E6%A0%87.ism/manifest(format=m3u8-aapl)',
            type: "application/vnd.ms-sstr+xml"
        }]);
    }

}
