import { Component, OnInit } from '@angular/core';
import { NavParams, NavController} from "ionic-angular";

import {ForumService} from '../forum.service';
import {ViewReplyComponent} from '../view-reply/view-reply.component';

@Component({
  selector: 'page-posts-content',
  templateUrl: './posts-content.component.html',
})
export class PostsContentComponent implements OnInit {
  lidata={Id:'',TopicPlateId:"",Name:""};
  inputText="";
  textareaBlur=false;
  constructor(private serve:ForumService,public navParams: NavParams,public navCtrl: NavController) { }

  ngOnInit() {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata);
    // this.forum_post_get(this.lidata.Id);
    this.forum_post_publish();
  }
  
  forum_post_get(postId){
    // this.serve.forum_post_get(postId).subscribe((res:any) => {
    //   console.log('帖子列表',res);
    //   this.lidata=res.data;
    // })
  }
  textareaclick(){
    this.textareaBlur=true;
    let textDiv:HTMLElement=document.getElementById('textareainp');
    setTimeout(() => {
      textDiv.focus();
    }, 20);
  }
  inputshow_on(){
    this.textareaBlur=false;
  }

  showViewReply(){
    this.navCtrl.push(ViewReplyComponent);
  }
  // 查看帖子详情
  forum_post_publish(){
    console.log('查看帖子详情');
    
    this.serve.forum_post_get({postId:this.lidata.TopicPlateId}).subscribe(res => {
      console.log(res);
    })
  }
}
