import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TeacherPage} from "../teacher/teacher";
import {CourseCommentPage} from "../course-comment/course-comment";
import {timer} from "rxjs/observable/timer";


@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html',
})
export class CourseDetailPage {

    learnList = [];
    navbarList = [
        {type: '1', name: '简介'},
        {type: '2', name: '章节'},
        {type: '3', name: '教师'},
        {type: '4', name: '评价'},
        {type: '5', name: '相关'},
    ];

    signObj = {
        isSign: false,
    };

    collectionObj = {
        isCollection: false
    };

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.learnList = [
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
            {img: '', title: '', brand: '新宝骏', comment: '123', collection: '123'},
        ];
    }

    teachDetail() {
        this.navCtrl.push(TeacherPage);
    }

    goTeacher(title) {
        this.navCtrl.push(CourseCommentPage, {title: title});
    }

    goCourse(e) {
        console.log(e);
    }

    //报名
    sign() {
        this.signObj.isSign = true;
        timer(1000).subscribe(() => this.signObj.isSign = false);
    }

    //收藏
    collection() {
        this.collectionObj.isCollection = true;
        timer(1000).subscribe(() => this.collectionObj.isCollection = false);
    }

}
