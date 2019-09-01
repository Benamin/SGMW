import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomeService} from "../home.service";
import {LearnService} from "../../learning/learn.service";
import {CommonService} from "../../../core/common.service";
import {TeacherPage} from "../../learning/teacher/teacher";

@Component({
  selector: 'page-good-teacher',
  templateUrl: 'good-teacher.html',
})
export class GoodTeacherPage {

  teacherList = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private homeSer:HomeService,
              private learnSer:LearnService,private commonSer:CommonService) {
  }

  ionViewDidLoad() {
    this.getGoodsTeacher();
  }

  //优秀教师
  getGoodsTeacher() {
    this.homeSer.GetGoodTeacherList().subscribe(
        (res) => {
          this.teacherList = res.data.TeacherItems;
        }
    )
  }

  async focusHandle(item) {
    const data = {
      TopicID: item.UserID
    };
    await this.learnSer.SaveSubscribe(data).subscribe(
        (res) => {
          this.commonSer.toast('关注成功');
         this.getGoodsTeacher();
        }
    );
  }

  async cancleFocusHandle(item) {
    console.log(item);
    const data = {
      TopicID: item.UserID
    };
    this.learnSer.CancelSubscribe(data).subscribe(
        (res) => {
          this.commonSer.toast('取消关注成功')
          this.getGoodsTeacher();

        }
    )
  }

    //教师详情
    teachDetail(item) {
        this.navCtrl.push(TeacherPage, {item: item});
    }

}
