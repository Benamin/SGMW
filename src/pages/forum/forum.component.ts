import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ForumService} from './forum.service';
import {SearchPage} from "../home/search/search";
import { PostlistComponent } from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ViewReplyComponent} from './view-reply/view-reply.component';
import {PostAddComponent} from './post-add/post-add.component';

@Component({
  selector: 'page-forum',
  templateUrl: './forum.component.html'
})
export class ForumPage implements OnInit {

  forumLIst=[];
  isdoInfinite=true;
  no_list=false;
  pageDate={
    creater: "",
    name: "",
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  }
  ForumHistory=[];
  navli :'热帖'|'板块'='热帖';

  constructor(public navCtrl: NavController,private serve:ForumService,private storage: Storage,private loadCtrl: LoadingController) {
  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.forumLIst=[];
    this.pageDate.pageIndex=1;
    this.initData();
  }
  
  // 前往 评论列表
  showViewReply(){
    this.navCtrl.push(ViewReplyComponent);
  }

  // 前往帖子详情
  goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
  }

  // 新增帖子
  PostAddComponent(){
    this.navCtrl.push(PostAddComponent);
  }

  // 前往发帖列表
  goPostlist(data) {
    this.navCtrl.push(PostlistComponent,{data:data});
  }
  initData(){
    if(this.navli=='板块'){
      this.forum_topicplate_search();
      this.getHistory();
    }else{
      this.getLIistData();
    }

  }
  doInfinite(e){
    console.log('加载');
    this.pageDate.pageIndex++;
    this.forum_topicplate_search();
    setTimeout(() => {
        e.complete();
    }, 1000);
  }

  forum_topicplate_search(){
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });
    if(this.pageDate.pageIndex==1){
      loading.present();
      setTimeout(() => {
        loading.present();
      }, 7000);
    }
    this.serve.forum_topicplate_search(this.pageDate).subscribe((res:any) => {
      console.log('板块列表',res);
      if(!res.data){
        return
      }
      let arr=res.data.Items;
      if(arr.length==0){
        this.isdoInfinite=false;
      }
  
      this.forumLIst = this.forumLIst.concat(arr);
      this.no_list= this.forumLIst.length == 0 ? true:false;
      loading.dismiss();
    })
  }

  // 获取 浏览历史 数据
  getHistory(){
    let userForumHistory:any= window.localStorage.getItem('userForumHistory');
    if(userForumHistory){
      this.ForumHistory=JSON.parse(userForumHistory);
    }else{
      this.ForumHistory=[];
    }
    console.log('历史记录',this.ForumHistory)
  }
  doRefresh(e){
    console.log('刷新')
    this.pageDate.pageIndex=1;
    this.isdoInfinite=true;
    this.forumLIst=[];
    this.getHistory();
    this.forum_topicplate_search();
    setTimeout(() => {
        e.complete();
    }, 1000);
  }

  goToSearch() {
    this.navCtrl.push(SearchPage,{type:'论坛'});
  }
  
  switchInformation(text){
    this.navli=text;
    this.forumLIst=[];
    this.pageDate.pageIndex=1;
    this.initData();
  }

  getLIistData(){
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });
    loading.present();
    this.serve.GetPostSearchhotpost().subscribe((res:any) => {
      loading.dismiss();
      if(res.data){
        this.forumLIst=res.data.UnTopPosts.Items;
        this.no_list=this.forumLIst.length>0?false:true;
      }
      console.log(res);
    });
  }

}
