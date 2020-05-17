import {Component, Input} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";
import {CommonService} from "../../../core/common.service";
import {MineService} from "../../mine/mine.service";
import {ExamTipPage} from "../exam-tip/exam-tip";
import {LookTalkVideoExamPage} from "../look-talk-video-exam/look-talk-video-exam";

@Component({
    selector: 'page-chapter',
    templateUrl: 'chapter.html',
})
export class ChapterPage {
    @Input() chapter;
    @Input() IsBuy;
    @Input() TeachTypeName;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public loadCtrl: LoadingController,
                public mineSer: MineService,
                private commonSer: CommonService) {
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
                        this.navCtrl.push(LookTalkVideoExamPage, {item: exam, source: 'course'});
                    } else {
                        this.navCtrl.push(ExamTipPage, {item: exam});
                    }
                    load.dismiss();
                }
            }
        )
    }

}
