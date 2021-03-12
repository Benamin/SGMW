import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../core/common.service";
import {FileService} from "../../../core/file.service";
import {LearnService} from "../learn.service";

@Component({
    selector: 'page-course-file',
    templateUrl: 'course-file.html',
})
export class CourseFilePage {
    mainFile = [];
    title;
    preImgSrc = "";
    pId;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learnSer: LearnService,
                private commonSer: CommonService, private fileSer: FileService) {
    }

    ionViewDidLoad() {
        this.mainFile = this.navParams.get('mainFile');
        this.title = this.navParams.get('title');
        this.pId = this.navParams.get('pId');
    }

    //office、pdf、图片、视频
    openFile(file) {
        file.AttachmentExt = file.AttachmentExt.toLowerCase();
        if (file.AttachmentExt.includes('mp4')) {
            this.commonSer.toast('不支持预览视频文件');
            return
        }
        if (file.AttachmentExt.includes('png') || file.AttachmentExt.includes('jpg') || file.AttachmentExt.includes('jpeg')) {
            this.preImgSrc = (file.AttachmentUrl);

        } else {
            this.fileSer.ViewFile(file.AttachmentUrl, file.AttachmentName);
        }
    }

    //删除最上传的内训资料
    deleteFile(e, item) {
        e.stopPropagation();
        const data = {
            fid: item.ID
        };
        this.learnSer.DelFile(data).subscribe(
            (res) => {
                if (res.data) {
                    this.commonSer.toast('已删除');
                    this.getSelFile();
                }
            }
        )
    }

    //获取自己上传的内训资料
    getSelFile() {
        const data2 = {
            pid: this.pId
        };
        this.learnSer.GetSelfFile(data2).subscribe(
            (res) => {
                this.mainFile = res.data;
            }
        )
    }
}
