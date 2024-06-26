import {Component} from '@angular/core';
import {
    IonicPage,
    Loading,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform
} from 'ionic-angular';
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {GlobalData} from "../../../core/GlobleData";
import {defaultImg} from "../../../app/app.constants";
import {FloatVideoBoxComponent} from "../../../components/float-video-box/float-video-box";

@Component({
    selector: 'page-look-talk-video-exam',
    templateUrl: 'look-talk-video-exam.html',
})
export class LookTalkVideoExamPage {

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],
        ExamInfo: null
    };
    doneTotal = 0;
    video;

    defaultImg = defaultImg;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public loadCtrl: LoadingController,
                public homeSer: HomeService,
                public global: GlobalData,
                public modalCtrl: ModalController,
                public commonSer: CommonService) {
    }

    ionViewDidLoad() {
        this.global.CourseEnterSource = "LookExam";
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const item = this.navParams.get('item');
        const data = {
            Fid: item.Fid
        };
        this.homeSer.getPaperDetailByStu(data).subscribe(
            (res) => {
                loading.dismiss();
                if (res.Result !== 0) {
                    if(res.message) this.commonSer.alert(res.message);
                    if(res.Message) this.commonSer.alert(res.Message);
                }
                this.exam.QnAInfos = res.data.QnAInfos;
                this.exam.ExamInfo = res.data.ExamInfo;
                if (this.exam.ExamInfo.JopType == 2) {
                    this.exam.QnAInfos.forEach(e => {
                        if (e.StuAnswer) {
                            e.StuAnswer = JSON.parse(e.StuAnswer);
                        } else {
                            e.StuAnswer.AttachmentUrl = '';
                        }
                    })
                }
            }
        )
    }

    //视频弹窗
    openVideo(item) {
        if (!item.AttachmentUrl || item.AttachmentUrl == '转码中') {
            this.commonSer.toast('视频未转码完成');
            return
        }
        let modal = this.modalCtrl.create(FloatVideoBoxComponent, {src: item.AttachmentUrl});
        modal.present();
    }
}
