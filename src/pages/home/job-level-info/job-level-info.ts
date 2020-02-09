import { Component } from "@angular/core";
import {
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams
} from "ionic-angular";
import { defaultImg } from "../../../app/app.constants";
import { LearnService } from "../../learning/learn.service";
import { MineService } from "../../mine/mine.service";
import { LogService } from "../../../service/log.service";
import { Keyboard } from "@ionic-native/keyboard";
import { HomeService } from "../home.service";
import { CommonService } from "../../../core/common.service";

@Component({
  selector: "page-job-level-info",
  templateUrl: "job-level-info.html"
})
export class JobLevelInfoPage {
  id;
  isLoad = false;
  detail;
  defaultImg = defaultImg;
  navliArr = [
    {
      lable: "introduction",
      text: "简介"
    },
    {
      lable: "ability",
      text: "能力模型"
    }
  ];
  checkType = "introduction";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private learSer: LearnService,
    public modalCtrl: ModalController,
    private keyboard: Keyboard,
    public logSer: LogService,
    private commonSer: CommonService,
    public homeSer: HomeService,
    private loadCtrl: LoadingController,
    private mineSer: MineService
  ) {}

  ionViewDidLoad() {
    (function(doc, win) {
      var docEl = doc.documentElement,
        resizeEvt =
          "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function() {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = clientWidth / 37.5 + "px";
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    })(document, window);
    this.id = this.navParams.get("id");
    // console.log('idid', this.id)
    this.getDetail();
  }

  getDetail() {
    let loading = this.loadCtrl.create({
        content:''
    });
    loading.present();
    const data = {
      PositionCertificationID: this.id
    };
    this.homeSer.GetJobLevelInfoById(data).subscribe(res => {
        console.log(999, res)
      this.detail = res.data;
      this.isLoad = true;
      loading.dismiss();
    });
  }

  changeCheckType(checkType) {
    if (this.checkType === checkType) return;
    this.checkType = checkType;
  }
}
