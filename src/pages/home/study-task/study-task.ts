import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomeService} from "../home.service";
import {Storage} from "@ionic/storage";
import {defaultImg} from "../../../app/app.constants";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-study-task',
    templateUrl: 'study-task.html',
})
export class StudyTaskPage {

    defaultImg = defaultImg;
    mineInfo;
    obj = {
        NowCredit: 0,
        AllCredit: 0,
        minYear: "2021",
        maxYear: "2022",
        ProductDetails: []
    };
    isLoad = false;
    myDate;
    dateText;
    page = {
        PageIndex: 1,
        PageSize: 10,
        TotalCount: 0
    }

    width = 0;


    constructor(public navCtrl: NavController, public navParams: NavParams,
                private storage: Storage,
                private commonSer: CommonService,
                private loadCtrl: LoadingController,
                private homeSer: HomeService) {
        const date = new Date();
        this.obj.minYear = date.getFullYear() + "";
        this.obj.maxYear = date.getFullYear() + 1 + "";
        console.log(this.obj)
        this.myDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
        this.dateText = `${date.getFullYear()}年${date.getMonth() + 1}月`
    }

    ionViewDidEnter() {
        this.storage.get('user').then(value => {
            if (value) {
                this.mineInfo = value;
            }
        });
        const year = new Date(this.myDate).getFullYear();
        const month = new Date(this.myDate).getMonth() + 1;
        const data = {
            "PageIndex": this.page.PageIndex,
            "PageSize": this.page.PageSize,
            "Year": year,
            "Month": month
        }
        this.homeSer.SaveStudyTaskList(data).subscribe(res => {
            if (res.data) {
                this.getStudyTask();
            }
        })
    }

    getStudyTask() {
        this.isLoad = true;
        const load = this.loadCtrl.create({content: "加载中..."});
        load.present();
        const year = new Date(this.myDate).getFullYear();
        const month = new Date(this.myDate).getMonth() + 1;
        const data = {
            "PageIndex": this.page.PageIndex,
            "PageSize": this.page.PageSize,
            "Year": year,
            "Month": month
        }
        this.homeSer.StudyTaskList(data).subscribe(
            (res) => {
                load.dismissAll();
                this.isLoad = false;
                if (res.data) {
                    this.obj = res.data;
                    this.page.TotalCount = res.data.TotalCount;
                    if (this.obj.NowCredit > 0 && this.obj.AllCredit > 0) {
                        this.width = (this.obj.NowCredit / this.obj.AllCredit) * 100;
                    } else {
                        this.width = 0;
                    }
                }
            }
        )
    }

    doInfinite(e) {
        if (this.obj.ProductDetails.length == this.page.TotalCount || this.obj.ProductDetails.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.isLoad = true;
        const year = new Date(this.myDate).getFullYear();
        const month = new Date(this.myDate).getMonth() + 1;
        this.page.PageIndex++;
        const data = {
            "PageIndex": this.page.PageIndex,
            "PageSize": this.page.PageSize,
            "Year": year,
            "Month": month
        };
        this.homeSer.StudyTaskList(data).subscribe(
            (res) => {
                this.obj.ProductDetails = this.obj.ProductDetails.concat(res.data.ProductDetails);
                this.page.TotalCount = res.data.TotalCount;
                this.isLoad = true;
                e.complete();
            }
        )
    }

    //选择时间
    changeDate(e) {
        const year = e.split('-')[0];
        const month = e.split('-')[1];
        this.myDate = e;
        this.dateText = `${year}年${month}月`
        this.getStudyTask();

    }

    //千万课程
    getItem(item) {
        const date = new Date();
        const nowMonth = date.getMonth() + 1;
        const month = new Date(this.myDate).getMonth() + 1;
        if (nowMonth !== month) {
            this.commonSer.alert('只能学习当月课程');
            return;
        }


        if (item.StudyStatus == 3) {
            this.commonSer.alert('课程未上架')
            return
        }
        this.navCtrl.push(CourseDetailPage, {
            id: item.Pid,
            TaskId: item.TaskId,
            StructureType: item.StructureType,
            enterResource: 'studyTask'
        })
    }

}
