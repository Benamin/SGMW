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
  textareaBlur = true;
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
    "FollowCount": '0',
    "LikeCount": '0',
    "DislikeCount": 0, 
    "FavoritesCount":  '1',
     "ReplyCount": 1
  };
  // 查看帖子详情
  constructor(private serve: ForumService, 
    public navParams: NavParams, 
    public navCtrl: NavController,
    private loadCtrl:LoadingController) { }

  ngOnInit() {
    this.lidata = this.navParams.get('data');
    this.forum_post_publish();
  }

  textareaclick() {
    this.textareaBlur = true;
    // setTimeout(() => {
    //   let textDiv: HTMLElement = document.getElementById('textareainp');
    //   console.log(textDiv);
    //   textDiv.focus();
    // }, 20);
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
      // loading.present();
    this.serve.forum_post_get({ postId: this.lidata.Id }).subscribe((res: any) => {
      console.log(res);
      let element = res.data;
      element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime);

      if(res.data.Replys){
        res.data.Replys.forEach(element => {
          element['_ReplyTimeFormatted']=element.ReplyTimeFormatted.slice(0,-3)
        });
        res.data.Replys.reverse();
      }
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
    let loading = this.loadCtrl.create({
      content:''
    });
    loading.present();
    this.serve.forum_post_get({ postId: this.lidata.Id }).subscribe((res: any) => {
      this.dataCon['ReplyCount'] =  res.data.ReplyCount;
      this.dataCon['Replys']=this.dataCon['Replys']?this.dataCon['Replys']:[];
      if(res.data.Replys){
        res.data.Replys.forEach((element,i )=> {
          if( !this.dataCon['Replys'][i] ){
            element['_ReplyTimeFormatted']=element.ReplyTimeFormatted.slice(0,-3)
            this.dataCon['Replys'].unshift(element);
          }
        });
      }
      loading.dismiss();
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
    let loading = this.loadCtrl.create({
      content:''
    });
    loading.present();
    this.serve.follow(data.Id).subscribe((res: any) => {
      console.log(res);
      data['is_guanzhu']=true;
      this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount'])+1+'';
      loading.dismiss();
    });
  }  
   // 取消关注
  cancelfollow(data) {
    let loading = this.loadCtrl.create({
      content:''
    });
    loading.present();
    this.serve.cancelfollow(data.Id).subscribe((res: any) => {
      console.log(res);
      data['is_guanzhu']=false;
      this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount'])-1+'';
      loading.dismiss();

      // this.reasizeData();
    });
  }

    // 收藏
    favorites(data) {
      let loading = this.loadCtrl.create({
        content:''
      });
       loading.present();
      this.serve.favorites(data.Id).subscribe((res: any) => {
        console.log(res);
        data['is_collect']=true;
        this.dataCon['FavoritesCount'] = parseInt(this.dataCon['FavoritesCount'])+1+'';
         loading.dismiss();
        // this.reasizeData();
      });
    }
  
    // 取消收藏
    cancelfavorites(data) {
      let loading = this.loadCtrl.create({
        content:''
      });
       loading.present();
      this.serve.cancelfavorites(data.Id).subscribe((res: any) => {
        data['is_collect']=false;
        this.dataCon['FavoritesCount'] = parseInt(this.dataCon['FavoritesCount'])-1+'';
         loading.dismiss();
        // this.reasizeData();
      });
    }

  // 点赞
  forum_post_like(data) {
    let loading = this.loadCtrl.create({
      content:''
    });
     loading.present();
    this.serve.forum_post_like(data.Id).subscribe((res: any) => {
      console.log(res);
      data['is_like']=true;
      this.dataCon['LikeCount'] = parseInt(this.dataCon['LikeCount'])+1+'';
       loading.dismiss();
      // this.reasizeData();
    });
  }

  // 取消点赞
  forum_post_cancellike(data) {
    let loading = this.loadCtrl.create({
      content:''
    });
     loading.present();
    this.serve.forum_post_cancellike(data.Id).subscribe((res: any) => {
      data['is_like']=false;
      this.dataCon['LikeCount'] = parseInt(this.dataCon['LikeCount'])-1+'';
       loading.dismiss();
      // this.reasizeData();
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
      console.log(res);
      this.inputText="";
      if(res.code==200){
        this.textareaBlur = false;
        this.reasizeData();
      }
    });
  }

}
