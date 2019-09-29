import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ForumService} from './forum.service';

import { PostlistComponent } from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ViewReplyComponent} from './view-reply/view-reply.component';
import {PostAddComponent} from './post-add/post-add.component';

@Component({
  selector: 'page-forum',
  templateUrl: './forum.component.html'
})
export class ForumPage implements OnInit {

  forumLIst=[];
  isdoInfinite=true;
  no_list=false;
  pageDate={
    creater: "",
    name: "",
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  }

  constructor(public navCtrl: NavController,private serve:ForumService,private storage: Storage) {
  }

  ngOnInit() {
    this.forum_topicplate_search();
    // this.goPostsContent();
    // this.showViewReply()
    this.getHistory();
    // this.PostAddComponent();
  }
  // 前往 评论列表
  showViewReply(){
    this.navCtrl.push(ViewReplyComponent);
  }

  // 前往帖子详情
  goPostsContent() {
    this.navCtrl.push(PostsContentComponent);
  }

  // 新增帖子
  PostAddComponent(){
    this.navCtrl.push(PostAddComponent);
  }

  // 前往发帖列表
  goPostlist(data) {
    let userForumHistory:any= window.localStorage.getItem('userForumHistory');
    let arr=[data];
    if(userForumHistory){
      userForumHistory=JSON.parse(userForumHistory);
      userForumHistory.forEach(element => {
        if(data.Id!==element.Id){
          arr.push(element);
        }
      });
    }
    arr.length = arr.length>2?2:arr.length;
    window.localStorage.setItem('userForumHistory', JSON.stringify(arr));
    this.navCtrl.push(PostlistComponent,{data:data});
  }

  doInfinite(e){
    console.log('加载');
    this.pageDate.pageIndex++;
    this.forum_topicplate_search();
    setTimeout(() => {
        e.complete();
    }, 1000);
  }

  forum_topicplate_search(){
    this.serve.forum_topicplate_search(this.pageDate).subscribe((res:any) => {
      console.log('板块列表',res);
      if(!res.data){
        return
      }
      let arr=res.data.Items;
      if(arr.length==0){
        this.isdoInfinite=false;
      }
      // this.forumLIst = res.data.Items;
      this.forumLIst = this.forumLIst.concat(arr);
      this.no_list= this.forumLIst.length == 0 ? true:false;
    })
  }

  ForumHistory=[];
  // 获取 浏览历史 数据
  getHistory(){
    let userForumHistory:any= window.localStorage.getItem('userForumHistory');
    if(userForumHistory){
      this.ForumHistory=JSON.parse(userForumHistory);
    }
    console.log('历史记录',this.ForumHistory)
  }





}
