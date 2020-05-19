import {Component, Input} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";
import {CommonService} from "../../../core/common.service";
import {MineService} from "../../mine/mine.service";
import {ExamTipPage} from "../exam-tip/exam-tip";
import {LookTalkVideoExamPage} from "../look-talk-video-exam/look-talk-video-exam";
import {FileService} from "../../../core/file.service";
import {LearnService} from "../learn.service";
import {GlobalData} from "../../../core/GlobleData";
import {DownloadFileProvider} from "../../../providers/download-file/download-file";
import {AppService} from "../../../app/app.service";
import {ViewFilePage} from "../view-file/view-file";

@Component({
    selector: 'page-chapter',
    templateUrl: 'chapter.html',
})
export class ChapterPage {
    @Input() chapter;
    @Input() IsBuy;
    @Input() TeachTypeName;

    nowTime;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public loadCtrl: LoadingController,
                public modalCtrl: ModalController,
                private fileSer: FileService, private learSer: LearnService,
                private global: GlobalData,
                private appSer: AppService,
                private downloadPro: DownloadFileProvider,
                public mineSer: MineService,
                private commonSer: CommonService) {
        this.nowTime = new Date().getTime();
    }

    ionViewDidLoad() {
        console.log(this.chapter);
    }

    getMore(e) {
        e.show = !e.show;
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
            this.commonSer.toast('请完成课程学习');
            return
        }
        let load = this.loadCtrl.create({
            content: '正在前往作业，请等待...'
        });
        load.present();
        exam.Fid = exam.fId;
        const data = {
            Eid: exam.id
        };
        this.mineSer.getExam(data).subscribe(
            (res) => {
                if (res.data) {
                    exam.Fid = res.data.ID;
                    if (exam.examStatus == 8) {
                        if (exam.JopType == 0) {
                            this.navCtrl.push(LookExamPage, {item: exam, source: 'course'})
                        } else {
                            this.navCtrl.push(LookTalkVideoExamPage, {item: exam, source: 'course'});
                        }
                    } else {
                        if (exam.JopType == 0) {
                            this.navCtrl.push(DoExamPage, {item: exam, source: 'course'})
                        } else {
                            this.navCtrl.push(ExamTipPage, {item: exam});
                        }
                    }
                    load.dismiss();
                }
            }
        )
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
        event.stopPropagation();

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

        if (!file.icon.includes('mp4')) this.saveProcess(file);  //非视频文件保存进度
        this.global.subscribeDone = false;
        if (file.icon.includes('mp4')) {  //视频
            const mp4 = {
                type: 'mp4',
                video: file,   //文件
                source: 'tree-list',
                nodeLevel: node   //课时节点
            };
            this.appSer.setFile(mp4);  //通知主页面播放视频
        }
        if (file.icon.includes('iframe')) {  // iframe
            const iframe = {
                type: 'iframe',
                iframe: file
            };
            this.appSer.setFile(iframe);  //通知主页面播放视频
        }
        if (file.icon.includes('pdf')) {   //pdf课件
            this.openPDF(file);
        }
        if (!file.icon.includes('pdf') && !file.icon.includes('mp4')) {
            this.fileSer.viewFile(file.fileUrl, file.filename);
        }
    }

    //更新学习进度  非视频课件
    saveProcess(file) {
        const data = {
            EAttachmentID: file.ID,
            postsCertID: this.global.PostsCertID
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
            this.fileSer.downloadFile(file.fileUrl, file.DisplayName + "." + file.icon);
        }
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

}
