import {Component} from "@angular/core";
import {
    IonicPage,
    LoadingController,
    ModalController,
    NavController,
    NavParams
} from "ionic-angular";
import {defaultImg} from "../../../app/app.constants";
import {LearnService} from "../../learning/learn.service";
import {MineService} from "../../mine/mine.service";
import {LogService} from "../../../service/log.service";
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {CommonService} from "../../../core/common.service";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private learSer: LearnService,
                public modalCtrl: ModalController,
                private keyboard: Keyboard,
                public logSer: LogService,
                private commonSer: CommonService,
                public homeSer: HomeService,
                private loadCtrl: LoadingController,
                private mineSer: MineService) {
    }

    ionViewDidLoad() {
        (function (doc, win) {
            var docEl = doc.documentElement,
                resizeEvt =
                    "orientationchange" in window ? "orientationchange" : "resize",
                recalc = function () {
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
            content: ''
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

    // 线上 点击参加认证
    doOnlineSignIn() {
        console.log(this.detail.Items.ID);
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.doOnlineSignIn(this.detail.Items.ID).subscribe(res => {
            this.detail.Items.IsSignIn = true;
            loading.dismiss();
        });
    }

    //获取课程详情
    getCourseDetailById(id) {
        this.learSer.GetProductById(id).subscribe(
            (res) => {
                if (res.data) {
                    this.goCourse(res.data);
                }
            }
        );
    }

    goCourse(e) {
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id});
        }
    }
}
