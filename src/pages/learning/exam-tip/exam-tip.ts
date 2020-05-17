import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../../mine/mine.service";
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";
import {TalkExamPage} from "../talk-exam/talk-exam";
import {VideoExamPage} from "../video-exam/video-exam";
import {DatePipe} from "@angular/common";
import {Storage} from "@ionic/storage";


@Component({
    selector: 'page-exam-tip',
    templateUrl: 'exam-tip.html',
})
export class ExamTipPage {

    exam;
    mineInfo;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public loadCtrl: LoadingController,
                public dataPipe: DatePipe,
                public storage: Storage,
                private mineSer: MineService) {
        this.exam = this.navParams.get('item');
        console.log(this.exam);
    }

    ionViewDidLoad() {
        this.storage.get('user').then(value => {
            if (value) {
                this.mineInfo = value;
            }
        });
    }

    goEaxm() {
        let load = this.loadCtrl.create({
            content: '正在获取作业，请等待...'
        });
        load.present();
        const data = {
            Eid: this.exam.id
        };
        this.mineSer.getExam(data).subscribe(
            (res) => {
                if (res.data) {
                    if (this.exam.JopType == 1) {
                        this.navCtrl.push(TalkExamPage, {Fid: res.data.ID});
                    } else if (this.exam.JopType == 2) {
                        this.navCtrl.push(VideoExamPage, {Fid: res.data.ID});
                    }
                    load.dismiss();
                }
            }
        )
    }

}
