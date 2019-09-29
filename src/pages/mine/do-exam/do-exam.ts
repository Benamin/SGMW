import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CommonService} from "../../../core/common.service";
import {QIndexComponent} from "../../../components/q-index/q-index";
import {EmitService} from "../../../core/emit.service";
import {Storage} from "@ionic/storage";

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
    opTips;
    score = {
        score: 100,
        show: false,
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private storage: Storage,
                private loadCtrl: LoadingController, private commonSer: CommonService, private modalCtrl: ModalController,
                public eventEmitSer: EmitService,) {
    }

    ionViewDidLoad() {
        this.eventEmitSer.eventEmit.emit('true');
        this.navbar.backButtonClick = () => {
            this.commonSer.alert("确定要放弃答案吗？", (res) => {
                this.navCtrl.pop();
            })
        };
    }

    ionViewDidEnter() {
        const loading = this.loadCtrl.create({
            content: '作业加载中...'
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
                this.storage.get('opTips').then(value => {
                    this.opTips = value ? 'false' : 'true';
                })
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
        this.commonSer.alert('确认提交?', () => {
            const loading = this.loadCtrl.create({
                content: '提交中...'
            });
            loading.present();
            this.exam.qs.forEach(e => {
                if (e.QType == 2) e.QAnswer = e.QAnswer.split().sort().join(',');
            });
            this.mineSer.submitStuExams(this.exam).subscribe(
                (res) => {
                    loading.dismiss()
                    if (res.code == 200) {
                        this.score.score = res.message;
                        this.score.show = true;
                    } else {
                        this.commonSer.toast(res.Message);
                    }
                }
            )
        });
    }

    //暂存提交
    saveStuExams() {
        this.commonSer.alert('确定暂存答案?', () => {
            const loading = this.loadCtrl.create({
                content: '提交中...'
            });
            loading.present();
            this.exam.qs.forEach(e => {
                if (e.QType == 2) e.QAnswer = e.QAnswer.split().sort().join(',');
            });
            this.mineSer.saveStuExams(this.exam).subscribe(
                (res) => {
                    loading.dismiss();
                    if (res.code == 200) {
                        this.navCtrl.pop();
                        this.commonSer.toast('已暂存');
                    } else {
                        this.commonSer.toast(res.Message);
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

    hidden() {
        this.opTips = false;
        this.storage.set('opTips', 'false');
    }

    close(e) {
        this.score.show = false;
        this.navCtrl.pop();
    }
}
