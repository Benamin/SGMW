import { Component, OnInit } from '@angular/core';
import {LoadingController} from 'ionic-angular';

import { MineService } from './medal.serve';
import {Storage} from "@ionic/storage";
@Component({
  selector: 'page-medal',
  templateUrl: './medal.component.html'
})
export class MedalComponent implements OnInit {

  medalListDivShow=false;
  actionSheet=false;
  mineInfo=null;
  actionSheetList=[];
  badgeShowArr=[];
  setBadge={};
  no_list=false;
  constructor(private serve:MineService,private storage: Storage,private loadCtrl: LoadingController) {
    this.storage.get('user').then(value => {
      if (value) {
          this.mineInfo = value;
       
      }
      this.GetUserbadgeSearch();
    });
  }
  ngOnInit() {
  }
  setCurrentMedal(){
    this.actionSheet=true;
    this.setBadge={};
    this.actionSheetList.forEach(e => {
      this.setBadge[e.BadgeId]=e.IsDisplay;
    });
    setTimeout(() => {
      this.medalListDivShow = true;
    }, 20);
  }

  setCurrentMedalHide(){
    this.medalListDivShow = false;
    setTimeout(() => {
      this.actionSheet=false;
    }, 200);
  }

  GetUserbadgeSearch(){
    console.log( this.mineInfo);
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });
    loading.present();
    let data={pageIndex: 1, pageSize: 100, total: 0, userName: this.mineInfo.UserName, badgeName: ""};
    this.serve.GetUserbadgeSearch(data).subscribe((res:any) => {
      console.log(res);
      loading.dismiss();
      if(!res.data){
        return;
      }
      console.log('获取勋章',this.mineInfo.UserId);
      res.data.Items.forEach(element => {     
         console.log('勋章id',element,element.UserId);

        if((this.mineInfo.UserId&&element.UserId == this.mineInfo.UserId) || (this.mineInfo.LoginUserID&&element.UserId == this.mineInfo.LoginUserID)){
          if(element.Badges.length==0){
            this.no_list=true;
          }
          this.actionSheetList=element.Badges;
        }
      });
   
      this.badgeShowArr= this.actionSheetList.filter(e => e.IsDisplay);
    });
  }
  showOrhide(item){
    if(this.setBadge[item.BadgeId]){
      this.hideSheet(item);
    }else{
      this.showSheet(item);
    }
  }
  showSheet(item){
      let IsDisplayNum=0; // 最多只能显示两个
      for(let n in this.setBadge){
        if(this.setBadge[n]){
          IsDisplayNum++;
        }
        if(IsDisplayNum==2){
          this.setBadge[n] = false;
        }
      }
      this.setBadge[item.BadgeId] = true;
  }
  hideSheet(item){
      this.setBadge[item.BadgeId]=false;
  }

  async SetUserbadge(){
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });
    loading.present();
    let arr = [];
    for(let n in this.setBadge){
      if(this.setBadge[n]){
        arr.push(n);
      }
    }
    const loadData=() => {
      loading.dismiss();
      this.setCurrentMedalHide();
      this.GetUserbadgeSearch();
    }

    let badgeIds={
      badgeIds:arr
    }
    this.serve.userbadgeShowlist(arr).subscribe(res => {
      console.log('tag', '设置完成');
      loading.dismiss();
      this.setCurrentMedalHide();
      this.GetUserbadgeSearch();
    });
  }

  // hideSserbadge
  // 0: "7c0ea782-3247-4eb6-b1f6-016df098fdbc"
  // 1: "55efcd4a-10e7-47ec-8069-016df0996fb7"
  // 2: "7a90d86e-f31b-49e6-80a3-016df09a24c1"
}
