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
  dataCon={
    "SetTopTime": "0001-01-01T00:00:00",
    "LockTime": "0001-01-01T00:00:00",
    "PosterHeadPhoto": "https://devstoragec.blob.core.chinacloudapi.cn/picture/userdefault120190826174653.jpg", 
    "Replys": [{ "Id": "51da3402-9e08-4487-996f-016d7d896c9f", "PostId": "ff123bcf-1c4e-448d-8f12-016d7d6a9350", 
    "Content": "测试回帖内容77b1627c2f4e4de8b4fee44f386b49fc", "PostTitle": null, "IsAdminDeleted": false, 
    "ReplyTime": "2019-09-29T15:00:21.279517", "ReplyTimeFormatted": "2019-09-29 15:00:21", "PosterUserName": "ShuaiHua Du", 
    "ReplyHeadPhoto": "https://devstoragec.blob.core.chinacloudapi.cn/picture/userdefault120190826174653.jpg", "CommentCount": 0, "Comments": [] }], 
    "Id": "ff123bcf-1c4e-448d-8f12-016d7d6a9350", "Title": "SGMW企业介绍@637053639995678171", 
    "TopicPlateId": "8dd8410d-5828-6352-3b79-0405039d37dc", 
    "TopicPlateName": "默认版块",
    "Content": "",
    "Status": 2, 
    "StatusName": "发帖成功",
     "IsTop": false, 
     "IsLocked": false, "Poster": "ShuaiHua Du", "PostTimeFormatted": "2019-09-29 14:26:39",
      "PostRelativeTime": "22 hours ago", "FollowCount": 1, "LikeCount": 0,
       "DislikeCount": 0, "FavoritesCount": 1, "ReplyCount": 1
  };
  // 查看帖子详情
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

  forum_post_publish(){
    console.log('查看帖子详情');
    
    this.serve.forum_post_get({postId:this.lidata.Id}).subscribe((res:any) => {
      console.log(res);
      let element =res.data;
        // element.PostRelativeTime
       element.PostRelativeTime = element.PostRelativeTime.replace('second','秒');
       element.PostRelativeTime = element.PostRelativeTime.replace('minute','分钟');
       element.PostRelativeTime = element.PostRelativeTime.replace('hour','小时');
       element.PostRelativeTime = element.PostRelativeTime.replace('day','天');
       element.PostRelativeTime = element.PostRelativeTime.replace('week','周');
       element.PostRelativeTime = element.PostRelativeTime.replace('month','个月');
       element.PostRelativeTime = element.PostRelativeTime.replace('quarter','个季度');
       element.PostRelativeTime = element.PostRelativeTime.replace('year','年');

       element.PostRelativeTime = element.PostRelativeTime.replace(' ',"");
       element.PostRelativeTime = element.PostRelativeTime.replace(' ',"");
       element.PostRelativeTime = element.PostRelativeTime.replace('ago',"前");
      
      this.dataCon=res.data;
    })
  }
}
