import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../learn.service";
import {LearningPage} from "../learning";
import {Keyboard} from "@ionic-native/keyboard";
import {LogService} from "../../../service/log.service";


@Component({
    selector: 'page-course-type',
    templateUrl: 'course-type.html',
})
export class CourseTypePage {

    typeList = [];
    rightList = [];
    rightActived;

    keyWord;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard,
                public logSer: LogService,
                private loadCtrl: LoadingController,
                private learnSer: LearnService) {
    }

    ionViewDidLoad() {
        this.getType();
    }

    getType() {
        const loading = this.loadCtrl.create();
        loading.present();
        const data = {
            code: "Subject"
        }
        this.learnSer.GetDictionaryByPCode(data).subscribe(
            (res) => {
                if (res.data) {
                    this.typeList = res.data;
                    this.rightList = this.typeList[0];
                    loading.dismiss();
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
}
