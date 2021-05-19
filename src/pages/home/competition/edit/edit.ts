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
import {ChooseImageProvider} from "../../../../providers/choose-image/choose-image";
import {GlobalData} from "../../../../core/GlobleData";
import {ShortVideoProvider} from "../../../../providers/short-video/short-video";
import {FileEntry, File} from "@ionic-native/file";
import {DomSanitizer} from "@angular/platform-browser";

declare let videojs: any;

@Component({
    selector: 'page-edit',
    templateUrl: 'edit.html',
})
export class EditPage {
    on(arg0: any, arg1: any): any {
        throw new Error("Method not implemented.");
    }

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
    videoEle;
    video1;
    video2;

    constructor(public modalCtrl: ModalController, public navCtrl: NavController,
                private serve: ForumService,
                private commonSer: CommonService,
                private platform: Platform,
                private sanitizer: DomSanitizer,
                private zone: NgZone,
                private file: File,
                public chooseImage: ChooseImageProvider,
                public homeSer: HomeService,
                public global: GlobalData,
                public shortVideoPro: ShortVideoProvider,
                private transfer: FileTransfer,
                private loadingCtrl: LoadingController,
                private camera: Camera,
                private appSer: AppService,
                private actionSheetCtrl: ActionSheetController,
                private loading: LoadingController,
                public navParams: NavParams, private elementRef: ElementRef) {
        this.mediaFile = this.navParams.get('mediaFile');
        console.log("mediaFile", this.mediaFile);
        const fileName = this.mediaFile.name;
        let arr = this.mediaFile.fullPath.split('/');
        arr.splice(arr.length - 1, 1);
        const filePath = arr.join('/');
        //读取文件并以ArrayBuffer的形式返回数据。
        this.file.readAsArrayBuffer(filePath, fileName).then(file => {
            // let readAsArrayBuffer = window.URL.createObjectURL(new Blob([file], {type: fileType}))
            // console.log("readAsArrayBuffer", readAsArrayBuffer);
        })
        //读取文件并以二进制数据形式返回数据。
        this.file.readAsBinaryString(filePath, fileName).then(value => {
            // @ts-ignore
            // let url = window.URL.createObjectURL(new File([value], fileName, {type: fileType}));
            // this.videoUrl = <any>this.sanitizer.bypassSecurityTrustUrl(url);
            // console.log("readAsBinaryString", this.videoUrl);
        })

        // let binaryData = [];
        // binaryData.push(this.mediaFile.fullPath);
        // this.videoUrl = window.URL.createObjectURL(new Blob(binaryData, {type: fileType}))
        // let url = window.URL.createObjectURL(this.mediaFile.fullPath);
        // this.videoUrl = this.mediaFile.fullPath;
        // this.videoUrl = url;
        this.resp = this.navParams.get('resp');
    }

    ionViewDidLoad() {
        let that = this;
        const fileName = this.mediaFile.name;
        let fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        that.video1 = videojs("localVideo1", {
            controls: true,
            autoplay: false,
            sources: [{
                src: this.mediaFile.fullPath,
                type: fileType
            }]
        })
        that.video2 = videojs("localVideo2", {
            controls: true,
            autoplay: false,
            sources: [{
                src: "https://sgmwstorage.blob.core.chinacloudapi.cn/asset-ca3dfb25-ff54-4b9a-9d30-43386457cdac/mmexport1620712418396.mp4?sv=2018-03-28&sr=b&sig=Y0IHY72AVKB2NFe13P5VAtf2SY527gM0chVERz9S1gM%3D&se=2031-05-11T05%3A57%3A26Z&sp=rcw",
                type: 'application/x-mpegURL'
            }]
        }, function () {
            this.on("loadeddata", () => {
                setTimeout(() => {
                    let canvas = document.createElement("canvas");
                    canvas.width = 200;
                    canvas.height = 100;
                    let videoEle = <any>document.getElementById("localVideo2");
                    console.log("videoEle", videoEle);
                    canvas.getContext('2d').drawImage(videoEle, 0, 0, canvas.width, canvas.height);

                    let img = document.createElement("img");
                    img.setAttribute('crossOrigin', 'anonymous');
                    img.src = canvas.toDataURL("image/png");
                    console.log(img);
                }, 10000)
            })
        })
        this.getList();
    }

    getDuration(event) {
        console.log(Math.floor(event.duration));
    }

    //获取话题
    getList() {
        const data = {
            "Code": this.global.TopicType
        };
        this.homeSer.GetTopicID(data).subscribe((res: any) => {
            this.form.SVTopicIDList = res.data;
        })
    }

    goBack() {
        this.navCtrl.pop();
    }

    //选中图片
    takePic() {
        this.chooseImage.takePic((data) => {
            this.CoverUrl = data;
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
