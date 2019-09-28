import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';

import { PostlistComponent } from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ForumService} from './forum.service';

import {ViewReplyComponent} from './view-reply/view-reply.component';
@Component({
  selector: 'page-forum',
  templateUrl: './forum.component.html'
})
export class ForumPage implements OnInit {

  forumLIst=[];
  constructor(public navCtrl: NavController,private serve:ForumService) {
   }

  ngOnInit() {
    this.forum_topicplate_list();
    // this.goPostsContent();
    this.showViewReply()
  }
  // 前往 评论列表
  showViewReply(){
    this.navCtrl.push(ViewReplyComponent);
  }
        // 前往帖子详情
  goPostsContent() {
    this.navCtrl.push(PostsContentComponent);
  }
  // 前往发帖列表
  goPostlist(data) {
    this.navCtrl.push(PostlistComponent,{data:data});
  }

  forum_topicplate_list(){
    this.serve.forum_topicplate_list().subscribe((res:any) => {
      console.log('板块列表',res);
      this.forumLIst=res.data;
    })
  }


}
