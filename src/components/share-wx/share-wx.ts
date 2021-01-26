import {Component, Type} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {CommonService} from "../../core/common.service";
import {PCURL} from "../../app/app.constants";

declare var Wechat;

@Component({
    selector: 'share-wx',
    templateUrl: 'share-wx.html'
})
export class ShareWxComponent {

    data;

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
     */
    shareWX(type) {
        let img = this.data.Images;
        let description = this.data.ContentWithoutHtml || "";
        let thumb = '';

        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        if (img && img.length > 0) {
            thumb = img[0].Src || '';
        }

        const pcUrl = PCURL;
        const obj = {
            Title: this.data.Title,
            description: description,
            thumb: thumb,
            webpageUrl: `${pcUrl}bbsdetails/${this.data.Id}`
        }
        console.log(obj);
        Wechat.share({
            message: {
                title: obj.Title, // 标题
                description: obj.description, // 简介
                thumb: obj.thumb, //帖子图片
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: obj.webpageUrl   //打开的路径
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
