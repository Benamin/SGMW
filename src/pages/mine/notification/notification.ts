import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MineService} from "../mine.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notificationList = [];
  page = {
    page: 1,
    pageSize: 100,
    total: null
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,private mineSer:MineService) {
  }

  ionViewDidLoad() {
    this.getList();
  }

  getList() {
    const data = {
      page:this.page.page,
      pageSize:this.page.pageSize
    };
    this.mineSer.GetUserNewsList(data).subscribe(
        (res) => {
          this.notificationList = res.data.NewsList;
        }
    )
  }

  goDetail(e) {
    this.navCtrl.push(CourseDetailPage, {id: e.Id});
  }

  doInfinite(e) {
    e.complete();
  }

  doRefresh(e) {
    e.complete();
  }
}
