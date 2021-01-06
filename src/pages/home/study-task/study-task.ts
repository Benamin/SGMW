import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomeService} from "../home.service";
import {Storage} from "@ionic/storage";
import {defaultImg} from "../../../app/app.constants";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

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
        ProductDetails: []
    };
    isLoad = false;
    myDate;
    dateText;

    width = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private storage: Storage,
                private loadCtrl: LoadingController,
                private homeSer: HomeService) {
        const date = new Date();
        this.myDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
        this.dateText = `${date.getFullYear()}年${date.getMonth() + 1}月`
    }

    ionViewDidLoad() {
        this.storage.get('user').then(value => {
            if (value) {
                this.mineInfo = value;
            }
        });
        this.homeSer.TaskPlanTime().subscribe(
            (res) => {
            }
        )
        this.getStudyTask();
    }

    getStudyTask() {
        this.isLoad = true;
        const load = this.loadCtrl.create(
            {
                content: "加载中..."
            }
        );
        load.present();
        console.log(`this.mydate:${this.myDate}`);
        const year = new Date(this.myDate).getFullYear();
        const month = new Date(this.myDate).getMonth() + 1;
        const data = {
            "Year": year,
            "Month": month
        }
        this.homeSer.StudyTaskList(data).subscribe(
            (res) => {
                load.dismissAll();
                this.isLoad = false;
                if (res.data) {
                    this.obj = res.data;
                    if (this.obj.NowCredit > 0 && this.obj.AllCredit > 0) {
                        this.width = (this.obj.NowCredit / this.obj.AllCredit) * 100;
                    } else {
                        this.width = 0;
                    }
                }
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
        this.navCtrl.push(CourseDetailPage, {
            id: item.Pid,
            TaskId: item.TaskId,
            StructureType: item.StructureType,
            enterResource: 'studyTask'
        })
    }

}
