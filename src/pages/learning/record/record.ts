import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FileService} from "../../../core/file.service";
import {CommonService} from "../../../core/common.service";
import {LearnService} from "../learn.service";

@Component({
    selector: 'page-record',
    templateUrl: 'record.html',
})
export class RecordPage {
    @Input() fileList;
    @Input() maxNum;
    @Input() score;
    @Output() image = new EventEmitter();
    @Output() delete = new EventEmitter();
    preImgSrc = "";

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learnSer: LearnService,
                private fileSer: FileService, private commonSer: CommonService) {
    }

    ionViewDidLoad() {
    }

    //预览文档
    openFile(file) {
        file.AttachmentExt = file.AttachmentExt.toLowerCase();
        if (file.AttachmentExt.includes('mp4')) {
            this.commonSer.toast('不支持预览视频文件');
            return
        }
        if (file.AttachmentExt.includes('png') || file.AttachmentExt.includes('jpg') || file.AttachmentExt.includes('jpeg')) {
            this.image.emit(file.AttachmentUrl);
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
                    this.delete.emit();
                }
            }
        )
    }

}
