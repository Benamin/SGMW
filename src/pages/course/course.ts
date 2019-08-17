import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-course',
    templateUrl: 'course.html',
})
export class CoursePage {
    navbarList = [
        {type: '1', name: '学习中'},
        {type: '2', name: '已完成'},
    ]

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CoursePage');
    }

}
