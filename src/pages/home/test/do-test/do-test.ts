import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../../../mine/mine.service";
import {Storage} from "@ionic/storage";
import {CommonService} from "../../../../core/common.service";
import {EmitService} from "../../../../core/emit.service";
import {QIndexComponent} from "../../../../components/q-index/q-index";
import {HomeService} from "../../home.service";


@Component({
    selector: 'page-do-exam',
    templateUrl: 'do-test.html',
})
export class DoTestPage {
    @ViewChild(Slides) slides: Slides;
    @ViewChild(Navbar) navbar: Navbar;

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],  //题目信息
        ExamInfo: null  //试卷信息
    };
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
            this.exam.QnAInfos.forEach(e => {
                    if (e.StuAnswer.length > 0) {
                        countDone++;
                    }
                }
            );
            if (countDone < this.exam.QnAInfos.length) {
                this.score.isDone = true;
                return
            }
            this.submit(3);
        };
    }

    ionViewDidEnter() {
        const loading = this.loadCtrl.create({
            content: '考试加载中...'
        });
        loading.present();
        const item = this.navParams.get('item');
        const data = {
            Fid: item.Fid
        };
        this.homeSer.getPaperDetailByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toast(res.Message);
                }
                this.exam.QnAInfos = res.data.QnAInfos;
                this.exam.ExamInfo = res.data.ExamInfo;
                this.score.tips = true;
                this.exam.QnAInfos.forEach(e => {
                    if (e.StuAnswer != "") {
                        e.StuAnswer = e.StuAnswer.split(',').join('');
                        this.doneTotal++;
                    }
                });
                loading.dismiss();
                this.storage.get('opTips').then(value => {
                    this.opTips = value ? 'false' : 'true';
                });
                if (this.exam.ExamInfo.ExamTimer > 0) {
                    this.paperLeave(item.Fid);
                }
            }
        );


    }

    //查询考试剩余时间
    paperLeave(Fid) {
        const data = {
            Fid: Fid
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
        this.exam.QnAInfos.forEach(e => {
                if (e.StuAnswer.length > 0) {
                    this.doneTotal++;
                }
            }
        )
    }

    //多选
    mutiSelect(i, option) {
        if (this.exam.QnAInfos[i].StuAnswer && this.exam.QnAInfos[i].StuAnswer.includes(option)) {
            this.exam.QnAInfos[i].StuAnswer = this.exam.QnAInfos[i].StuAnswer.replace(option, '');
        } else {
            this.exam.QnAInfos[i].StuAnswer += option + '';
        }
        console.log(this.exam.QnAInfos[i].StuAnswer);
    }

    //确认提交
    submit(status) {
        let countDone = 0;
        this.exam.QnAInfos.forEach(e => {
                if (e.StuAnswer.length > 0) {
                    countDone++;
                }
            }
        );
        if (countDone < this.exam.QnAInfos.length && status == 3) {
            this.score.isDone = true;
            return
        }
        let msg;
        if (status == 2) msg = '暂存';
        if (status == 3) msg = '提交';
        this.commonSer.alert(`确认${msg}?`, () => {
            const loading = this.loadCtrl.create({
                content: '提交中...'
            });
            loading.present();
            this.exam.QnAInfos.forEach(e => {
                if (e.QType == 2) e.StuAnswer = e.StuAnswer.replace(/,/g, '').split('').sort().join(',');
            });
            const data = {
                submitType: status
            };
            this.homeSer.submitPaper(data, this.exam).subscribe(
                (res) => {
                    loading.dismiss();
                    if (res.code == 200 && status == 3) {
                        this.score.score = res.message;
                        this.score.show = true;
                    } else if (res.code == 200 && status == 2) {
                        this.commonSer.toast('暂存成功');
                        this.navCtrl.pop();
                    } else {
                        this.commonSer.toast(res.Message);
                    }
                }
            )
        });
    }

    //自动提交
    forceSubmit() {
        this.exam.QnAInfos.forEach(e => {
            if (e.QType == 2) e.StuAnswer = e.StuAnswer.replace(/,/g, '').split('').sort().join(',');
        });
        const data = {
            submitType: 3
        };
        this.homeSer.submitPaper(data, this.exam).subscribe(
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
        let modal = this.modalCtrl.create(QIndexComponent, {list: this.exam.QnAInfos},
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
