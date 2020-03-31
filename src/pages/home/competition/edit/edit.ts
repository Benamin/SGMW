import {Component, ElementRef, NgZone} from '@angular/core';
import {
    ActionSheetController,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform
} from 'ionic-angular';
import {EidtModalComponent} from '../../../../components/eidt-modal/eidt-modal.component';
import {ForumService} from "../../../forum/forum.service";
import {CommonService} from "../../../../core/common.service";
import {HomeService} from "../../home.service";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {AppService} from "../../../../app/app.service";

//需要弹出的页面

@Component({
    selector: 'page-edit',
    templateUrl: 'edit.html',
})
export class EditPage {
    editTitle = '视频编辑'
    form = {
        Title: '',
        Description: "",
        SVTopicIDList: '',  //话题
        file: {}   //视频文件信息
    };
    modal;
    mediaFile; //本地视频信息
    resp; //上传到线上视频信息
    choicePlateList;  //话题列表
    tempList;  //板块列表
    CoverUrl;

    constructor(public modalCtrl: ModalController, public navCtrl: NavController,
                private serve: ForumService,
                private commonSer: CommonService,
                private homeSer: HomeService,
                private platform: Platform,
                private zone: NgZone,
                private transfer: FileTransfer,
                private loadingCtrl: LoadingController,
                private camera: Camera,
                private appSer: AppService,
                private actionSheetCtrl: ActionSheetController,
                private loading: LoadingController,
                public navParams: NavParams, private elementRef: ElementRef) {
        this.mediaFile = this.navParams.get('mediaFile');
        this.resp = this.navParams.get('resp');
    }

    ionViewDidLoad() {
        this.getList();
    }

    //获取话题
    getList() {
        const data = {
            "Code": "xsds"
        };
        this.homeSer.GetTopicID(data).subscribe((res: any) => {
            this.form.SVTopicIDList = res.data;
        })
    }

    goBack() {
        this.navCtrl.pop();
    }

    //选择图片
    takePic() {
        const actionSheet = this.actionSheetCtrl.create({
            cssClass: 'cameraAction',
            buttons: [
                {
                    text: '拍照',
                    role: 'fromCamera',
                    handler: () => {
                        console.log('fromCamera');
                        this.selectPicture(1);
                    }
                },
                {
                    text: '从相册中选',
                    role: 'fromPhoto',
                    handler: () => {
                        console.log('fromPhoto');
                        this.selectPicture(0);
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

    //选择图片
    selectPicture(srcType) {
        const options: CameraOptions = {
            quality: 10,  //1 拍照  2 相册
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: srcType,
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
            console.log(imagedata);
            console.log(arr);
            if (this.platform.is('ios')) {

            } else {
                option.fileName = option.fileName.indexOf('.') == -1 ? `${option.fileName}.jpg` : option.fileName;
            }

            this.upload(imagedata, option);
        })
    }

    //上传图片
    upload(file, options) {
        const uploadLoading = this.loadingCtrl.create({
            content: '上传中...',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        uploadLoading.present();
        // const SERVER_URL = 'http://devapi1.chinacloudsites.cn/api'; //开发环境
        const SERVER_URL = 'http://sitapi1.chinacloudsites.cn/api'; //sit环境
        // const SERVER_URL = 'https://elearningapi.sgmw.com.cn/api';  //生产环境
        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.upload(file, SERVER_URL + '/Upload/UploadFiles', options).then(
            (res) => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传成功');
                const data = JSON.parse(res.response);
                this.CoverUrl = data.data;
                console.log(this.CoverUrl);
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

    //提交
    uploadFile() {
        if (!this.form.Title || this.form.Title.length > 16) {
            this.commonSer.alert('请输入短视频标题且最多输入16个文字')
            return
        }
        if (!this.CoverUrl) {
            this.commonSer.alert('请上传短视频封面');
            return
        }
        this.commonSer.alert('确定发布短视频?', () => {
            const data = {
                Title: this.form.Title,
                Description: this.form.Description,
                CoverUrl: this.CoverUrl,
                SVTopicIDList: [this.form.SVTopicIDList],
                files: {
                    "filename": this.mediaFile.name,//文件名称
                    "DisplayName": this.mediaFile.name,//文件显示名称
                    "fileUrl": this.resp.Url,//文件转码地址
                    "DownloadUrl": this.resp.DownloadUrl,//文件下载地址
                    "Size": this.mediaFile.size,//文件大小
                    "Description": "短视频",//文件简介
                    "AssetId": this.resp.AssetId,//资产id
                    "JobId": this.resp.JobId,//作业id
                    "icon": this.mediaFile.name.includes('MOV') ? "MOV" : "MP4",//如果是mp4格式的需要写mp4，如果是avi格式的需要写avi
                    "UploadWay": 0,//上传方式:0.本地上传，1.外部链接，选择课件
                }
            };
            const loading = this.loading.create({content: '发布中...'});
            loading.present();
            console.log(data);
            this.homeSer.PublicShortVideo(data).subscribe(
                (res) => {
                    if (res.data) {
                        this.commonSer.alert('短视频上传成功,请至【个人中心-视频】查看短视频转码状态，转码完成后会自动发布');
                        this.navCtrl.pop();
                    } else {
                        this.commonSer.alert(res.message);
                    }
                    loading.dismiss();
                }
            )
        })
    }
}
