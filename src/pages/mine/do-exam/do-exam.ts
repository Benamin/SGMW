import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CommonService} from "../../../core/common.service";
import {QIndexComponent} from "../../../components/q-index/q-index";

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
                private loadCtrl: LoadingController, private commonSer: CommonService, private modalCtrl: ModalController) {
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
        this.commonSer.alert('确认提交答案？', () => {
            this.mineSer.submitStuExams(this.exam).subscribe(
                (res) => {

                }
            )
        })
    }

    //暂存提交
    saveStuExams() {
        this.commonSer.alert('确认暂存提交？', () => {
            this.mineSer.submitStuExams(this.exam).subscribe(
                (res) => {
                    this.commonSer.toast(res.message);
                    if (res.code == 200) {
                    } else {
                    }
                }
            )
        });
    }

    //查看题目
    moreChoice() {
        let modal = this.modalCtrl.create(QIndexComponent, {list: this.exam.qs},
            {
                enterAnimation: 'modal-from-right-enter',
                leaveAnimation: 'modal-from-right-leave'
            });
        modal.onDidDismiss(res => {
            if (res) {
                console.log(res);
            }
        })
        modal.present();
    }
}
