import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {IntegralService} from "../integral.service";
import {timer} from "rxjs/observable/timer";
@Component({
  selector: 'page-integral-verify',
  templateUrl: 'integral-verify.html',
})
export class IntegralVerifyPage {

  page = {
    PageIndex: 1,
    PageSize: 10,
    TotalCount: 0,
    isLoading: false
  }
  list = [];  //积分列表
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private inteSer: IntegralService,
              private loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.getList();
  }

  getList() {
    this.loading = this.loadCtrl.create();
    this.loading.present();
    const data = {
      "Title": "",
      "TopicPlateId": "00000000-0000-0000-0000-000000000000",
      "TopicTagPlateId": "00000000-0000-0000-0000-000000000000",
      "Status": 0,
      "Poster": "00000000-0000-0000-0000-000000000000",
      "IsPlate": 0,
      "IsEssencePost": 0,
      "OrderBy": "",
      "OrderByDirection": "",
      "PageIndex": this.page.PageIndex,
      "PageSize": this.page.PageSize
    };
    this.inteSer.selectMyApplyEssence(data).subscribe(res => {
      if (res.data) {
        this.list = res.data.Posts.Items;
        this.page.TotalCount = res.data.Posts.TotalCount
        this.loading.dismissAll();
      }
    })
  }

  doRefresh(e) {
    this.page.PageIndex = 1;
    this.getList();
    timer(1000).subscribe((res) => {
      e.complete();
    });
  }

  //上拉加载
  doInfinite(e) {
    if (this.list.length == this.page.TotalCount || this.list.length > this.page.TotalCount) {
      e.complete();
      return;
    }
    this.page.PageIndex++;
    const data = {
      "Title": "",
      "TopicPlateId": "00000000-0000-0000-0000-000000000000",
      "TopicTagPlateId": "00000000-0000-0000-0000-000000000000",
      "Status": 0,
      "Poster": "00000000-0000-0000-0000-000000000000",
      "IsPlate": 0,
      "IsEssencePost": 0,
      "OrderBy": "",
      "OrderByDirection": "",
      "PageIndex": this.page.PageIndex,
      "PageSize": this.page.PageSize
    };
    this.inteSer.selectMyApplyEssence(data).subscribe(
        (res) => {
          this.list = this.list.concat(res.data.Posts.Items);
          this.page.TotalCount = res.data.Posts.TotalCount;
          this.page.isLoading = true;
          e.complete();
        }
    )
  }

}
