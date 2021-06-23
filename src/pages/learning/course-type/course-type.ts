import {Component, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, LoadingController, NavController, NavParams, Refresher} from 'ionic-angular';
import {LearnService} from "../learn.service";
import {LearningPage} from "../learning";
import {Keyboard} from "@ionic-native/keyboard";
import {LogService} from "../../../service/log.service";


@Component({
    selector: 'page-course-type',
    templateUrl: 'course-type.html',
})
export class CourseTypePage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;

    typeList = [];
    rightList = [];
    rightActived;

    keyWord;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard,
                public logSer: LogService,
                private loadCtrl: LoadingController,
                private events: Events,
                private learnSer: LearnService) {
    }

    ionViewDidLoad() {
        // 发布 自定义事件
        this.events.publish('messageTabBadge:change', {});
        this.showLoading();
        this.getType();
    }

    getType() {
        const data = {
            code: "Subject"
        }
        this.learnSer.GetDictionaryByPCode(data).subscribe(
            (res) => {
                if (res.data) {
                    this.typeList = res.data;
                    this.rightList = this.typeList[0];
                    this.dismissLoading();
                }
            }
        )
    }

    changeType(item) {
        this.rightList = item;
    }

    //
    goToList(SubjectID, label) {
        this.rightActived = SubjectID;
        this.navCtrl.push(LearningPage, {SubjectID: SubjectID, title: label});
    }

    showKey() {
        this.keyboard.show();
    }

    search(event) {
        if ((event && event.keyCode == 13)) {
            this.navCtrl.push(LearningPage, {keyWord: this.keyWord});
            //搜索日志
            if (this.keyWord) this.logSer.keyWordLog(this.keyWord);
        } else {

        }
    }

    gotoListAll() {
        this.navCtrl.push(LearningPage, {keyWord: ''});
    }

    doRefresh(e) {
        this.getType();
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }
}
