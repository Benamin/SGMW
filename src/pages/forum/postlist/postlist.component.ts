import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import { NavParams} from "ionic-angular";
import {ForumService} from '../forum.service';
import {PostsContentComponent} from '../posts-content/posts-content.component';
@Component({
  selector: 'page-postlist',
  templateUrl: './postlist.component.html'
})
export class PostlistComponent implements OnInit {
  lidata={Id:""};
  constructor(private serve:ForumService,public navParams: NavParams,public navCtrl: NavController){ }

  ngOnInit() {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata);
    this.serve.forum_post_get(this.lidata.Id).subscribe(res => {console.log(res)});
  }
  // 前往帖子详情
  goPostsContent() {
    this.navCtrl.push(PostsContentComponent);
  }
}
