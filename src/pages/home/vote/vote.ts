import {Component, Input, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {HomeService} from "../home.service";
import {CommonService} from "../../../core/common.service";
import {MineService} from "../../mine/mine.service";
import {Storage} from "@ionic/storage";
import {QIndexComponent} from "../../../components/q-index/q-index";

@Component({
    selector: 'page-vote',
    templateUrl: 'vote.html',
})
export class VotePage {
    @Input() qnAInfo;
    @Input() index;

    constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
                private homeSer: HomeService,
                private commonSer: CommonService,
                private mineSer: MineService, private loadCtrl: LoadingController, private storage: Storage) {
        setTimeout(() => {
            if (this.qnAInfo) {
                this.qnAInfo.StuAnswer = this.qnAInfo.StuAnswer ? this.qnAInfo.StuAnswer : '';
                this.qnAInfo.AllFX = this.qnAInfo.ChoiceAFx + this.qnAInfo.ChoiceBFx + this.qnAInfo.ChoiceCFx + this.qnAInfo.ChoiceDFx + this.qnAInfo.ChoiceEFx + this.qnAInfo.ChoiceFFx + this.qnAInfo.ChoiceGFx;
                console.log(this.qnAInfo.AllFX);
            }
        }, 100)
    }

    ionViewDidLoad() {

    }
}
