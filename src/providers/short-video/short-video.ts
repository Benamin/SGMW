import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {CaptureVideoOptions, MediaCapture, MediaFileData} from "@ionic-native/media-capture";
import {FileEntry, IFile, File} from "@ionic-native/file";
import {ActionSheetController, LoadingController, Platform} from "ionic-angular";
import {AppService} from "../../app/app.service";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {EditPage} from "../../pages/home/competition/edit/edit";
import {Camera} from "@ionic-native/camera";
import {CommonService} from "../../core/common.service";
import {env, SERVER_API_URL_DEV, SERVER_API_URL_PROD, SERVER_API_URL_UAT} from "../../app/app.constants";

/**
 * 1、录制视频 2、上传本地视频
 */

@Injectable()
export class ShortVideoProvider {

    constructor(public http: HttpClient,
                public platform: Platform,
                public appSer: AppService,
                public mediaCapture: MediaCapture,
                public Camera: Camera,
                public file: File,
                public zone: NgZone,
                private commonSer: CommonService,
                private transfer: FileTransfer,
                private loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController) {
    }

    chooseVideo(successCallback) {
        let modal = this.actionSheetCtrl.create(
            {
                buttons: [
                    {
                        text: '录制短视频',
                        role: '',
                        handler: () => {
                            this.captureVideo(successCallback);
                        }
                    },
                    {
                        text: '上传短视频',
                        role: '',
                        handler: () => {
                            this.selectVide(successCallback);
                        }
                    },
                    {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            return
                        }
                    },
                ]
            }
        )
        modal.present();
    }

// {
//     end:0,
//     fullPath:"file:///storage/emulated/0/DCIM/Camera/VID_20200323_103712.mp4",
//     lastModified:null,
//     lastModifiedDate:1584931048000,
//     localURL:"cdvfile://localhost/sdcard/DCIM/Camera/VID_20200323_103712.mp4",
//     name:"VID_20200323_103712.mp4",
//     size:21748732,
//     start:0,
//     type:"video/mp4",
//     "width":0,"duration":0,"bitrate":0,"codecs":null,"height":0
// }
    captureVideo(successCallback) {
        let option: CaptureVideoOptions = {
            limit: 1,
            duration: 15,
            quality: 100
        };
        if (this.platform.is('ios')) {
            this.appSer.setIOS('platformIOS');
            // @ts-ignore
            setTimeout(() => {
                this.appSer.setIOS('innerCourse');
            }, 1500)
        }
        this.mediaCapture.captureVideo(option).then((mediaFiles: any) => {
            const mediaFile = mediaFiles[0];
            mediaFile.getFormatData((data: MediaFileData) => {
                Object.assign(mediaFile, data);
                this.uploadVideo(mediaFile, successCallback)
            }, error => {
                console.log(error);
            })
        })
    }

    /**
     * 上传本地短视频
     * 大小限制20M 即20971520 bytes
     */
    // 【mediaFile】=>
    // {   //fileMeta
    //     "name":"trim.3D31C4A3-6329-4DD2-B056-EB6AD746D239.MOV",
    //     "localURL":"cdvfile://localhost/temporary/trim.3D31C4A3-6329-4DD2-B056-EB6AD746D239.MOV",
    //     "type":"video/quicktime",
    //     "lastModified":1585404792291.002,
    //     "lastModifiedDate":1585404792291.002,
    //     "size":8373732,
    //     "start":0,
    //     "end":8373732
    // }
    selectVide(successCallback) {
        const option = {
            sourceType: 0,
            destinationType: this.Camera.DestinationType.FILE_URI,
            quality: 100,
            mediaType: this.Camera.MediaType.VIDEO,
            allowEdit: false,
        };
        if (this.platform.is('ios')) {
            this.appSer.setIOS('platformIOS');
            // @ts-ignore
            setTimeout(() => {
                this.appSer.setIOS('innerCourse');
            }, 1500)
        }
        this.Camera.getPicture(option).then((videoData) => {
            let filePath = videoData.startsWith("file://") ? videoData : "file://" + videoData;
            this.file.resolveLocalFilesystemUrl(filePath).then((fileEntry: FileEntry) => {
                return new Promise((resolve, reject) => {
                    fileEntry.file(meta => resolve(meta), error => reject(error));
                });
            }).then((fileMeta: IFile) => {
                if (fileMeta.size > 20971520) { //判断是否超过20M
                    this.commonSer.alert('上传视频不能超过20M');
                } else if (fileMeta.name.includes('.MOV') || fileMeta.name.includes('.mp4') || fileMeta.name.includes('.MP4')) {
                    const mediaFile = {
                        fullPath: filePath,
                        name: fileMeta.name,
                        size: fileMeta.size
                    }
                    this.uploadVideo(mediaFile, successCallback);
                } else {
                    this.commonSer.alert('上传视频格式仅支持MOV、MP4');
                }
            });
        })
    }

    /**
     * 上传文件 【视频】
     * @param mediaFile
     */
    // 【resp】=>
    // AssetId:"nb:cid:UUID:c7a84183-07bc-4f34-b607-912b29cc09fa"
    // DownloadUrl:"https://devstorgec.blob.core.chinacloudapi.cn/asset-c7a84183-07bc-4f34-b607-912b29cc09fa/VID_20200323_111446.mp4?sv=2018-03-28&sr=b&sig=ds86zkaBbVXIDDx5KzPMLNX6xxb1GrQ8o2slCHZG5PM%3D&se=2030-03-23T03%3A15%3A40Z&sp=rcw"
    // Imgurl:"https://devstorgec.blob.core.chinacloudapi.cn/asset-f15e6c34-b6b1-4717-8ac0-4dfad2d43b5a/VID_20200323_111446_000001.jpg?sv=2017-04-17&sr=c&si=6bed0a50-3f07-42ec-acc5-bb4e0376f44c&sig=doTiLv1%2BL3KmqLcD8iU2QK7S8cGBb%2B6Zjm2K6HVma68%3D&se=2020-04-02T03%3A16%3A37Z"
    // JobId:"nb:jid:UUID:0ad700ff-0300-aa76-5699-f1ea6cb49287"
    // Type:0
    // Url:"转码中"
    uploadVideo(mediaFile, successCallback) {
        const option: FileUploadOptions = {
            httpMethod: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            fileName: mediaFile.name
        };
        const uploadLoading = this.loadingCtrl.create({
            content: '上传中...',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        uploadLoading.present();
        const SERVER_URL = (env === 'localhost' ? SERVER_API_URL_DEV : (env == 'dev' ? SERVER_API_URL_DEV : (env == 'uat' ?
            SERVER_API_URL_UAT : (env == 'prod' ? SERVER_API_URL_PROD : ''))));
        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.upload(mediaFile.fullPath, SERVER_URL + '/AppShortVideo/UploadMainFile', option).then(
            (res) => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传成功');
                const data = JSON.parse(res.response);
                const backData = {mediaFile: mediaFile, resp: data.data}
                successCallback(backData);
            }, err => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传错误');
            });
        fileTransfer.onProgress((listener) => {
            let per = <any>(listener.loaded / listener.total) * 100;
            per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2);
            this.zone.run(() => {
                uploadLoading.setContent(`上传中...${per}%`);
            });
        })
    }
}
