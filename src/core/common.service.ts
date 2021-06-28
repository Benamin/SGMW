import {AlertController, ToastController} from "ionic-angular";
import {Injectable} from "@angular/core";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {DatePipe} from "@angular/common";
import {PCURL} from "../app/app.constants";

declare var Wechat;

@Injectable()
export class CommonService {

    constructor(public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                private datePipe: DatePipe,
                private inAppBrowser: InAppBrowser) {
    }

    /**
     * 提示信息 位置：居中，延时2s
     * @param message  提示文字
     * @param callback  提示信息之后执行的方法
     */
    toast(message, callback?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'middle',
            cssClass: 'toastTest',
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    /**
     * alert弹窗  文字居中
     * @param message  弹窗内的文字
     * @param callback  如果有回调方法 就有确定、取消两个按钮，没有回调方法 则只有确认一个按钮
     */
    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: ['取消', {
                    text: "确定",
                    handler: data => {
                        callback();
                    }
                }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: '',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }
    /**
     * alertTest弹窗  文字居中
     * @param message  弹窗内的文字
     * @param callback  如果有回调方法 就有确定、取消两个按钮，没有回调方法 则只有确认一个按钮
     */
     alertTest(message, callback?) {
        if (callback) {
            let alertTest = this.alertCtrl.create({
                title: '提示',
                message: message,
                cssClass:'alertTestCustom',
                buttons: ['取消', {
                    text: "确定",
                    handler: data => {
                        callback();
                    }
                }]
            });
            alertTest.present();
        } else {
            let alertTest = this.alertCtrl.create({
                title: '',
                message: message,
                cssClass:'alertTestCustom',
                buttons: ["确定"]
            });
            alertTest.present();
        }
    }
    /**
     * alert弹窗  文字左对齐
     * @param message  弹窗内的文字
     */
    alertCenter(message) {
        const alert = this.alertCtrl.create({
            title: `提示`,
            message: message,
            cssClass: 'mineAlert',
            buttons: ['确定']
        })
        alert.present();
    }

    /**
     * 通过浏览器打开url
     */
    openUrlByBrowser(url: string): void {
        this.inAppBrowser.create(url, '_system');
    }

    //将时间转化为时间戳 兼容ios
    transFormTime(time) {
        const date = this.datePipe.transform(time, 'yyyy/MM/dd HH:mm:ss');
        const t = new Date(date).getTime();
        return t;
    }

    //将数字转化为时分秒
    toTime(totalTime) {
        let timeText = '';
        let hourse = <any>(Math.floor(totalTime / 3600)).toString();
        hourse = (hourse.length > 1 ? hourse : '0' + hourse);
        let minutes = <any>Math.floor((totalTime - hourse * 3600) / 60).toString();
        minutes = minutes % 60 === 0 ? 0 : minutes;
        minutes = (minutes.length > 1 ? minutes : '0' + minutes);
        let seconds = Math.floor(totalTime % 60).toString();
        seconds = (seconds.length > 1 ? seconds : '0' + seconds);
        if (hourse == "00") {
            timeText = minutes + ":" + seconds;
        } else {
            timeText = hourse + ":" + minutes + ":" + seconds;
        }
        return timeText;
    }

    /**
     * 微信分享
     * @param {Title,description,thumb,webpageUrl} = data
     */
    weChatShare(data) {
        Wechat.share({
            message: {
                title: data.Title, // 标题
                description: data.description, // 简介
                thumb: data.thumb, //动态图片
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: data.webpageUrl   //打开的路径
                }
            },
            scene: Wechat.Scene.SESSION   //好友  朋友圈 --TIMELINE
        }, function () {
            // alert("Success");
        }, function (reason) {
            // alert("Failed: " + reason);
        });
    }

    // base64转blob
    base64ToBlob(base64Data) {
        let arr = base64Data.split(','),
            fileType = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            l = bstr.length,
            u8Arr = new Uint8Array(l);

        while (l--) {
            u8Arr[l] = bstr.charCodeAt(l);
        }
        return new Blob([u8Arr], {
            type: fileType
        });
    };

    // blob转file
    blobToFile(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    };

    //判断文件 图片 or 视频
    ImageOrVideo(fileName) {
        if (!fileName) return false;
        let imgType = ["gif", "jpeg", "jpg", "bmp", "png"];
        let videoType = ["avi", "wmv", "mkv", "mp4", "mov", "rm", "3gp", "flv", "mpg", "rmvb"];
        if (RegExp("\.(" + imgType.join("|") + ")$", "i").test(fileName.toLowerCase())) {
            return 'image';
        } else if (RegExp("\.(" + videoType.join("|") + ")$", "i").test(fileName.toLowerCase())) {
            return 'video';
        } else {
            return "";
        }

    }
}
