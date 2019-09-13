import {Component} from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MyCoursePage} from "./my-course/my-course";
import {MycollectionPage} from "./mycollection/mycollection";
import {NotificationPage} from "./notification/notification";
import {AppService} from "../../app/app.service";
import {ExamPage} from "./exam/exam";
import {Storage} from "@ionic/storage";
import {MineService} from "./mine.service";
import {timer} from "rxjs/observable/timer";
import {LoginService} from "../login/login.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {UpdateAppPage} from "./update-app/update-app";
import {AppVersion} from "@ionic-native/app-version";
import {LogoutService} from "../../secret/logout.service";


@Component({
    selector: 'page-mine',
    templateUrl: 'mine.html',
})
export class MinePage {
    mineInfo;
    number;
    version;

    constructor(public navCtrl: NavController, public navParams: NavParams,private logoutSer:LogoutService,
                private mineSer: MineService, private events: Events, private appVersion: AppVersion,
                private loginSer: LoginService, private inAppBrowser: InAppBrowser,
                private appSer: AppService, private app: App, private storage: Storage) {
        //获取个人信息
        this.storage.get('user').then(value => {
            this.mineInfo = value;
        })
    }

    ionViewDidLoad() {
        this.getVersion();
        this.mineSer.GetMyProductCountInfo().subscribe(
            (res) => {
                this.number = res.data;
            }
        )
    }

    getVersion() {
        //检测是否需要更新
        this.appVersion.getVersionNumber().then((version: string) => {
            this.version = version;
        }).catch(err => {
            console.log(err);
        });
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

    //意见反馈
    openUrl() {
        this.inAppBrowser.create('https://jinshuju.net/f/WVrljv', '_system');
    }

    //更新
    goUpdate() {
        this.navCtrl.push(UpdateAppPage);
    }

    //后台退出
    logoutApp() {
        this.logoutSer.logout();
    }

}
