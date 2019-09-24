import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import { PostlistComponent } from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';

@Component({
  selector: 'page-forum',
  templateUrl: './forum.component.html'
})
export class ForumPage implements OnInit {

  
  constructor(public navCtrl: NavController) {
   }

  ngOnInit() {
    this.goPostsContent();
  }
        // 前往帖子详情
        goPostsContent() {
          this.navCtrl.push(PostsContentComponent);
        }
  // 前往发帖列表
  goPostlist() {
    this.navCtrl.push(PostlistComponent);
  }


}
