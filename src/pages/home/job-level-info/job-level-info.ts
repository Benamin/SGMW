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
    }

    ionViewDidEnter() {
        this.id = this.navParams.get("id");
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
            // console.log(999, res)
            let data = res.data
            if (data.Items.AuthenticationType === 'xm') {
                let GCList = data.Items.GCapabilityModelList;
                for (var i = 0; i < GCList.length; i++) {
                    for (var j = 0; j < GCList[i].ProjectList.length; j++) {
                        GCList[i].ProjectList.hasFinish = false; // 是否存在Coursestatus === 2
                        for (var k = 0; k < GCList[i].ProjectList[j].CourseList.length; k++) {
                            if (GCList[i].ProjectList[j].CourseList[k].Coursestatus == 2) {
                                GCList[i].ProjectList.hasFinish = true
                            }
                        }
                        if (GCList[i].ProjectList.hasFinish === true) { // 若存在Coursestatus === 2 一个报名的其他都不可点击
                            for (var k = 0; k < GCList[i].ProjectList[j].CourseList.length; k++) {
                                if (GCList[i].ProjectList[j].CourseList[k].Coursestatus == 1) {
                                    GCList[i].ProjectList[j].CourseList[k].Coursestatus = 0
                                }
                            }
                        }
                    }
                }
            }
            if (data.Items.StartTime) {
                let startTimeArr = data.Items.StartTime.split('T');
                let endTimeArr = data.Items.EndTime.split('T');
                let startTime = startTimeArr[0] + ' ' + startTimeArr[1].split(':')[0] + ':'  + startTimeArr[1].split(':')[1];
                let endTime = endTimeArr[0] + ' ' + endTimeArr[1].split(':')[0] + ':'  + endTimeArr[1].split(':')[1];
                data.timeArea = startTime + ' 至 ' + endTime;
            }
            this.detail = data;
            this.isLoad = true;
            loading.dismiss();
        });
    }

    changeCheckType(checkType) {
        if (this.checkType === checkType) return;
        this.checkType = checkType;
    }

    // 线上 点击参加认证
    doUnlineSignIn(courseID, Index, pIndex, cIndex) {
        // console.log(this.detail.Items.ID);
        let ID = this.detail.Items.ID
        if (courseID) {
            ID = courseID
        }
        let loading = this.loadCtrl.create({
            content: ''
        });
        let data = {
            cspid: ID,
            PostsCertificationpID: this.id //岗位认证pid
        }
        loading.present();
        this.homeSer.doUnlineSignIn(data).subscribe(res => {
            if (courseID) {
                // 线下
                let GCList = this.detail.Items.GCapabilityModelList;
                for (var i = 0; i < GCList.length; i++) {
                    for (var j = 0; j < GCList[i].ProjectList.length; j++) {
                        for (var k = 0; k < GCList[i].ProjectList[j].CourseList.length; k++) {
                            GCList[i].ProjectList[j].CourseList[k].Coursestatus = 0;
                        }
                    }
                }
                GCList[Index].ProjectList[pIndex].CourseList[cIndex].Coursestatus = 2
                this.detail.Items.GCapabilityModelList = GCList;
            } else {
                this.detail.Items.IsSignIn = true;
            }
            loading.dismiss();
            this.getDetail();
        });
    }

    doJobLevelSignIn(courseID, Index, pIndex, cIndex) {
        let ID = this.detail.Items.ID
        if (courseID) {
            ID = courseID
        }
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.doJobLevelSignIn(ID).subscribe(res => {
            loading.dismiss();
            this.getDetail();
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
