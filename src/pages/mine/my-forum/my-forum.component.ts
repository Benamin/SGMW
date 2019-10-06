import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {ForumService} from '../../forum/forum.service';
import {PostAddComponent} from '../../forum/post-add/post-add.component';


@Component({
  selector: 'page-my-forum',
  templateUrl: './my-forum.component.html',
})
export class MyForumComponent implements OnInit {
  navli: '已发布' | '草稿箱' = '已发布';
  isdoInfinite = true;
  no_list = false;
  forumLIst = [];
  pageDate={
    creater: "丁林玲",
    pageIndex: 1,
    pageSize: 10,
    status: 2,
    title: "",
    // topicPlateId: "8dd8410d-5828-6352-3b79-0405039d37dc",
    total: 111,
    OrderBy:'PostTimeFormatted',
    OrderByDirection:'desc'
  }
  constructor(public navCtrl: NavController,
    private serve:ForumService,
    private loadCtrl:LoadingController) { }
  ngOnInit() {
    this.getData();
  }

  // 切换已发布/草稿箱
  switchInformation(text,number) {
    this.navli = text;
    this.navli=text;
    this.pageDate.pageIndex=1;
    this.pageDate.status=number;
    this.forumLIst=[];
    this.getData();
  }

   // 前往帖子详情
  goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
  }

  // 编辑帖子
  editITem(time){
    this.navCtrl.push(PostAddComponent,{data:time});
  }

  isDelShow=false;
  delData=null;
  // 删除帖子
  delITem(data){
    this.delData=data;
    this.isDelShow=true;
    console.log(data);
  }

  // 确定删除
  delOk(){
    this.isDelShow=false;
    console.log(this.delData);
    this.serve.post_delete(this.delData.Id).subscribe((res:any )=> {
      console.log(res);
      if(res.code==200){
        for(let n =0 ;n<this.forumLIst.length;n++){
          if(this.forumLIst[n].Id==this.delData.Id){
            this.forumLIst.splice(n,1)
            n--;
          }
        }
      }
    });
  }

  // 获取数据
  getData() {
    let loading = null;
    if(this.pageDate.pageIndex==1){
      loading = this.loadCtrl.create({
        content:''
      });
      loading.present();
    }
    this.serve.forum_post_search(this.pageDate).subscribe((res:any) => {
      console.log('板块列表',res);
      if(this.pageDate.pageIndex==1){
        loading.dismiss();
      }
      if(!res.data){
        return
      }
      let arr=res.data.Items;
      arr.forEach(element => {
        element.PostRelativeTime=this.serve.PostRelativeTimeForm(element.PostRelativeTime);
      });
      if(arr.length==0){
        this.isdoInfinite=false;
      }
      this.forumLIst = this.forumLIst.concat(arr);
      this.serve.listSplice(this.forumLIst);
  
    });
  }

  // 下拉加载更多
  doInfinite(e) {
    console.log('加载')
    this.pageDate.pageIndex++;
    this.getData();
    setTimeout(() => {
      e.complete();
    }, 1000);
  }
  doRefresh(e){
    console.log('刷新')
    this.pageDate.pageIndex=1;
    this.forumLIst=[];
    this.getData();
    setTimeout(() => {
        e.complete();
    }, 1000);
}

}