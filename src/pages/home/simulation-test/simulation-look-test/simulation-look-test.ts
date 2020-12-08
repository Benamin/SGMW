import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {CommonService} from "../../../../core/common.service";
import {MineService} from "../../../mine/mine.service";
import {Storage} from "@ionic/storage";
import {QIndexComponent} from "../../../../components/q-index/q-index";

@Component({
    selector: 'page-simulation-look-test',
    templateUrl: 'simulation-look-test.html',
})
export class SimulationLookTestPage {
    @ViewChild(Navbar) navbar: Navbar;
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
        this.navbar.backButtonClick = () => {
            this.navCtrl.remove(2, 3)
        };
    }

    ionViewDidEnter() {
        const loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const Fid = this.navParams.get('Fid');
        const data = {
            Fid: Fid,
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
