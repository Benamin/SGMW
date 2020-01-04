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
import {DownloadFileProvider} from "../../providers/download-file/download-file";
import {LookExamPage} from "../../pages/mine/look-exam/look-exam";
import {DoExamPage} from "../../pages/mine/do-exam/do-exam";
import {MineService} from "../../pages/mine/mine.service";

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
                private mineSer: MineService,
                private downloadPro: DownloadFileProvider,
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

    /**
     * 打开课件
     * @param node  课时节点
     * @param file  课件
     * @param event  点击事件
     * StudyStatus 0 1 未解锁  2 已解锁
     */
    handle(node, file, event) {
        console.log(node);
        console.log(file);
        if (node.StudyStatus == 1 || node.StudyStatus == 0) {
            this.commonSer.toast('课程尚未解锁,请完成前面的课程解锁');
            return;
        }
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
        if (!file.icon.includes('mp4')) this.saveProcess(file);  //非视频文件保存进度
        if (file.icon.includes('mp4')) {  //视频
            const mp4 = {
                type: 'mp4',
                video: file,   //文件
                nodeLevel: node   //课时节点
            };
            this.appSer.setFile(mp4);  //通知主页面播放视频
            return;
        }
        if (file.icon.includes('iframe')) {  // iframe
            const iframe = {
                type: 'iframe',
                iframe: file
            };
            this.appSer.setFile(iframe);  //通知主页面播放视频
            return;
        }
        if (file.icon.includes('pdf')) {   //pdf课件
            this.openPDF(file);
            return;
        }
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
        if (file.icon.includes('mp4')) {   //视频
            fileUrl = file.DownloadUrl;
            // this.downloadSer.downloadVideo(file.DisplayName + "." + file.icon, fileUrl);
            this.downloadPro.downloadVideo(file.DisplayName + "." + file.icon, fileUrl);
        } else {   //文档
            fileUrl = file.fileUrl;
            this.fileSer.downloadFile(file.fileUrl, file.DisplayName + "." + fileUrl.icon);
        }
    }

    //更新学习进度  非视频课件
    saveProcess(file) {
        const data = {
            EAttachmentID: file.ID
        };
        this.learSer.SaveStudy(data).subscribe(
            (res) => {
                console.log(res.message);
                const data = {
                    type: 'updateDocumentProcess'
                };
                this.appSer.setFile(data); //更新章节解锁信息
            }
        )
    }

    /**
     * 作业处理 studystatus 1未解锁，2已解锁
     * @param itemNode  课时节点
     * @param exam  作业节点
     * @param ev 点击事件
     */
    handleExam(itemNode, exam, ev) {
        ev.stopPropagation();
        if (exam.StudyStatus == 1 || exam.StudyStatus == 0) {
            this.commonSer.toast('作业尚未解锁，请先完成解锁课时的课件和课后作业!');
            return
        }
        const data = {
            Eid: exam.id
        };
        this.mineSer.getExam(data).subscribe(
            (res) => {
                if (res.data) {
                    exam.Fid = res.data.ID;
                    if (exam.examStatus == 8) {
                        this.navCtrl.push(LookExamPage, {item: exam});
                    } else {
                        this.navCtrl.push(DoExamPage, {item: exam, source: 'course'});
                    }
                }
            }
        )
    }

    getMore(e) {
        e.show = !e.show;
    }

}
