import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../learn.service";
import {LearningPage} from "../learning";


@Component({
    selector: 'page-course-type',
    templateUrl: 'course-type.html',
})
export class CourseTypePage {

    typeList = [];
    rightList = [];
    rightActived;

    constructor(public navCtrl: NavController, public navParams: NavParams,
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

}
