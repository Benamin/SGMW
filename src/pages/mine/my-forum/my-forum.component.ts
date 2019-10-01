import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';

@Component({
  selector: 'page-my-forum',
  templateUrl: './my-forum.component.html',
})
export class MyForumComponent implements OnInit {
  navli: '已发布' | '草稿箱' = '已发布';
  isdoInfinite = true;
  no_list = false;
  forumLIst = [];
  pageDate={
    creater: "",
    pageIndex: 1,
    pageSize: 10,
    status: 2,
    title: "",
    topicPlateId: "8dd8410d-5828-6352-3b79-0405039d37dc",
    total: 111,
    OrderBy:'PostTimeFormatted',
    OrderByDirection:'desc'
  }
  constructor(public navCtrl: NavController) { }
  ngOnInit() {
  }

  switchInformation(text) {
    this.navli = text
  }
   // 前往帖子详情
  goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
  }

  // 获取数据
  getData() {

  }
  // 下拉加载更多
  doInfinite(e) {
    console.log('加载')
    this.pageDate.pageIndex++;
    this.getData();
    setTimeout(() => {
      e.complete();
    }, 1000);
  }

}
