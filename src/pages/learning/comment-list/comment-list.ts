import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {defaultHeadPhoto} from "../../../app/app.constants";

@Component({
  selector: 'page-comment-list',
  templateUrl: 'comment-list.html',
})
export class CommentListPage {
  @Input() TopicType;
  List;
  starList = new Array(5);
  defalutPhoto = defaultHeadPhoto;   //默认头像；

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  get cList() {
    return this.List;
  }

  @Input() set cList(value) {
    this.List = value;
  }



}
