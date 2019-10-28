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
    templateUrl: 'do-question.html',
})
export class DoQuestionPage {
    @ViewChild(Slides) slides: Slides;
    @ViewChild(Navbar) navbar: Navbar;

    //学生的答案字段是StuAnswer   学生状态为3的时候，QAnswer才会有数据
    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],
        ExamInfo: [],   //2-保存 3-提交
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
            this.submit(2);
        };
    }

    ionViewDidEnter() {
        const loading = this.loadCtrl.create({
            content: '问卷加载中...'
        });
        loading.present();
        const item = this.navParams.get('item');
        const data = {
            Fid: item.Fid
        };
        this.homeSer.getPaperDetailByStu(data).subscribe(
            (res) => {
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
            }
        );


    }

    //题目完成数量
    slideChanged() {
        this.index = this.slides.realIndex;
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
                    if (res.code == 200) {
                        this.navCtrl.pop();
                        this.commonSer.toast(`${msg}成功`);
                    } else {
                        this.commonSer.toast(res.Message);
                    }
                }
            )
        });
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
