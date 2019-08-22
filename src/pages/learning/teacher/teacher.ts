import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-teacher',
  templateUrl: 'teacher.html',
})
export class TeacherPage {

  info;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.info = this.navParams.get('item');
  }

}
