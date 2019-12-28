import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FileService} from "../../../core/file.service";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-record',
    templateUrl: 'record.html',
})
export class RecordPage {
    @Input() fileList;
    @Input() maxNum;
    @Input() score;
    @Output() image = new EventEmitter();
    preImgSrc;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private fileSer: FileService, private commonSer: CommonService) {
    }

    ionViewDidLoad() {
    }

    //office、pdf、图片、视频
    openFile(file) {
        file.AttachmentExt = file.AttachmentExt.toLowerCase();
        if (file.AttachmentExt.includes('mp4')) {
            this.commonSer.toast('不支持预览视频文件');
            return
        }
        if (file.AttachmentExt.includes('png') || file.AttachmentExt.includes('jpg') || file.AttachmentExt.includes('jpeg')) {
            this.image.emit(file.AttachmentUrl);
        } else {
            this.fileSer.viewFile(file.AttachmentUrl, file.AttachmentName);
        }
    }

}
