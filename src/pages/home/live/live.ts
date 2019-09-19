import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-live',
  templateUrl: 'live.html',
})
export class LivePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  navbarList=[
    { type:"0",name:"全部" },
    { type:"1",name:"今天" },
  ];

  ionViewDidLoad() {
    console.log('ionViewDidLoad LivePage');
  }

  changeType(e){

  }

}
