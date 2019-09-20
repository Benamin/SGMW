import {AppVersion} from '@ionic-native/app-version';
import {FileOpener} from '@ionic-native/file-opener';
import {File} from '@ionic-native/file';
import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {CommonService} from "./common.service";

@Injectable()
export class AppUpdateService {

    constructor(private appVersion: AppVersion,
                private fileOpener: FileOpener,
                private file: File,
                private commonSer: CommonService,
                private alertCtrl: AlertController,
    ) {
    }

    //下载更新APP
    downloadApp(apkUrl) {
        let alert = this.alertCtrl.create({
            title: '下载进度：0%',
            enableBackdropDismiss: false,
            buttons: ['后台下载']
        });
        const xhr = new XMLHttpRequest();
        xhr.open("GET", apkUrl);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = "blob";
        xhr.addEventListener("loadstart", (ev) => {
            // 开始下载事件：下载进度条的显示
            alert.present();
        });
        xhr.addEventListener("progress", (ev) => {
            // 下载中事件：计算下载进度
            let progress = Math.round(100.0 * ev.loaded / ev.total);
            let title = document.getElementsByClassName('alert-title')[0];
            title && (title.innerHTML = '下载进度：' + progress + '%');
        });
        xhr.addEventListener("load", (ev) => {
            alert.dismiss();
            // 下载完成事件：处理下载文件
            const blob = xhr.response;
            const fileName = "temp.apk";
            if (blob) {
                let path = this.file.externalDataDirectory;
                this.commonSer.alert(`path:${path}`);
                this.file.writeFile(path, fileName, blob, {
                    replace: true
                }).then(
                    () => {
                        this.fileOpener.open(
                            path + fileName,
                            'application/vnd.android.package-archive'
                        ).catch((err) => {
                            this.commonSer.alert('打开apk失败！' + err);
                        })
                    }).catch((err) => {
                    this.commonSer.alert('失败！');
                })
            }
        });
        xhr.addEventListener("loadend", (ev) => {
            // 结束下载事件
        });
        xhr.addEventListener("error", (ev) => {
            this.commonSer.alert('下载apk失败！');
        });
        xhr.addEventListener("abort", (ev) => {
        });
        xhr.send();
    }
}
