import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-chapter',
    templateUrl: 'chapter.html',
})
export class ChapterPage {
    @Input() chapter;
    @Input() IsBuy;
    @Input() TeachTypeName;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private commonSer: CommonService) {
    }

    ionViewDidLoad() {
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
        exam.Fid = exam.fId;
        if (exam.examStatus == 8) {
            this.navCtrl.push(LookExamPage, {item: exam});
        } else {
            this.navCtrl.push(DoExamPage, {item: exam});
        }
    }

}
