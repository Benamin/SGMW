import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EditPage} from "../../competition/edit/edit";
import {VideoBoxPage} from "../video-box/video-box";

/**
 * Generated class for the ListsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-video-lists',
  templateUrl: 'video-lists.html',
})
export class VideoListsPage {
  videoLists = [];
  searchKey = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoListsPage');
    for (var i=0; i<5; i++) {
      this.videoLists.push({id: i})
    }; // 测试
  }
i
  // 进入视频播放页
  goVideoBox(vid) {
    this.navCtrl.push(VideoBoxPage, {vid: vid});
  }

  goToEdit() {
    this.navCtrl.push(EditPage, { editType: 'video' });
  }

  clearInput() {
    this.searchKey = ''
  }

  doSearch(event) {
    if (event && event.keyCode == 13 && this.searchKey && this.searchKey !== '') {
      alert('searchKey:' + this.searchKey);
    }
  }
}
