import {File} from "@ionic-native/file";import {FileOpener} from "@ionic-native/file-opener";import {Injectable} from "@angular/core";import {AlertController, LoadingController, Platform} from "ionic-angular";import {CommonService} from "./common.service";import {Storage} from "@ionic/storage";import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";import {DocumentViewer} from '@ionic-native/document-viewer';@Injectable()export class FileService {    constructor(private file: File, public fileOpener: FileOpener,                private loadingCtrl: LoadingController,                private commonSer: CommonService,                public platform: Platform,                public alertCtrl: AlertController,                public transfer: FileTransfer,                public document: DocumentViewer,                private storage: Storage    ) {    }    downloadFile(fileUrl, fileName) {        let storageDirectory = null;        if (this.platform.is('android')) {            this.file.createDir(this.file.externalRootDirectory, 'sgmw', true).then((result) => {            });            storageDirectory = this.file.externalRootDirectory + 'sgmw/';        } else {            storageDirectory = this.file.cacheDirectory;        }        const uploadLoading = this.loadingCtrl.create({            content: '下载中...',            dismissOnPageChange: true,            enableBackdropDismiss: true,        });        uploadLoading.present();        const fileTransfer: FileTransferObject = this.transfer.create();        const fileType = this.getFileMimeType(fileName);        const downloadURL = encodeURI(fileUrl.split('?')[0]) + "?" + fileUrl.split('?')[1];        fileTransfer.download(downloadURL, storageDirectory + fileName).then((entry) => {            let blob = entry.toURL();            uploadLoading.dismiss();            this.commonSer.toast('下载课件成功');        });        fileTransfer.onProgress((event) => {            let progress = Math.round(100.0 * event.loaded / event.total);            uploadLoading.setContent('下载中...' + progress + '%');        });    }    viewFile(fileUrl, fileName) {        const uploadLoading = this.loadingCtrl.create({            content: '加载中...',            dismissOnPageChange: true,            enableBackdropDismiss: true,        });        uploadLoading.present();        let path = this.file.dataDirectory;        const fileTransfer: FileTransferObject = this.transfer.create();        const fileType = this.getFileMimeType(fileName);        const downloadURL = encodeURI(fileUrl.split('?')[0]) + "?" + fileUrl.split('?')[1];        fileTransfer.download(downloadURL, path + fileName).then((entry) => {            let url = entry.toURL();            uploadLoading.dismiss();            if (this.platform.is('ios')) {                this.document.viewDocument(url, fileType, {})            } else {                this.fileOpener.open(url, fileType);            }        });        fileTransfer.onProgress((event) => {            let progress = Math.round(100.0 * event.loaded / event.total);            uploadLoading.setContent('加载中...' + progress + '%');        });    }    //获取文件类型    getFileMimeType(fileName: string): string {        let fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();        let mimeType: string = '';        switch (fileType) {            case 'txt':                mimeType = 'text/plain';                break;            case 'docx':                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';                break;            case 'doc':                mimeType = 'application/msword';                break;            case 'pptx':                mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';                break;            case 'ppt':                mimeType = 'application/vnd.ms-powerpoint';                break;            case 'xlsx':                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';                break;            case 'xls':                mimeType = 'application/vnd.ms-excel';                break;            case 'zip':                mimeType = 'application/x-zip-compressed';                break;            case 'rar':                mimeType = 'application/octet-stream';                break;            case 'pdf':                mimeType = 'application/pdf';                break;            case 'jpg':                mimeType = 'image/jpeg';                break;            case 'png':                mimeType = 'image/png';                break;            default:                mimeType = 'application/' + fileType;                break;        }        return mimeType;    }}