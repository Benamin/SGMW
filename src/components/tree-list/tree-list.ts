import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppService} from "../../app/app.service";
import {EmitService} from "../../core/emit.service";
import {ViewFilePage} from "../../pages/learning/view-file/view-file";
import {ModalController, NavController} from "ionic-angular";
import {FileService} from "../../core/file.service";
import {CommonService} from "../../core/common.service";
import {timer} from "rxjs/observable/timer";
import {ExamPage} from "../../pages/mine/exam/exam";
import {LearnService} from "../../pages/learning/learn.service";

@Component({
    selector: 'tree-list',
    templateUrl: 'tree-list.html'
})
export class TreeListComponent {
    @Input() treeList = [];
    @Input() IsBuy = [];
    @Output() fileData = new EventEmitter<any>();

    isSign = false;

    constructor(private appSer: AppService, private eventSer: EmitService, private modalCtrl: ModalController,
                private fileSer: FileService, private commonSer: CommonService,private learSer:LearnService,
                private navCtrl:NavController,) {
        timer(10).subscribe(
            (res) => {
                this.treeList.forEach(e => e.show = true);
            }
        )
    }

    openPDF(file) {
        console.log(file);
        let modal = this.modalCtrl.create(ViewFilePage, {
            displayData: {
                pdfSource: {
                    url: file.fileUrl
                },
                title: file.DisplayName,
                Size: file.Size * 1024
            },

        });
        modal.present();
        event.stopPropagation();
    }

    //文件处理
    handle(file, event) {
        event.stopPropagation();
        console.log(file);
        if (this.IsBuy) {
            this.saveProcess(file);
            if (file.icon.includes('mp4')) {
                this.appSer.setFile(file);
            }
            if (file.icon.includes('pdf')) this.openPDF(file);
            if (!file.icon.includes('pdf') && !file.icon.includes('mp4')) {
                // this.viewOfficeFile(file.fileUrl, file.filename);
                this.fileSer.downloadFile(file.fileUrl, file.filename);
            }
        } else {
            this.isSign = true;
            timer(2000).subscribe(()=>this.isSign = false);
        }
    }

    //下载文件
    downLoad(file,e){
        e.stopPropagation();
        this.fileSer.downloadFile(file.fileUrl, file.filename);
    }

    //保存学习进度
    saveProcess(file){
            const data = {
                EAttachmentID: file.ID
            };
            this.learSer.SaveStudy(data).subscribe(
                (res) => {
                    console.log(res.message);
                }
            )
    }

    //作业处理
    handleExam(exam, ev) {
        ev.stopPropagation();
        this.navCtrl.push(ExamPage);
    }

    viewOfficeFile(fileUrl, DisplayName) {
        this.fileSer.downloadFile(fileUrl, DisplayName);
        // this.inAppBrowser.create(`https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`, '_system');
    }

    getMore(e) {
        e.show = !e.show;
    }

}
