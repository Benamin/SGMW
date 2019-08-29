import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";

@Component({
    selector: 'page-do-exam',
    templateUrl: 'do-exam.html',
})
export class DoExamPage {
    @ViewChild(Slides) slides: Slides;

    index = 0;  //当前题目的序号
    exam = {
        qs: [],
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl: LoadingController) {
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
                loading.dismiss();
            }
        )
    }

    slideChanged() {
        this.index = this.slides.realIndex;
    }

    //多选
    mutiSelect(option) {
        console.log(option);
    }

    //确认提交
    submit(){

    }

    //暂存提交
    saveStuExams(){

    }

    //
    moreChoice(){

    }
}
