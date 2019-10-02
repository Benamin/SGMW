import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import { ForumService } from '../../forum/forum.service';
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';

@Component({
  selector: 'page-my-thumbs-up',
  templateUrl: './my-thumbs-up.component.html'
})
export class MyThumbsUpComponent implements OnInit {

  data=[];
  isdoInfinite=true;
  constructor(private serve :ForumService,
    public navCtrl: NavController,
    private loadCtrl:LoadingController,
   ) { 
  }

  ngOnInit() {
    this.mylikes();
  }

  page={"PageIndex": 1,"PageSize": 10};
  mylikes(){
    let loading = null;
    if(this.page.PageIndex==1){
      loading = this.loadCtrl.create({
        content:''
      });
      loading.present();
    }
    this.serve.mylikes(this.page).subscribe((res:any) => {
        console.log('帖子列表',res);
      if(!res.data){
        return
      }
      let arr=res.data.Items;
      arr.forEach(element => {
        element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime );
      });

      if(arr.length==0){
        this.isdoInfinite=false;
      }
      if(this.page.PageIndex==1){
        loading.dismiss();
      }
      this.data = this.data.concat(arr);
      console.log('帖子列表',res.data.Items);
    });
  }
    // 前往帖子详情
  goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
  }
  lodaData(e){
    this.page.PageIndex++;
    this.mylikes();
    setTimeout(() => {
      e.complete();
    }, 1000);
  }
  forum_post_cancellike(data,index){
    console.log(index);
    this.data.splice(index,1);
    this.serve.forum_post_cancellike(data.Id).subscribe((res:any) => {
      if(res.code==200){
      }
    })
  }

  doRefresh(e){
    console.log('刷新')
    this.page.PageIndex=1;
    this.data=[];
    this.mylikes();
    setTimeout(() => {
        e.complete();
    }, 1000);
  }
}
