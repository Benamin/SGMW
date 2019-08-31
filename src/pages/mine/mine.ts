import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MyCoursePage} from "./my-course/my-course";
import {MycollectionPage} from "./mycollection/mycollection";
import {NotificationPage} from "./notification/notification";
import {AppService} from "../../app/app.service";
import {ExamPage} from "./exam/exam";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";
import {MineService} from "./mine.service";


@Component({
    selector: 'page-mine',
    templateUrl: 'mine.html',
})
export class MinePage {
    mineInfo;
    numer;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private mineSer: MineService,
                private appSer: AppService, private app: App, private storage: Storage) {
        //获取个人信息
        this.storage.get('user').then(value => {
            this.mineInfo = value;
        })
    }

    ionViewDidLoad() {
        this.mineSer.GetMyProductCountInfo().subscribe(
            (res) => {
                this.numer = res.data;
            }
        )
    }

    //我的课程
    goToCourse() {
        this.navCtrl.push(MyCoursePage);
    }

    //我的收藏
    goToCollection() {
        this.navCtrl.push(MycollectionPage);
    }

    goExam() {
        this.navCtrl.push(ExamPage);
    }

    //通知中心
    goToNoti() {
        this.navCtrl.push(NotificationPage);
    }

    //后台退出
    logoutApp() {
        // let length = this.navCtrl.length();
        // this.navCtrl.remove(length);
        this.storage.clear();
        this.app.getRootNav()[0].setRoot(LoginPage);
    }

}
