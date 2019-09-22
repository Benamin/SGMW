import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import { PostlistComponent } from './postlist/postlist.component';

@Component({
  selector: 'page-forum',
  templateUrl: './forum.component.html'
})
export class ForumPage implements OnInit {

  
  constructor(public navCtrl: NavController) {
    this.goPostlist();
   }

  ngOnInit() {
    // this.goPostlist();
  }

  // 前往发帖列表
  goPostlist() {
    this.navCtrl.push(PostlistComponent);
  }

}
