import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import { NavParams} from "ionic-angular";
import {ForumService} from '../forum.service';
import {PostsContentComponent} from '../posts-content/posts-content.component';
import {PostAddComponent} from '../post-add/post-add.component';
@Component({
  selector: 'page-postlist',
  templateUrl: './postlist.component.html'
})
export class PostlistComponent implements OnInit {
  lidata={Id:""};
  IsTopOpt=null;
  pageDate={
    creater: "",
    pageIndex: 1,
    pageSize: 10,
    status: 2,
    title: "",
    topicPlateId: "8dd8410d-5828-6352-3b79-0405039d37dc",
    total: 111,
    OrderBy:'PostTimeFormatted',
    OrderByDirection:'desc'
  }
  forumLIst=[];
  isdoInfinite=true;
  no_list=false;

  constructor(private serve:ForumService,public navParams: NavParams,public navCtrl: NavController){ }

  ngOnInit() {
    this.lidata = this.navParams.get('data');
    this.pageDate.topicPlateId=this.lidata.Id;  // 测试时使用初始化 ID 默认使用默认板块
    this.forum_post_search();
  }
  // 前往帖子详情
  goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
  }
  // 新增帖子
  PostAddComponent(){
    this.navCtrl.push(PostAddComponent);
  }

  avtNav(type){
    this.isdoInfinite=true;
    this.forumLIst = [];
    this.pageDate.pageIndex=1;
    this.pageDate.OrderBy=type;

    this.forum_post_search();
  }

  // 获取帖子列表
  forum_post_search(){
    this.serve.forum_post_search(this.pageDate).subscribe((res:any) => {
      console.log('板块列表',res);
      if(!res.data){
        return
      }
      let arr=res.data.Items;
      if(!this.IsTopOpt){
        for(let n=0;n<arr.length;n++){
          if(arr[n].IsTop){
              this.IsTopOpt=arr[n];
              break;
          }
          console.log(n);
        }
      }
      arr.forEach(element => {
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
      });

      if(arr.length==0){
        this.isdoInfinite=false;
      }
      this.forumLIst = this.forumLIst.concat(arr);
      this.no_list= this.forumLIst.length == 0 ? true:false;
      console.log('帖子列表',res.data.Items);
    });
  }
  doInfinite(e){
    console.log('加载');
    this.pageDate.pageIndex++;
    this.forum_post_search();
    setTimeout(() => {
        e.complete();
    }, 1000);
  }
}
