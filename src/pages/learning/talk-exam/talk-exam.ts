import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {GlobalData} from "../../../core/GlobleData";
import {LearnService} from "../learn.service";


@Component({
    selector: 'page-talk-exam',
    templateUrl: 'talk-exam.html',
})
export class TalkExamPage {
    @ViewChild(Navbar) navbar: Navbar;

    Fid;
    exam = {
        QnAInfos: [], //题目信息
        ExamInfo: null  //作业信息
    };

    score = {
        score: 100,
        show: false,
        isDone: false,
    };

    isrelease = false; //是否分享讨论组0 不发，1发

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public learnSer: LearnService,
                public homeSer: HomeService,
                public global: GlobalData,
                public commonSer: CommonService,
                public loadCtrl: LoadingController) {

    }

    ionViewDidLoad() {
        this.navbar.backButtonClick = () => {
            this.commonSer.alert("确定暂存答案吗？", (res) => {
                this.backSubmit();
            })
        };

        const loading = this.loadCtrl.create({
            content: '作业加载中...'
        });
        loading.present();
        const data = {
            Fid: this.navParams.get('Fid')
        };
        this.homeSer.getPaperDetailByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toast(res.Message);
                }
                this.exam.ExamInfo = res.data.ExamInfo;
                this.exam.QnAInfos = res.data.QnAInfos;
                loading.dismiss();

            }
        )
    }

    //返回键触犯暂存
    backSubmit() {
        const loading = this.loadCtrl.create({
            content: `暂存中...`
        });
        loading.present();
        const data = {
            submitType: 2,
            isrelease: this.isrelease === true ? 1 : 0,
            postsCertID: this.global.PostsCertID,
        };
        this.learnSer.submitPaperHomeWorkw(data, this.exam).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code == 200) {
                    this.commonSer.toast('暂存成功');
                    this.navCtrl.getPrevious().data.courseEnterSource = '';
                    this.navCtrl.pop();
                } else {
                    this.commonSer.toast(res.Message);
                }
            }
        )
    }

    //确认提交 status 2-暂存 3-提交
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
                content: `${msg}中...`
            });
            loading.present();
            this.exam.QnAInfos.forEach(e => {
                if (e.QType == 2) e.StuAnswer = e.StuAnswer.replace(/,/g, '').split('').sort().join(',');
            });
            const data = {
                submitType: status,
                isrelease: this.isrelease === true ? 1 : 0,
                postsCertID: this.global.PostsCertID,
            };
            this.learnSer.submitPaperHomeWorkw(data, this.exam).subscribe(
                (res) => {
                    loading.dismiss();
                    if (res.code == 200 && status == 3) {
                        this.score.score = Math.ceil(res.message);
                        this.score.show = true;
                    } else if (res.code == 200 && status == 2) {
                        this.commonSer.toast('暂存成功');
                        this.navCtrl.getPrevious().data.courseEnterSource = '';
                        this.navCtrl.pop();
                    } else {
                        this.commonSer.toast(JSON.stringify(res));
                    }
                }
            )
        });
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
}
