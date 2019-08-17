import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TeacherPage} from "../teacher/teacher";
import {CourseCommentPage} from "../course-comment/course-comment";


@Component({
  selector: 'page-course-detail',
  templateUrl: 'course-detail.html',
})
export class CourseDetailPage {

  navbarList = [
    { type:'1',name:'简介' },
    { type:'2',name:'章节' },
    { type:'3',name:'教师' },
    { type:'4',name:'评价' },
    { type:'5',name:'相关' },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourseDetailPage');
  }

  teachDetail(){
    this.navCtrl.push(TeacherPage);
  }

  goTeacher(title){
    this.navCtrl.push(CourseCommentPage,{title:title});
  }

}
