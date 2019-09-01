import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppService} from "../../app/app.service";
import {EmitService} from "../../core/emit.service";
import {ViewFilePage} from "../../pages/learning/view-file/view-file";
import {ModalController} from "ionic-angular";
import {FileService} from "../../core/file.service";
import {CommonService} from "../../core/common.service";

@Component({
    selector: 'tree-list',
    templateUrl: 'tree-list.html'
})
export class TreeListComponent {
    @Input() treeList = [];
    @Input() IsBuy = [];
    @Output() fileData = new EventEmitter<any>();

    constructor(private appSer: AppService, private eventSer: EmitService, private modalCtrl: ModalController,
                private fileSer: FileService,private commonSer:CommonService) {
    }

    openPDF(file) {
        console.log(file);
        let modal = this.modalCtrl.create(ViewFilePage, {
            displayData: {
                pdfSource: {
                    url: file.fileUrl
                },
                title: file.filename,
                Size:file.Size * 1024
            },

        });
        modal.present();
        event.stopPropagation();
    }

    handle(file, event) {
        if (this.IsBuy) {
            if (file.icon.includes('mp4')) {
                this.appSer.setFile(file);
            }
            if (file.icon.includes('pdf')) this.openPDF(file);
            if (!file.icon.includes('pdf') && !file.icon.includes('mp4')) {
                this.commonSer.toast('暂时只可预览pdf文件');
                // this.viewOfficeFile(file.fileUrl, file.filename);
            }
        } else {
            this.commonSer.toast('请先报名');
        }
    }

    viewOfficeFile(fileUrl, fileName) {
        this.fileSer.downloadFile(fileUrl, fileName);
        // this.inAppBrowser.create(`https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`, '_system');
    }

    getMore(e) {
        e.show = !e.show;
    }

}
