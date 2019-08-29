import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-do-exam',
    templateUrl: 'do-exam.html',
})
export class DoExamPage {
    @ViewChild(Slides) slides: Slides;

    index = 0;  //当前题目的序号
    exam = {
        qs: [],
        stuScore: null
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl: LoadingController, private commonSer: CommonService) {
    }

    ionViewDidLoad() {
        const loading = this.loadCtrl.create({
            content: '加载中...'
        });
        loading.present();
        const item = this.navParams.get('item');
        const data = {
            fid: item.ID
        }
        this.mineSer.homeworkInit(data).subscribe(
            (res) => {
                this.exam.qs = res.data.qs;
                this.exam.qs.forEach(e => e.QAnswer = '');
                this.exam.stuScore = res.data.stuScore;
                loading.dismiss();
            }
        )
    }

    slideChanged() {
        this.index = this.slides.realIndex;
    }

    //多选
    mutiSelect(i, option) {
        if (this.exam.qs[i].QAnswer && this.exam.qs[i].QAnswer.includes(option)) {
            this.exam.qs[i].QAnswer = this.exam.qs[i].QAnswer.replace(option, '');
        } else {
            this.exam.qs[i].QAnswer += option + '';
        }
    }

    //确认提交
    submit() {
        this.mineSer.submitStuExams(this.exam).subscribe(
            (res) => {

            }
        )
    }

    //暂存提交
    saveStuExams() {
        console.log(this.exam);
        this.mineSer.submitStuExams(this.exam).subscribe(
            (res) => {
                this.commonSer.toast(res.message);
                if (res.code == 200) {
                } else {
                }
            }
        )
    }

    //查看题目
    moreChoice() {

    }
}
