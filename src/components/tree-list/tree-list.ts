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
import {DownloadFileService} from "../../core/downloadFile.service";

@Component({
    selector: 'tree-list',
    templateUrl: 'tree-list.html'
})
export class TreeListComponent {
    @Input() treeList = [];
    @Input() IsBuy = [];
    @Input() TeachTypeName;
    @Output() fileData = new EventEmitter<any>();

    isSign = false;
    nowTime;

    constructor(private appSer: AppService, private eventSer: EmitService, private modalCtrl: ModalController,
                private fileSer: FileService, private commonSer: CommonService, private learSer: LearnService,
                private navCtrl: NavController,
                private downloadSer: DownloadFileService) {
        timer(10).subscribe(
            (res) => {
                this.treeList.forEach(e => e.show = true);
            }
        )
        this.nowTime = new Date().getTime();

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
        console.log(file);

        //未报名
        if (!this.IsBuy) {
            this.commonSer.toast("请先报名!");
            return;
        }

        let text = this.TeachTypeName == "直播" ? "直播" : "课程";
        //课程未开始
        const startTimeStr = file.PlanStartTimeStr.replace(/-/g, '/');  //兼容ios
        const planStartTime = new Date(startTimeStr).getTime();
        if (this.nowTime < planStartTime) {
            this.commonSer.toast(`${text}还未开始，请等待开始后再观看`);
            return
        }

        event.stopPropagation();
        this.saveProcess(file);
        if (file.icon.includes('mp4')) {
            this.appSer.setFile(file);
        }
        if (file.icon.includes('pdf')) this.openPDF(file);
        if (!file.icon.includes('pdf') && !file.icon.includes('mp4')) {
            this.fileSer.viewFile(file.fileUrl, file.filename);
        }
    }

    getTime(time) {
        return new Date(time).getTime();
    }

    //下载文件
    downLoad(file, e) {
        e.stopPropagation();
        let fileUrl;
        if (file.icon.includes('mp4')) {
            fileUrl = file.DownloadUrl;
            this.downloadSer.downloadVideo(file.DisplayName + "." + file.icon, fileUrl)
        } else {
            fileUrl = file.fileUrl;
            this.fileSer.downloadFile(file.fileUrl, file.DisplayName + "." + fileUrl.icon);
        }
    }

    //更新学习进度
    saveProcess(file) {
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

    getMore(e) {
        e.show = !e.show;
    }

}
