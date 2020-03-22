import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ListsRankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-lists-ranking',
  templateUrl: 'lists-ranking.html',
})
export class ListsRankingPage {
  userDefaultImg = './assets/imgs/userDefault.jpg';
  tid: ''
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.tid = this.navParams.get("tid")
    console.log('考试项目id：', this.tid);
  }

}
