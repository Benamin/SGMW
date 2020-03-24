import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {EditPage} from "../../home/competition/edit/edit";
import {VideoBoxPage} from "../../home/short-video/video-box/video-box";
import {HomeService} from "../../home/home.service";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-my-short-video',
  templateUrl: 'my-short-video.html',
})

export class MyShortVideoPage {

  defaultImg = './assets/imgs/competition/fengmian@2x.png'
  videoLists = [];
  page = {
    searchKey: "",
    videoLists: [],
    Page: 1,
    PageSize: 10,
    TotalCount: null,
    isLoad: false
  };
  constructor(private homeSer: HomeService, public navCtrl: NavController, public navParams: NavParams,private loadCtrl: LoadingController, private storage: Storage) {
  }

  ionViewDidLoad() {
      this.getList();
  }

  // 进入视频播放页
  goVideoBox(vid) {
    this.navCtrl.push(VideoBoxPage, {vid: vid});
  }

  goToEdit() {
    this.navCtrl.push(EditPage, {editType: 'video'});
  }

  clearInput() {
    this.page.searchKey = ''
  }

  doSearch(event) {
    if (event && event.keyCode == 13 && this.page.searchKey && this.page.searchKey !== '') {
      this.page.Page = 1;
      this.getList();
    }
  }

  getList() {
    let loading = this.loadCtrl.create({
      content: ''
    });
    loading.present();
    const data = {
      GetMyList: 1,
      Title: this.page.searchKey,
      Page: 1,
      PageSize: this.page.PageSize
    };
    this.homeSer.GetVideoLists(data).subscribe(
      (res) => {
        let videoLists = this.tranTages(res.data.Items);
        console.log('videoLists', videoLists)
        this.page.videoLists = videoLists;
        this.page.TotalCount = res.data.TotalCount;

        this.page.isLoad = true;
        loading.dismiss();
      }
    )
  }

  tranTages (data) {
    let videoLists = data;
    for (var i=0; i<videoLists.length; i++) {
      videoLists[i].tags = videoLists[i].SVTopicIDList[0].Name;
      if (videoLists[i].SVTopicIDList && videoLists[i].SVTopicIDList.length > 1) {
        for (var k=1; k<videoLists[i].SVTopicIDList.length; k++) {
          videoLists[i].tags += '、' + videoLists[i].SVTopicIDList[i].Name;
        }
      }
    }
    return videoLists;
  }

  //下拉刷新
  doRefresh(e) {
    this.page.Page = 1;
    this.getList();
    timer(1000).subscribe(() => {
      e.complete();
    });
  }

  //加载更多
  doInfinite(e) {
    if (this.page.videoLists.length == this.page.TotalCount || this.page.videoLists.length > this.page.TotalCount) {
      e.complete();
      return;
    }
    this.page.Page++;
    const data = {
      GetMyList: 1,
      Title: this.page.searchKey,
      Page: this.page.Page,
      PageSize: this.page.PageSize
    };
    this.homeSer.GetVideoLists(data).subscribe(
      (res) => {
        let videoLists = this.tranTages(res.data.Items);
        this.page.videoLists = this.page.videoLists.concat(videoLists);
        this.page.TotalCount = res.data.TotalCount;
        e.complete();
      }
    )
  }
}

