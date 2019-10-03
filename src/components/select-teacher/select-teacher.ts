import { Component } from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {defaultHeadPhoto} from "../../app/app.constants";

@Component({
  selector: 'select-teacher',
  templateUrl: 'select-teacher.html'
})
export class SelectTeacherComponent {

  teacherList = [];
  defalutPhoto = defaultHeadPhoto;   //默认头像；

  constructor(private viewCtrl:ViewController,
              private navParams:NavParams) {
    this.teacherList = this.navParams.get('teacherList');
    console.log(this.teacherList);
  }

  close() {
    this.viewCtrl.dismiss();
  }

  stop(e) {
    e.stopPropagation();
  }

  //
  chosseTeacher(item){
    this.viewCtrl.dismiss(item);
  }
}
