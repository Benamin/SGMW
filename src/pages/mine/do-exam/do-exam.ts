import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CommonService} from "../../../core/common.service";
import {QIndexComponent} from "../../../components/q-index/q-index";
import {EmitService} from "../../../core/emit.service";

@Component({
    selector: 'page-do-exam',
    templateUrl: 'do-exam.html',
})
export class DoExamPage {
    @ViewChild(Slides) slides: Slides;
    @ViewChild(Navbar) navbar: Navbar;

    index = 0;  //当前题目的序号
    exam = {
        qs: [],
        stuScore: null
    };
    doneTotal = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl: LoadingController, private commonSer: CommonService, private modalCtrl: ModalController,
                public eventEmitSer: EmitService,) {
    }

    ionViewDidLoad() {
        this.eventEmitSer.eventEmit.emit('true');
        this.navbar.backButtonClick = () => {
            this.commonSer.alert("是否退出当前测试，中途退出直接交卷？", (res) => {
                this.submit()
            })
        };
    }

    ionViewDidEnter() {
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
        this.doneTotal = 0;
        this.exam.qs.forEach(e => {
                if (e.QAnswer.length > 0) {
                    this.doneTotal++;
                }
            }
        )
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
            this.exam.qs.forEach(e => {
                if (e.QType == 2) e.QAnswer = e.QAnswer.sort().join(',');
            });
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
                this.slides.slideTo(res);
            }
        })
        modal.present();
    }
}
