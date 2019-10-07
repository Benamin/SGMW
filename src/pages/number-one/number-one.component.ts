import { Component } from '@angular/core';
import { NavController ,LoadingController} from "ionic-angular";
import { NumberOneDetailsComponent } from "./numberOneDetails/numberOneDetails.component";
import { numberOneService } from './numberOne.service';
import { Componentsdetails } from '../consultation/componentsdetails/componentsdetails.component';

@Component({
  selector: 'page-number-one',
  templateUrl: 'number-one.html'
})
export class NumberOne {

  navli: '销冠风采' | '销售案例' = '销冠风采';
  // 销冠风采 列表
  crownList = [];
  crownData = {
    page: 1,
    pageSize: 20,
    total: 0,
    Title: '',
    SubTitle: '',
    States: '-1',
    OrderBy: 'Sort',//排序字段
    IsAsc: true, //是否升序
    SortDir: 'DESC'
  };

  // 销售案例 列表
  dataList = [];
  // 销售案例 id 信息
  informationopt = {};
  // 销售案例分页信息
  dataPost = {
    "page": 1,
    "pageSize": 10,
    "total": 0,
    "Title": "",
    "Code": "publish",
    "SubTitle": "",
    "TypeID": "xsal",
    "States": "1",
    "OrderBy": "IsStick",
    "IsAsc": true,
    "SortDir": "DESC"
  };

  isdoInfinite = true;
  no_list = false;
  constructor(private navCtrl: NavController, 
    private serve: numberOneService,
    private loadCtrl: LoadingController) {
    this.getData();
  }

  // 切换 '销冠风采'|'销售案例' 
  switchInformation(title) {
    this.isdoInfinite = true;
    this.no_list = true;
    this.isdoInfinite = true;
    this.dataList = [];
    this.crownList = [];
    this.dataPost.page = 1;
    this.crownData.page = 1;
    this.navli = title;
    this.getData();
  }

  //销售案例
  newsGetNewsList() {
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });
    if(this.dataPost.page==1){
      loading.present();
    }
    this.serve.newsGetNewsList(this.dataPost).subscribe(res => {
      if (res.data.NewsItems.length == 0) {
        this.isdoInfinite = false;
      }
      let arr = res.data.NewsItems;
      this.dataList = this.dataList.concat(arr);
      this.no_list = this.dataList.length == 0 ? true : false;
      if(this.dataPost.page==1){
        loading.dismiss();
      }
    });
  }

  // 销冠风采
  GetNewsList() {
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });
    if(this.dataPost.page==1){
      loading.present();
    }
    this.serve.GetNewsList(this.crownData).subscribe(res => {
      console.log('销冠风采', res);
      if (res.data.NewsItems.length == 0) {
        this.isdoInfinite = false;
      }
      let arr = res.data.NewsItems;
      this.crownList = this.crownList.concat(arr);
      this.no_list = this.crownList.length == 0 ? true : false;
      if(this.dataPost.page==1){
        loading.dismiss();
      }
    });
  };

  // 查看案例详情
  goComponentsdetailsOne(data) {
    data['Id']=data['ID'];
    this.navCtrl.push(NumberOneDetailsComponent, { data: data });
  }
  goComponentsdetails(data){
    data['GetNewsList']='xsal';
    this.navCtrl.push(Componentsdetails,{data:data});
  }

  // 请求数据
  getData() {
    if (this.navli == '销冠风采') {
      this.GetNewsList();
    } else {
      this.newsGetNewsList();
    }
  }

  // 下拉加载更多
  doInfinite(e) {
    console.log('加载')
    this.dataPost.page++;
    this.crownData.page++;
    this.getData();
    setTimeout(() => {
      e.complete();
    }, 1000);
  }

}
