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
    @Output() close = new EventEmitter();
    preImgSrc;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private fileSer: FileService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecordPage');
    }

    //office、pdf、图片、视频
    openFile(file) {
        this.fileSer.viewFile(file.fileUrl, file.filename);
    }

    get src(){
        return this.preImgSrc;
    }

    @Input() set src(preImgSrc) {
        this.preImgSrc = preImgSrc;
    }

    closePreview() {
        this.close.emit();
    }

}
