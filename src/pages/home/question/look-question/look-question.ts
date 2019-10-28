import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {MineService} from "../../../mine/mine.service";
import {Storage} from "@ionic/storage";
import {QIndexComponent} from "../../../../components/q-index/q-index";
import {HomeService} from "../../home.service";

@Component({
    selector: 'page-look-exam',
    templateUrl: 'look-question.html',
})
export class LookQuestion {
    @ViewChild(Slides) slides: Slides;

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],
        stuScore: null
    };
    doneTotal = 0;
    opTips;

    constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
                private homeSer:HomeService,
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
                res.data.QnAInfos.forEach(e => {
                    e.StuAnswer = e.StuAnswer ? e.StuAnswer : '';
                })
                this.exam.QnAInfos = res.data.QnAInfos;
                this.exam.stuScore = res.data.stuScore;
                loading.dismiss();
                this.storage.get('opTips').then(value => {
                    this.opTips = value ? 'false' : 'true';
                })
            }
        )
    }

    slideChanged() {
        if (this.slides.realIndex) {
            this.index = this.slides.realIndex;
        }
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
