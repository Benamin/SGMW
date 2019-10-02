import { Component, OnInit } from '@angular/core';
import { NavParams, NavController,LoadingController } from "ionic-angular";

import { ForumService } from '../forum.service';
import { ViewReplyComponent } from '../view-reply/view-reply.component';

@Component({
  selector: 'page-posts-content',
  templateUrl: './posts-content.component.html',
})
export class PostsContentComponent implements OnInit {
  lidata = { Id: '', TopicPlateId: "", Name: "" };
  inputText = "";
  textareaBlur = false;
  dataCon = {
    "SetTopTime": "0001-01-01T00:00:00",
    "LockTime": "0001-01-01T00:00:00",
    "PosterHeadPhoto": "",
    "Replys": [],
    "Id": "", 
    "Title": "",
    "TopicPlateId": 
    "8dd8410d-5828-6352-3b79-0405039d37dc",
    "TopicPlateName": "",
    "Content": "",
    "Status": 2,
    "StatusName": "",
    "IsTop": false,
    "IsLocked": false, 
    "Poster": "",
     "PostTimeFormatted": "2019-09-29 14:26:39",
    "PostRelativeTime": "",
     "FollowCount": 1,
      "LikeCount": 0,
    "DislikeCount": 0, 
    "FavoritesCount": 1,
     "ReplyCount": 1
  };
  // 查看帖子详情
  constructor(private serve: ForumService, 
    public navParams: NavParams, 
    public navCtrl: NavController,
    private loadCtrl:LoadingController) { }

  ngOnInit() {
    this.lidata = this.navParams.get('data');
    // console.log(this.lidata);
    this.forum_post_publish();
  }

  textareaclick() {
    this.textareaBlur = true;
    let textDiv: HTMLElement = document.getElementById('textareainp');
    setTimeout(() => {
      textDiv.focus();
    }, 20);
  }
  inputshow_on() {
    this.textareaBlur = false;
  }


  // 前往回复列表
  showViewReply(data) {
    this.navCtrl.push(ViewReplyComponent,{data:data});
  }

  forum_post_publish() {
    // this.lidata.Id='C1F48775-C0EE-4A32-87BB-016D7D4C5F08';
    console.log('查看帖子详情');
      let loading = this.loadCtrl.create({
        content:''
      });
      loading.present();
    this.serve.forum_post_get({ postId: this.lidata.Id }).subscribe((res: any) => {
      console.log(res);
      let element = res.data;
      element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime);
      this.dataCon = res.data;
      this.dataCon['is_like'] = false;
      this.dataCon['is_guanzhu'] = false;
      this.dataCon['is_collect'] = false;
      this.is_like(this.dataCon);
      this.is_guanzhu(this.dataCon);
      this.is_collect(this.dataCon);
      loading.dismiss();
    });
  }

  reasizeData(){
    this.serve.forum_post_get({ postId: this.lidata.Id }).subscribe((res: any) => {
      this.dataCon['FavoritesCount'] =  res.data.FavoritesCount;
      this.dataCon['LikeCount'] =  res.data.LikeCount;
      this.dataCon['FollowCount'] =  res.data.FollowCount;
      this.dataCon['Replys'] =  res.data.Replys;

    });
  }

  is_like(data) {
    this.serve.forum_post_like(data.Id).subscribe((res: any) => {
      if(res.code==200){
        this.serve.forum_post_cancellike(data.Id).subscribe((res: any) => {});
      }else if(res.code==300){
        data['is_like']=true;
      }
    });
  }

  is_guanzhu(data){
    this.serve.follow(data.Id).subscribe((res: any) => {
      if(res.code==200){
        this.serve.cancelfollow(data.Id).subscribe((res: any) => {});
      }else if(res.code==300){
        data['is_guanzhu']=true;
      }
    });
  }

  is_collect(data){  // 收藏
    this.serve.favorites(data.Id).subscribe((res: any) => {
      if(res.code==200){
        this.serve.cancelfavorites(data.Id).subscribe((res: any) => {});
      }else if(res.code==300){
        data['is_collect']=true;
      }
    });
  }
  
   // 关注
   follow(data) {
    this.serve.follow(data.Id).subscribe((res: any) => {
      console.log(res);
      data['is_guanzhu']=true;
      this.reasizeData();
    });
  }  
   // 取消关注
  cancelfollow(data) {
    this.serve.cancelfollow(data.Id).subscribe((res: any) => {
      console.log(res);
      data['is_guanzhu']=false;
      this.reasizeData();
    });
  }

    // 收藏
    favorites(data) {
      this.serve.favorites(data.Id).subscribe((res: any) => {
        console.log(res);
        data['is_collect']=true;
        this.reasizeData();
      });
    }
  
    // 取消收藏
    cancelfavorites(data) {
      this.serve.cancelfavorites(data.Id).subscribe((res: any) => {
        data['is_collect']=false;
        this.reasizeData();
      });
    }

  // 点赞
  forum_post_like(data) {
    this.serve.forum_post_like(data.Id).subscribe((res: any) => {
      console.log(res);
      data['is_like']=true;
      this.reasizeData();
    });
  }

  // 取消点赞
  forum_post_cancellike(data) {
    this.serve.forum_post_cancellike(data.Id).subscribe((res: any) => {
      data['is_like']=false;
      this.reasizeData();
    });
  }


  // 评论帖子
  reply_add(){
    if(!this.inputText){
      return 
    }
    let data =  {
        "PostId":  this.dataCon.Id,//帖子编号
        "Content": this.inputText,//回帖内容
     
      }
    this.serve.reply_add(data).subscribe((res:any) => {
      console.log(res)
      if(res.code==200){
        this.textareaBlur = false;
        this.reasizeData();
      }
    });
  }

}
