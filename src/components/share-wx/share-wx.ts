import {Component, Type} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {CommonService} from "../../core/common.service";
import {defaultLogo, PCURL} from "../../app/app.constants";

declare var Wechat;

@Component({
    selector: 'share-wx',
    templateUrl: 'share-wx.html'
})
export class ShareWxComponent {

    data;
    defaultLogo = defaultLogo;

    constructor(private viewCtrl: ViewController,
                private params: NavParams,
                private commonSer: CommonService) {
        this.data = this.params.get('data');
    }

    //分享到微信
    closeModal() {
        this.viewCtrl.dismiss();
    }

    /**
     * 微信分享
     * @param type wx=微信好友 pyq=微信朋友圈
     * @param UrlType 分享的网页 bbsdetails=动态详情 Course、learning=课程
     * @param UrlType  consultation=资讯 learning=课程 test=考试 shortVideo=短视频
     */
    shareWX(type) {
        const pcUrl = PCURL;
        const webpageUrl = `${pcUrl}${this.data.paramsUrl}`
        console.log("分享微信", this.data, webpageUrl);
        Wechat.share({
            message: {
                title: this.data.title, // 标题
                description: this.data.description, // 简介
                thumb: this.data.thumb, //动态图片
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: webpageUrl   //打开的路径
                }
            },
            scene: type === 'wx' ? Wechat.Scene.SESSION : Wechat.Scene.TIMELINE   //SESSION=好友  朋友圈=TIMELINE
        }, function () {
            // alert("Success");
        }, function (reason) {
            // alert("Failed: " + reason);
        });
        this.viewCtrl.dismiss()
    }

}
