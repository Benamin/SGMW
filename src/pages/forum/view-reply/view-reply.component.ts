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
  data = { Id: "",PostId:"" };
  constructor(
    private serve: ForumService,
    public navParams: NavParams, 
    private navCtrl: NavController,
    ) { }

  ngOnInit() {
    this.data = this.navParams.get('data');
    console.log(this.data);
  }
  textareaclick() {
    this.textareaBlur = true;
    let textDiv: HTMLElement = document.getElementById('textareainpview');
    setTimeout(() => {
      textDiv.focus();
    }, 20);
  }
  inputshow_on() {
    this.textareaBlur = false;
  }


  replycomment_add() {
    let data = {
      "PostReplyId": this.data.Id,//评论的回帖编号
      "Content": this.inputText,//评论内容
      "MentionUser": "丁林玲",//回复用户的 loginName
      "CurrentUser":"丁林玲"
    }
    this.serve.replycomment_add(data).subscribe((res:any) => { 
      console.log(res);
      if(res.code==200){
        this.navCtrl.pop();
      }
    });
  }

}
