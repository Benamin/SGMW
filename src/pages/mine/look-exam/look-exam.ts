import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../mine.service";
import {QIndexComponent} from "../../../components/q-index/q-index";
import {Storage} from "@ionic/storage";
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-look-exam',
    templateUrl: 'look-exam.html',
})
export class LookExamPage {
    @ViewChild(Slides) slides: Slides;

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],
        ExamInfo: null
    };
    doneTotal = 0;
    opTips;

    constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
                private homeSer: HomeService,
                private commonSer: CommonService,
                private mineSer: MineService, private loadCtrl: LoadingController, private storage: Storage) {

    }

    ionViewDidLoad() {
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
                if (res.Result == 1) {
                    this.commonSer.toast(res.Message);
                }
                this.exam.QnAInfos = res.data.QnAInfos;
                this.exam.ExamInfo = res.data.ExamInfo;
                loading.dismiss();
                this.storage.get('opTips').then(value => {
                    this.opTips = value ? 'false' : 'true';
                })
            }
        )
    }

    slideChanged() {
        this.index = this.slides.realIndex;
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
