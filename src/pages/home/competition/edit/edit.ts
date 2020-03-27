import {Component, ElementRef} from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {EidtModalComponent} from '../../../../components/eidt-modal/eidt-modal.component';
import {ForumService} from "../../../forum/forum.service";
import {CommonService} from "../../../../core/common.service";
import {HomeService} from "../../home.service";

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

    constructor(public modalCtrl: ModalController, public navCtrl: NavController,
                private serve: ForumService,
                private commonSer: CommonService,
                private homeSer: HomeService,
                private platform: Platform,
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

    uploadFile() {
        this.commonSer.alert('确定发布短视频?', () => {
            const data = {
                Title: this.form.Title,
                Description: this.form.Description,
                VideoMinute: Math.ceil(this.mediaFile.duration),
                CoverUrl: this.resp.Imgurl,
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
                    "icon": this.platform.is('ios') ? "MOV" : "mp4",//如果是mp4格式的需要写mp4，如果是avi格式的需要写avi
                    "UploadWay": 0,//上传方式:0.本地上传，1.外部链接，选择课件
                    "Duration": Math.ceil(this.mediaFile.duration),//视频时长，单位：秒
                }
            };
            const loading = this.loading.create({content: '发布中...'});
            loading.present();
            console.log(data);
            this.homeSer.PublicShortVideo(data).subscribe(
                (res) => {
                    if (res.data) {
                        this.commonSer.toast('短视频发布成功!');
                        this.navCtrl.pop();
                    } else {
                        this.commonSer.toast(res.message);
                    }
                    loading.dismiss();
                }
            )
        })
    }
}
