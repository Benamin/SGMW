import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CommonService} from "../../../core/common.service";
import {QIndexComponent} from "../../../components/q-index/q-index";
import {EmitService} from "../../../core/emit.service";
import {Storage} from "@ionic/storage";
import {HomeService} from "../../home/home.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {GlobalData} from "../../../core/GlobleData";
import {LookExamPage} from "../look-exam/look-exam";
import {ErrorExamPage} from "../error-exam/error-exam";

@Component({
    selector: 'page-do-exam',
    templateUrl: 'do-exam.html',
})
export class DoExamPage {
    @ViewChild(Slides) slides: Slides;
    @ViewChild(Navbar) navbar: Navbar;

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],
        ExamInfo: null
    };
    doneTotal = 0;
    opTips;
    score = {
        score: 100,
        show: false,
        isDone: false,
    };
    //ChongXinKaiShi  重新开始  ZanCun 暂存
    ExamStatusMine;  //来源 course 课程

    Fid;
    SubmitNumber = 0; //作业提交次数

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private storage: Storage,
                private global: GlobalData,
                private homeSer: HomeService,
                private loadCtrl: LoadingController, private commonSer: CommonService, private modalCtrl: ModalController,
                public eventEmitSer: EmitService,) {
        this.ExamStatusMine = this.navParams.get('ExamStatusMine');
    }

    ionViewDidLoad() {
        this.global.CourseEnterSource = "DoExam";
        this.eventEmitSer.eventEmit.emit('true');
        this.navbar.backButtonClick = () => {
            this.commonSer.alert("确定暂存答案吗？", (res) => {
                this.backSubmit();
            })
        };
    }

    ionViewWillLeave() {
        this.eventEmitSer.eventEmit.emit('false');
    }

    ionViewDidEnter() {
        const loading = this.loadCtrl.create({
            content: '作业加载中...'
        });
        loading.present();
        const item = this.navParams.get('item');
        this.Fid = item.Fid;
        const data = {
            Fid: item.Fid
        };
        this.homeSer.getPaperDetailByStu(data).subscribe(
            (res) => {
                loading.dismiss();
                if (res.Result !== 0) {
                    if (res.message) this.commonSer.alert(res.message);
                    if (res.Message) this.commonSer.alert(res.Message);
                }
                this.exam.QnAInfos = res.data.QnAInfos;
                this.exam.ExamInfo = res.data.ExamInfo;
                this.SubmitNumber = res.data.SubmitNumber;
                this.exam.QnAInfos.forEach(e => {
                    if (e.StuAnswer && e.StuAnswer != "") {
                        e.StuAnswer = e.StuAnswer.split(',').join('');
                        this.doneTotal++;
                    }
                });
                if (this.ExamStatusMine == 'ChongXinKaiShi') {   //未通过作业  上次的回答清空
                    this.exam.QnAInfos.forEach(e => e.StuAnswer = "");
                    this.doneTotal = 0;
                }
                this.storage.get('opTips').then(value => {
                    this.opTips = value ? 'false' : 'true';
                })
            }
        )
    }

    slideChanged() {
        if (this.slides.realIndex) this.index = this.slides.realIndex;
        this.doneTotal = 0;
        this.exam.QnAInfos.forEach(e => {
                if (e.StuAnswer && e.StuAnswer.length > 0) {
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

    //返回键触犯暂存
    backSubmit() {
        const loading = this.loadCtrl.create({
            content: `暂存中...`
        });
        loading.present();
        this.exam.QnAInfos.forEach(e => {
            if (e.QType == 2) e.StuAnswer = e.StuAnswer.replace(/,/g, '').split('').sort().join(',');
        });
        const data = {
            submitType: 2,
            postsCertID: this.global.PostsCertID
        };
        this.homeSer.submitPaper(data, this.exam).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code == 200) {
                    this.commonSer.toast('暂存成功');
                    this.navCtrl.pop();
                } else {
                    this.commonSer.toast(res.Message);
                    setTimeout(() => {
                        this.navCtrl.pop();
                    }, 3000);
                }
            }
        )
    }

    //确认提交 status 11-暂存 3-提交
    submit(status) {
        let isDone = this.exam.QnAInfos.every(e => e.StuAnswer.length > 0);
        if (!isDone && status == 3) {
            this.score.isDone = true;
            return
        }

        this.exam.QnAInfos.forEach(e => {
            if (e.QType == 2) e.StuAnswer = e.StuAnswer.replace(/,/g, '').split('').sort().join(',');
        });
        let msg;
        if (status == 11) msg = '暂存';
        if (status == 3) msg = '提交';
        this.commonSer.alert(`确认${msg}?`, () => {
            const loading = this.loadCtrl.create({
                content: `${msg}中...`
            });
            loading.present();
            const data = {
                submitType: status,
                postsCertID: this.global.PostsCertID
            };
            this.homeSer.submitPaper(data, this.exam).subscribe(
                (res) => {
                    loading.dismiss();
                    if (res.code == 200 && status == 3) {
                        this.score.score = Math.ceil(res.message);
                        this.score.show = true;
                    } else if (res.code == 200 && status == 11) {
                        this.commonSer.toast('暂存成功');
                        this.navCtrl.pop();
                    } else {
                        this.commonSer.toast(JSON.stringify(res));
                        setTimeout(() => {
                            this.navCtrl.pop();
                        }, 3000);
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

    //考分提示
    close(e) {
        this.score.show = false;
        this.navCtrl.pop();
    }

    //未做完提示关闭
    closeDone(e) {
        this.score.isDone = false;
    }

    //查看错题
    lookError() {
        const data = {
            Fid: this.Fid
        };
        this.navCtrl.push(ErrorExamPage, {item: data, source: 'course'})
    }

    //重做作业
    resetExam() {
        this.exam.QnAInfos.forEach(e => e.StuAnswer = "");
        this.doneTotal = 0;
        this.score.show = false;
        this.slides.slideTo(0, 300);
    }
}
