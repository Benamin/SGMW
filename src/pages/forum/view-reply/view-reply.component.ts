import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, LoadingController } from "ionic-angular";
import { ForumService } from '../forum.service';
import {Storage} from "@ionic/storage";
@Component({
  selector: 'page-view-reply',
  templateUrl: './view-reply.component.html'
})
export class ViewReplyComponent implements OnInit {
  textareaBlur = false;
  inputText = "";
  data = { Id: "",PostId:"" ,Comments:[]};
  lidata = { Id: '', TopicPlateId: "", Name: "" };
  loading=null;
  mineInfo=null;
  constructor(
    private serve: ForumService,
    public navParams: NavParams, 
    private navCtrl: NavController,
    private loadCtrl:LoadingController,
    private storage: Storage

    ) { }

  ngOnInit() {
    this.data = this.navParams.get('data');
    this.lidata = this.navParams.get('lidata');
    this.storage.get('user').then(value => {
      this.mineInfo = value;
      console.log(this.mineInfo )
    })
    if(this.data.Comments&&this.data.Comments.length>0){
      this.data.Comments.forEach((element,i )=> {
          element['_ReplyTimeFormatted']=element.CommentTimeFormatted.slice(0,-3)
      });
      this.data.Comments.reverse();
    }
    
  }
  textareaclick() {
    this.textareaBlur = true;
  }
  inputshow_on() {
    this.textareaBlur = false;
  }

  
  replycomment_add() {
    if(!this.inputText){
      this.serve.presentToast('请输入内容');
      return ;
    }
    let data = {
      "PostReplyId": this.data.Id,//评论的回帖编号
      "Content": this.inputText,//评论内容
      "MentionUser": this.mineInfo.UserId,//回复用户的 loginName
      "CurrentUser":""
    }
    this.loading = this.loadCtrl.create({
      content:''
    });
    this.loading.present();
    this.textareaBlur = false;
    this.serve.replycomment_add(data).subscribe((res:any) => { 
      
      if(res.code==200){
        this.forum_post_publish();
      }else{
        this.loading.dismiss();
        return  this.serve.presentToast(res.message);
      }
    });
  }

  forum_post_publish() {
    this.serve.forum_post_get({ postId: this.lidata.Id }).subscribe((res: any) => {
      if(res.code!=200){
        this.loading.dismiss();
        return  this.serve.presentToast(res.message);
      }
      res.data.Replys.forEach((element,i )=> {
          if(element.Id==this.data.Id){
            let huifu=element.Comments[element.Comments.length-1];
            huifu['_ReplyTimeFormatted']=huifu.CommentTimeFormatted.slice(0,-3);
            
            this.data.Comments.unshift(huifu);
          }
      });
      this.inputText="";
      this.loading.dismiss();
    });
  }



}
