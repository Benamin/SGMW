import {Component} from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MyCoursePage} from "./my-course/my-course";
import {MycollectionPage} from "./mycollection/mycollection";
import {NotificationPage} from "./notification/notification";
import {AppService} from "../../app/app.service";
import {ExamPage} from "./exam/exam";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";
import {MineService} from "./mine.service";
import {timer} from "rxjs/observable/timer";
import {LoginService} from "../login/login.service";


@Component({
    selector: 'page-mine',
    templateUrl: 'mine.html',
})
export class MinePage {
    mineInfo;
    numer;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private mineSer: MineService, private events: Events,
                private loginSer: LoginService,
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

    doRefresh(e) {
        this.ionViewDidLoad();
        timer(1000).subscribe((res) => {
            e.complete()
        });
    }

    //我的课程
    goToCourse() {
        this.navCtrl.push(MyCoursePage);
    }

    //我的收藏
    goToCollection() {
        this.navCtrl.push(MycollectionPage);
    }

    //我的作业
    goExam() {
        this.navCtrl.push(ExamPage);
    }

    //通知中心
    goToNoti() {
        this.navCtrl.push(NotificationPage);
    }

    //后台退出
    logoutApp() {
        this.storage.get('Authorization').then(value => {
            const data = {
                token: value
            };
            console.log(data);
            this.loginSer.sgmwLogout(data).subscribe(
                (res) => {
                    this.storage.clear();
                    this.events.publish('toLogin');
                }
            );
        })
    }

}
