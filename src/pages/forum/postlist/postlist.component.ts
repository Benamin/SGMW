import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import { NavParams} from "ionic-angular";
import {ForumService} from '../forum.service';
import {PostsContentComponent} from '../posts-content/posts-content.component';
import {PostAddComponent} from '../post-add/post-add.component';
import {SearchPage} from "../../home/search/search";
@Component({
  selector: 'page-postlist',
  templateUrl: './postlist.component.html'
})
export class PostlistComponent implements OnInit {
  lidata={Id:""};
  IsTopOpt=null;
  pageDate:any={
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
  forumLIst=[{
    Images:[]
  }];
  isdoInfinite=true;
  no_list=false;
  
  constructor(private serve:ForumService,
    public navParams: NavParams,
    public navCtrl: NavController,
    private loadCtrl:LoadingController){ }
  
  ngOnInit() {
    this.lidata = this.navParams.get('data');
    this.pageDate.topicPlateId=this.lidata.Id;  // 测试时使用初始化 ID 默认使用默认板块
    this.forum_post_search();
  }


  // 我收藏的帖子
  myfavorites(){
    this.serve.myfavorites({"PageIndex": 1,"PageSize": 10}).subscribe(res => {
      console.log('我收藏的帖子',res)
    })
  }
  

  // 前往帖子详情
  goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
  }
  // 新增帖子
  PostAddComponent(data){
    this.navCtrl.push(PostAddComponent,{data:data});
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
    let loading = null;
    if(this.pageDate.PageIndex==1){
      loading = this.loadCtrl.create({
        content:''
      });
      loading.present();
    }
    this.serve.forum_post_search(this.pageDate).subscribe((res:any) => {
      console.log('板块列表',res);
      if(this.pageDate.PageIndex==1){
        loading.dismiss();
      }
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
        element.PostRelativeTime=this.serve.PostRelativeTimeForm(element.PostRelativeTime);
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

  doRefresh(e){
    console.log('刷新')
    this.pageDate.page=1;
    this.forumLIst=[];
    this.forum_post_search();
    setTimeout(() => {
        e.complete();
    }, 1000);
  }

  goToSearch() {
    this.navCtrl.push(SearchPage,{type:'论坛'});
  }
}
