import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, LoadingController } from "ionic-angular";

import { ForumService } from '../forum.service';
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
  constructor(
    private serve: ForumService,
    public navParams: NavParams, 
    private navCtrl: NavController,
    private loadCtrl:LoadingController
    ) { }

  ngOnInit() {
    this.data = this.navParams.get('data');
    this.lidata = this.navParams.get('lidata');
    console.log(this.lidata);
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
    let data = {
      "PostReplyId": this.data.Id,//评论的回帖编号
      "Content": this.inputText,//评论内容
      "MentionUser": "",//回复用户的 loginName
      "CurrentUser":""
    }
    this.loading = this.loadCtrl.create({
      content:''
    });
    this.loading.present();
    this.serve.replycomment_add(data).subscribe((res:any) => { 
      console.log(res);
      if(res.code==200){
        // this.navCtrl.pop();
        this.forum_post_publish();
      }
    });
  }

  forum_post_publish() {
    this.serve.forum_post_get({ postId: this.lidata.Id }).subscribe((res: any) => {
      console.log(res);
      res.data.Replys.forEach((element,i )=> {
          if(element.Id==this.data.Id){
            let huifu=element.Comments[element.Comments.length-1];
            huifu['_ReplyTimeFormatted']=huifu.CommentTimeFormatted.slice(0,-3);
            
            this.data.Comments.unshift(huifu);
          }
      });
      this.inputText="";
      this.textareaBlur = false;
      this.loading.dismiss();
    });
  }

}
