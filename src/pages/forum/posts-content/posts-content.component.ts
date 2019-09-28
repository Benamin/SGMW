import { Component, OnInit } from '@angular/core';
import { NavParams} from "ionic-angular";
import {ForumService} from '../forum.service';
@Component({
  selector: 'page-posts-content',
  templateUrl: './posts-content.component.html',
})
export class PostsContentComponent implements OnInit {
  lidata={Id:''};
  inputText="";
  textareaBlur=false;

  constructor(private serve:ForumService,public navParams: NavParams) { }

  ngOnInit() {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata);
    // this.forum_post_get(this.lidata.Id);
  }

  forum_post_get(postId){
    this.serve.forum_post_get(postId).subscribe((res:any) => {
      console.log('帖子列表',res);
      this.lidata=res.data;
    })
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
}
