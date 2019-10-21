import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../../mine/mine.service";
import {Storage} from "@ionic/storage";
import {CommonService} from "../../../core/common.service";
import {EmitService} from "../../../core/emit.service";
import {QIndexComponent} from "../../../components/q-index/q-index";
import {HomeService} from "../home.service";


@Component({
    selector: 'page-do-exam',
    templateUrl: 'do-test.html',
})
export class DoTestPage {
    @ViewChild(Slides) slides: Slides;
    @ViewChild(Navbar) navbar: Navbar;

    index = 0;  //当前题目的序号
    exam = {
        qs: [],
        stuScore: null
    };
    paper;  //试卷信息
    doneTotal = 0;
    opTips;
    score = {
        score: 100,
        show: false,
        tips: false,
        isDone: false,
    };

    clock;  //倒计时的定时器
    list = [];
    timeText = '00:00:00';
    totalTime;
    useTime = 0;  //用时

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private storage: Storage,
                private homeSer: HomeService,
                private loadCtrl: LoadingController, private commonSer: CommonService, private modalCtrl: ModalController,
                public eventEmitSer: EmitService,) {
    }

    ionViewDidLoad() {
        this.eventEmitSer.eventEmit.emit('true');
        this.navbar.backButtonClick = () => {
            let countDone = 0;
            this.exam.qs.forEach(e => {
                    if (e.QAnswer.length > 0) {
                        countDone++;
                    }
                }
            );
            if (countDone < this.exam.qs.length) {
                this.score.isDone = true;
                return
            }
            this.submit();
        };
    }

    ionViewDidEnter() {
        const loading = this.loadCtrl.create({
            content: '考试加载中...'
        });
        loading.present();
        const item = this.navParams.get('item');
        const data = {
            fid: item.ID
        };
        this.mineSer.homeworkInit(data).subscribe(
            (res) => {
                this.exam.qs = res.data.qs;
                this.paper = res.data.paper;
                this.score.tips = true;
                this.exam.qs.forEach(e => e.QAnswer = e.QAnswer ? e.QAnswer.replace(',','') : "");
                this.exam.stuScore = res.data.stuScore;
                this.slideChanged();
                loading.dismiss();
                this.storage.get('opTips').then(value => {
                    this.opTips = value ? 'false' : 'true';
                });
                if (this.paper.PaperTimer > 0) {
                    this.paperLeave(item.ID);
                }
            }
        );


    }

    //查询考试剩余时间
    paperLeave(id) {
        const data = {
            fid: id
        };
        this.homeSer.getStuSurplu(data).subscribe(
            (res) => {
                const time = res.data / 1000;
                this.totalTime = Math.floor(time);
                this.countTime();
            }
        )
    }

    //倒计时
    countTime() {
        let totalTime = this.totalTime;
        this.clock = window.setInterval(() => {
            totalTime--;
            this.useTime++;

            let hourse = <any>(Math.floor(totalTime / 3600)).toString();
            hourse = (hourse.length > 1 ? hourse : '0' + hourse);
            let minutes = <any>Math.floor((totalTime - hourse * 3600) / 60).toString();
            minutes = minutes % 60 === 0 ? 0 : minutes;
            minutes = (minutes.length > 1 ? minutes : '0' + minutes);
            let seconds = Math.floor(totalTime % 60).toString();
            seconds = (seconds.length > 1 ? seconds : '0' + seconds);
            if (hourse == "00") {
                this.timeText = minutes + ":" + seconds;
            } else {
                this.timeText = hourse + ":" + minutes + ":" + seconds;
            }

            if (totalTime < 0) {
                this.useTime = this.totalTime;
                window.clearInterval(this.clock);
                this.timeText = "00:00:00";
                this.forceSubmit();
            }
        }, 1000);
    }

    //题目完成数量
    slideChanged() {
        this.index = this.slides.realIndex || 0;
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
        console.log(this.exam.qs[i].QAnswer);
    }

    //暂存提交
    saveStuExams() {
        this.commonSer.alert('确定暂存答案?', () => {
            const loading = this.loadCtrl.create({
                content: '提交中...'
            });
            // loading.present();
            this.exam.qs.forEach(e => {
                if (e.QType == 2) e.QAnswer = e.QAnswer.replace(',', '').split("").sort().join(',');
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

    //确认提交
    submit() {
        let countDone = 0;
        this.exam.qs.forEach(e => {
                if (e.QAnswer.length > 0) {
                    countDone++;
                }
            }
        );
        if (countDone < this.exam.qs.length) {
            this.score.isDone = true;
            return
        }
        this.commonSer.alert(`确认提交?`, () => {
            const loading = this.loadCtrl.create({
                content: '提交中...'
            });
            loading.present();
            this.exam.qs.forEach(e => {
                if (e.QType == 2) e.QAnswer = e.QAnswer.replace(',', '').split("").sort().join(',');
            });
            this.mineSer.submitStuExams(this.exam).subscribe(
                (res) => {
                    loading.dismiss();
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

    //自动提交
    forceSubmit() {
        this.exam.qs.forEach(e => {
            if (e.QType == 2) e.QAnswer = e.QAnswer.split("").sort().join(',');
        });
        this.mineSer.submitStuExams(this.exam).subscribe(
            (res) => {
                if (res.code == 200) {
                    this.score.score = res.message;
                    this.score.show = true;
                } else {
                    this.commonSer.toast(res.Message);
                }
            }
        )
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

    //关闭时间提示
    closeTips(e) {
        // e.stopPropagation();
        this.score.tips = false;
    }

    //关闭分数提示
    close(e) {
        this.score.show = false;
        this.navCtrl.pop();
    }

    //关闭题目未做完提示
    //未做完提示关闭
    closeDone(e) {
        this.score.isDone = false;
    }

}
