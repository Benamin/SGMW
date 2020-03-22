import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VideoBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-video-box',
  templateUrl: 'video-box.html',
})
export class VideoBoxPage {
  like: true
  vid: ''
  comment: ''
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoBoxPage');
    this.vid = this.navParams.get("vid")
  }

}
