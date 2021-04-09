import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";
import {QIndexComponent} from "../../../components/q-index/q-index";
import {Storage} from "@ionic/storage";
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {GlobalData} from "../../../core/GlobleData";

@Component({
    selector: 'page-look-exam',
    templateUrl: 'look-exam.html',
})
export class LookExamPage {
    @ViewChild(Slides) slides: Slides;

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],
        ExamInfo: <any>null
    };
    doneTotal = 0;
    opTips;

    constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
                private homeSer: HomeService,
                private commonSer: CommonService,
                public global: GlobalData,
                private mineSer: MineService, private loadCtrl: LoadingController, private storage: Storage) {

    }

    //初始化
    ionViewDidEnter() {
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

                this.storage.get('opTips').then(value => {
                    this.opTips = value ? 'false' : 'true';
                })
            }
        )
    }

    slideChanged() {
        if (this.slides.realIndex) this.index = this.slides.realIndex;
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
        });
        modal.present();
    }

    hidden() {
        this.opTips = false;
        this.storage.set('opTips', 'false');
    }

}
