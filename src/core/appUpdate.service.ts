import {AppVersion} from '@ionic-native/app-version';
import {FileOpener} from '@ionic-native/file-opener';
import {File} from '@ionic-native/file';
import {Injectable} from '@angular/core';
import {AlertController, Platform} from 'ionic-angular';
import {CommonService} from "./common.service";
import {LoginService} from "../pages/login/login.service";
import {Observable} from "rxjs";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";

@Injectable()
export class AppUpdateService {

    constructor(private appVersion: AppVersion,
                private fileOpener: FileOpener,
                private file: File,
                public transfer: FileTransfer,
                private platform: Platform,
                private loginSer: LoginService,
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

        const fileTransfer: FileTransferObject = this.transfer.create();
        const arr = apkUrl.split("/");
        const apk = arr[arr.length - 1];
        let saveurl = this.file.externalDataDirectory
            ? this.file.externalDataDirectory
            : this.file.dataDirectory;
        const apkname = saveurl + "download/" + apk; //apk保存的目录
        fileTransfer.download(apkUrl, apkname).then(
            (entry) => {
                this.fileOpener
                    .open(entry.toURL(), 'application/vnd.android.package-archive')
                    .then((res) => {
                    })
                    .catch((e) => {
                        alert && alert.dismiss();
                        const alertBrowser = this.alertCtrl.create({
                            title: "前往网页下载",
                            message: "本地升级失败",
                            buttons: [
                                {
                                    text: "确定",
                                    handler: () => {
                                        this.commonSer.openUrlByBrowser(apkUrl);
                                    },
                                },
                            ],
                        });
                        alertBrowser.present();
                    });
            },
            (error) => {
                alert && alert.dismiss();
                const alertBrowser = this.alertCtrl.create({
                    title: "前往网页下载",
                    message: "本地升级失败",
                    buttons: [
                        {
                            text: "确定",
                            handler: () => {
                                this.commonSer.openUrlByBrowser(apkUrl);
                            },
                        },
                    ],
                });
                alertBrowser.present();
            }
        );

        fileTransfer.onProgress((event) => {
            let num = Math.ceil((event.loaded / event.total) * 100); //转化成1-100的进度
            let title = document.getElementsByClassName('alert-title')[0];
            if (num === 100) {
                title && (title.innerHTML = '下载完成');
                alert && alert.dismiss();
            } else {
                title && (title.innerHTML = "下载进度：" + num + "%");
            }
        });

        alert.present();
    }
}
