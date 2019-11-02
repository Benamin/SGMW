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
    "FollowCount": '0',
    "LikeCount": '0',
    "DislikeCount": 0, 
    "FavoritesCount":  null,
     "ReplyCount": null
  };
  // 查看帖子详情
  constructor(private serve: ForumService, 
    public navParams: NavParams, 
    public navCtrl: NavController,
    private loadCtrl:LoadingController) { }

  ngOnInit() {
    
  }
  ionViewDidEnter() {
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
    this.navCtrl.push(ViewReplyComponent,{data:data,lidata:this.lidata});
  }
  loading;
  async forum_post_publish() {
      this.loading = this.loadCtrl.create({
        content:''
      });
      this.loading.present();
      this.serve.forum_post_get({ postId: this.lidata.Id }).subscribe((res: any) => {
      
     if(res.code!=200){
       this.serve.presentToast(res.message);
       return this.loading.dismiss();
     }
      let element = res.data;
      element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime);

      if(res.data.Replys&&res.code==200){
        res.data.Replys.forEach(element => {
          if(element['PosterUserName'].length>4){
            element['PosterUserName']=element.PosterUserName.slice(0,4)+'...';
          }
          if(!element['PosterUserForumTitle']){
            element['PosterUserForumTitle']={
              ForumTitle:'',
            };
          }
          if(element['PosterUserForumTitle'].ForumTitle.length>3){
            element['PosterUserForumTitle'].ForumTitle=element['PosterUserForumTitle'].ForumTitle.slice(0,3)+'...';
          } 
          if(element.PosterBadges){
            element.PosterBadges.forEach(e => {
              if(e['BadgeName'].length>4){
                e['BadgeName']=e['BadgeName'].slice(0,4)+'...';
              } 
            });
          }
        
          element['_ReplyTimeFormatted']=element.ReplyTimeFormatted.slice(0,-3);
        });
        res.data.Replys.reverse();
      }
      this.dataCon = res.data;
      this.dataCon['is_like'] = false;
      this.dataCon['is_guanzhu'] = false;
      this.dataCon['is_collect'] = false;

      this.serve.GetForumPostOtherStatus(this.dataCon.Id).subscribe((res:any)  => {
        this.dataCon['is_like'] = res.data.is_like;
        this.dataCon['is_guanzhu'] = res.data.is_guanzhu;
        this.dataCon['is_collect'] = res.data.is_collect;
        this.loading.dismiss();
      },err => {
        this.loading.dismiss();
      });

      // const p= Promise.all([this.is_like(this.dataCon),this.is_guanzhu(this.dataCon),this.is_collect(this.dataCon)]);
      // p.then(res => {
      //   this.loading.dismiss();
      // });

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
      // GetForumInfoGetMyInfo
      this.dataCon['Replys'].forEach(time => {

      });
    //   const data = {
    //     pageSize: this.page.pageSize,
    //     page: this.page.page,
    //     TopicType: this.TopicType,   //teacher  course
    //     topicID: this.topicID
    // };
    // this.serve.GeECommentGetComment(data).subscribe(res => {
      
    // })

      this.dataCon['is_like'] = false;
      this.dataCon['is_guanzhu'] = false;
      this.dataCon['is_collect'] = false;

      this.serve.GetForumPostOtherStatus(this.dataCon.Id).subscribe((res:any)  => {
        this.dataCon['is_like'] = res.data.is_like;
        this.dataCon['is_guanzhu'] = res.data.is_guanzhu;
        this.dataCon['is_collect'] = res.data.is_collect;
        loading.dismiss();
      },err => {
        loading.dismiss();
      });


      // const p= Promise.all([this.is_like(this.dataCon),this.is_guanzhu(this.dataCon),this.is_collect(this.dataCon)]);
      // p.then(res => {
      //   loading.dismiss();
      // });


    });
  }

  async is_like(data) {
    await  this.serve.forum_post_like(data.Id).subscribe((res: any) => {
      if(res.code==200){
        this.serve.forum_post_cancellike(data.Id);
      }else if(res.code==300){
        data['is_like']=true;
      }
    });
  }

  async is_guanzhu(data){
    await this.serve.follow(data.Id).subscribe((res: any) => {
      if(res.code==200){
        this.serve.cancelfollow(data.Id).subscribe((res: any) => {});
      }else if(res.code==300){
        data['is_guanzhu']=true;
      }
    });
  }

  async is_collect(data){  // 收藏
    await this.serve.favorites(data.Id).subscribe((res: any) => {
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
  reply_add_click=false;
  reply_add(){
    if(!this.inputText){
      return this.serve.presentToast('请输入评论内容');
    }
    let data =  {
        "PostId":  this.dataCon.Id,//帖子编号
        "Content": this.inputText,//回帖内容
      }
      let loading = this.loadCtrl.create({
        content:''
      });
      loading.present();
    this.reply_add_click=true
    this.serve.reply_add(data).subscribe((res:any) => {
      console.log(res);
      this.inputText="";
      if(res.code==200){
        this.textareaBlur = false;
        this.reply_add_click=false;
        this.reasizeData();
      }
      loading.dismiss();
    });
  }


}
