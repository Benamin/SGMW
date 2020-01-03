import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../core/common.service";
import {FileService} from "../../../core/file.service";

@Component({
    selector: 'page-course-file',
    templateUrl: 'course-file.html',
})
export class CourseFilePage {
    mainFile = [];
    title;
    preImgSrc;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService, private fileSer: FileService) {
    }

    ionViewDidLoad() {
        this.mainFile = this.navParams.get('mainFile');
        console.log(this.mainFile);
        this.title = this.navParams.get('title');
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
            this.fileSer.viewFile(file.AttachmentUrl, file.AttachmentName);
        }
    }
}
