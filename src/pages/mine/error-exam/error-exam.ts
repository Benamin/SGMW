import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {MineService} from "../mine.service";
import {Storage} from "@ionic/storage";
import {QIndexComponent} from "../../../components/q-index/q-index";

@Component({
    selector: 'page-error-exam',
    templateUrl: 'error-exam.html',
})
export class ErrorExamPage {
    @ViewChild(Navbar) navbar: Navbar;
    @ViewChild(Slides) slides: Slides;

    index = 0;  //当前题目的序号
    exam = {
        QnAInfos: [],
        ExamInfo: <any>null
    };
    doneTotal = 0;
    opTips;

    source;

    constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
                private homeSer: HomeService,
                private commonSer: CommonService,
                private mineSer: MineService, private loadCtrl: LoadingController, private storage: Storage) {

    }

    //初始化
    ionViewDidLoad() {
        this.source = this.navParams.get('source');

        this.navbar.backButtonClick = () => {
            if (this.source == 'courseExam') {  //通过课程进入 直接返回上一层
                this.navCtrl.pop();
            } else {   //通过作业进入 返回课程
                let index = this.navCtrl.length() - 2;
                this.navCtrl.remove(index, 2);
            }
        };

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
