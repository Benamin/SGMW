import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';

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
      this.actionSheetList=res.data.Items[0].Badges;
    });
  }
  
  SetUserbadgeAssign(){
    let data={ BadgeIds:["7c0ea782-3247-4eb6-b1f6-016df098fdbc","55efcd4a-10e7-47ec-8069-016df0996fb7"]}
      this.serve.SetUserbadgeAssign(data).subscribe(res => {
        console.log(res);
      });
  }
//   0: "7c0ea782-3247-4eb6-b1f6-016df098fdbc"
// 1: "55efcd4a-10e7-47ec-8069-016df0996fb7"
// 2: "7a90d86e-f31b-49e6-80a3-016df09a24c1"
}
