import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {PostsContentComponent} from '../posts-content/posts-content.component';
@Component({
  selector: 'page-postlist',
  templateUrl: './postlist.component.html'
})
export class PostlistComponent implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }
  // 前往帖子详情
  goPostsContent() {
    this.navCtrl.push(PostsContentComponent);
  }
}
