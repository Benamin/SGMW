import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@Component({
    selector: 'page-course-file',
    templateUrl: 'course-file.html',
})
export class CourseFilePage {
    mainFile = [];
    title;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.mainFile = this.navParams.get('mainFile');
        console.log(this.mainFile);
        this.title = this.navParams.get('title');
    }

}
