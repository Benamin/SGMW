import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {ActionSheetController, LoadingController, Platform} from "ionic-angular";
import {AppService} from "../../app/app.service";
import {CommonService} from "../../core/common.service";
import {env, SERVER_API_URL_DEV, SERVER_API_URL_PROD, SERVER_API_URL_UAT} from "../../app/app.constants";

/**
 * 1、拍照  2、上传本地图片
 */

@Injectable()
export class ChooseImageProvider {

    constructor(public http: HttpClient, public actionSheetCtrl: ActionSheetController,
                public loadingCtrl: LoadingController,
                public commonSer: CommonService,
                public zone: NgZone,
                private transfer: FileTransfer,
                public camera: Camera, public platform: Platform, public appSer: AppService) {
    }


    //选择图片--弹窗
    takePic(successCallback) {
        const actionSheet = this.actionSheetCtrl.create({
            cssClass: 'cameraAction',
            buttons: [
                {
                    text: '拍照',
                    role: 'fromCamera',
                    handler: () => {
                        this.selectPicture(1, successCallback);
                    }
                },
                {
                    text: '从相册中选',
                    role: 'fromPhoto',
                    handler: () => {
                        this.selectPicture(0, successCallback);
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    //选择图片--打开相机
    selectPicture(srcType, successCallback) {
        const options: CameraOptions = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: srcType,  //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
            targetWidth: 375,
            targetHeight: 667,
            saveToPhotoAlbum: false
        };
        const option: FileUploadOptions = {
            httpMethod: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            fileName: 'image.png'
        };
        if (this.platform.is('ios')) {
            this.appSer.setIOS('platformIOS');
            // @ts-ignore
            setTimeout(() => {
                this.appSer.setIOS('innerCourse');
            }, 1500)
        }
        this.camera.getPicture(options).then((imagedata) => {
            let filePath = imagedata;
            if (filePath.indexOf('?') !== -1) {     //获取文件名
                filePath = filePath.split('?')[0];
            }
            let arr = filePath.split('/');
            option.fileName = arr[arr.length - 1];
            if (this.platform.is('ios')) {

            } else {
                option.fileName = option.fileName.indexOf('.') == -1 ? `${option.fileName}.jpg` : option.fileName;
            }

            this.upload(imagedata, option, successCallback);
        })
    }

    //上传图片
    upload(file, options, successCallback) {
        const uploadLoading = this.loadingCtrl.create({
            content: '上传中...',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        uploadLoading.present();
        const SERVER_URL = (env === 'localhost' ? SERVER_API_URL_DEV : (env == 'dev' ? SERVER_API_URL_DEV : (env == 'uat' ?
            SERVER_API_URL_UAT : (env == 'prod' ? SERVER_API_URL_PROD : ''))));
        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.upload(file, SERVER_URL + '/Upload/UploadFiles', options).then(
            (res) => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传成功');
                const data = JSON.parse(res.response);
                successCallback(data.data)
            }, err => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传错误');
            });
        fileTransfer.onProgress((listener) => {
            let per = <any>(listener.loaded / listener.total) * 100;
            per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2)
            this.zone.run(() => {
                uploadLoading.setContent('上传中...' + per + '%');
            })
        })
    }

}
