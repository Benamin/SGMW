import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TotalRankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-total-ranking',
  templateUrl: 'total-ranking.html',
})
export class TotalRankingPage {
  userDefaultImg = './assets/imgs/userDefault.jpg';
  TotalRankingLists = []
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    for (var i=1; i<=5; i++) {
      this.TotalRankingLists.push({id: i})
    }; //
  }

}
