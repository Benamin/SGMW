import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {AlertController, LoadingController, Platform} from "ionic-angular";
import {File} from "@ionic-native/file";
import {CommonService} from "../../core/common.service";
import {Storage} from "@ionic/storage";
import {PhotoLibrary} from "@ionic-native/photo-library";

/**
 * 1、android下载文件 2、IOS下载文件
 * 下载课程中的视频文件
 */

@Injectable()
export class DownloadFileProvider {

    constructor(public http: HttpClient,
                private platform: Platform,
                public file: File,
                public commonSer: CommonService,
                public transfer: FileTransfer,
                public alertCtrl: AlertController,
                private storage: Storage,
                private zone: NgZone,
                private photoLibrary: PhotoLibrary,
                public loadingCtrl: LoadingController) {
    }

    downloadVideo(fileName, fileUrl) {
        // fileUrl = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
        // fileName = 'demo.mp4';
        if (this.platform.is('android')) {
            this.downloadForAndroid(fileUrl, fileName)
        }
        if (this.platform.is('ios')) {
            this.downloadForIOS(fileUrl, fileName);
        }
    }

    downloadForAndroid(fileUrl, fileName) {
        this.file.createDir(this.file.externalRootDirectory, 'sgmw', true).then((result) => {
        });
        const storageDirectory = this.file.externalRootDirectory + 'sgmw/';
        const alert = this.alertCtrl.create({
            title: '下载',
            message: '下载进度：0%',
            enableBackdropDismiss: false,
            buttons: ['后台下载']
        });
        alert.present();
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(fileUrl, storageDirectory + fileName).then((entry) => {
            alert.dismiss();
            this.commonSer.alert('视频下载成功!');
        }, (error) => {
            alert.dismiss();
            this.commonSer.alert(`视频下载失败!${JSON.stringify(error)}`);
        });

        fileTransfer.onProgress(listener => {
            let per = <any>(listener.loaded / listener.total) * 100;
            per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2);
            this.zone.run(() => {
                alert.setMessage(`下载中...${per}%`);
            })
        })

    }

    downloadForIOS(fileUrl, fileName) {
        const alert = this.alertCtrl.create({
            title: '下载',
            message: '下载进度：0%',
            enableBackdropDismiss: false,
            buttons: ['后台下载']
        });
        const fileTransfer: FileTransferObject = this.transfer.create();
        alert.present();
        const url = encodeURI(fileUrl.split('?')[0]) + "?" + fileUrl.split('?')[1];
        this.photoLibrary.requestAuthorization({read: true, write: true}).then(() => {
            fileTransfer.download(url, this.file.dataDirectory + fileName).then((entry) => {
                this.photoLibrary.saveVideo(entry.toURL(), 'sgmw').then((success) => {
                    alert.dismiss();
                    this.commonSer.alert('视频下载成功')
                }, (err) => {
                    alert.dismiss();
                    this.commonSer.alert(`视频下载失败!${JSON.stringify(err)}`);
                })
            }, (err) => {
                alert.dismiss();
                this.commonSer.alert(JSON.stringify(err));
            });
            fileTransfer.onProgress(listener => {
                let per = <any>(listener.loaded / listener.total) * 100;
                per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2);
                this.zone.run(() => {
                    alert.setMessage(`下载中...${per}%`);
                })
            })
        }, (err) => {
            this.commonSer.alert(`没有相册权限，请手动设置权限`);
        })
    }

}
