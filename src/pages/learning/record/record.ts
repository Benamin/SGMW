import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FileService} from "../../../core/file.service";

@Component({
    selector: 'page-record',
    templateUrl: 'record.html',
})
export class RecordPage {
    @Input() fileList;
    @Input() maxNum;
    @Output() image = new EventEmitter();
    preImgSrc;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private fileSer: FileService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecordPage');
    }

    //office、pdf、图片、视频
    openFile(file) {
        if (file.AttachmentExt.includes('png') || file.AttachmentExt.includes('jpg') || file.AttachmentExt.includes('jpeg')) {
            this.image.emit(file.AttachmentUrl);
        } else {
            this.fileSer.viewFile(file.AttachmentUrl, file.AttachmentDIsplayName);
        }
    }

}
