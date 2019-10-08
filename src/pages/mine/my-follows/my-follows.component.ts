import { Component, OnInit } from '@angular/core';
import { timer } from "rxjs/observable/timer";
import { LoadingController, NavController } from 'ionic-angular';
import {TeacherPage} from "../../learning/teacher/teacher";
import { ForumService } from '../../forum/forum.service';
import {LearnService} from "../../learning/learn.service";
import {CommonService} from "../../../core/common.service";
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';

@Component({
  selector: 'page-my-follows',
  templateUrl: './my-follows.component.html',
})
export class MyFollowsComponent implements OnInit {
  navli = '讲师';
  collectionList = [];

  GetSubscribeListpage={
    page: 1, pageSize: 10,
    //  total: 0, TopicID: "", OrderBy: "CreateTime", SortDir: "DESC"
  };
  myfavoritespage = { "PageIndex": 1, "PageSize": 10 };
  isdoInfinite = true;
  constructor(
    public navCtrl: NavController,
    private loadCtrl: LoadingController,
    private forumServe: ForumService,
    private learnSer: LearnService,
    private commonSer: CommonService) { }

  ngOnInit() {
   
  }
  ionViewDidEnter() {
    this.collectionList=[];
    this.GetSubscribeListpage.page=1;
    this.myfavoritespage.PageIndex=1;

    this.is_getData();
  }

  // 关注的帖子
  myfollows() {
    let loading = null;
    if (this.myfavoritespage.PageIndex == 1) {
      loading = this.loadCtrl.create({
        content: ''
      });
      loading.present();
    }
    this.forumServe.myfollows(this.myfavoritespage).subscribe((res: any) => {
      if (this.myfavoritespage.PageIndex == 1) {
        loading.dismiss();
      }
      let arr = res.data.Items;
      arr.forEach(element => {
        element.PostRelativeTime = this.forumServe.PostRelativeTimeForm(element.PostRelativeTime);
      });
      if (arr.length == 0) {
        this.isdoInfinite = false;
      }
      this.collectionList = this.collectionList.concat(arr);
    });
  }

  // 关注的讲师列表
  GetSubscribeList(){
    let loading = null;
    if (this.GetSubscribeListpage.page == 1) {
      loading = this.loadCtrl.create({
        content: ''
      });
      loading.present();
    }
    this.forumServe.GetSubscribeList(this.GetSubscribeListpage).subscribe((res: any) => {
      console.log('关注的讲师',res);
      if (this.GetSubscribeListpage.page == 1) {
        loading.dismiss();
      }
      let arr = res.data.TeacherItems;
      if (arr.length == 0) {
        this.isdoInfinite = false;
      }
      this.collectionList = this.collectionList.concat(arr);
    });
  }
  teachDetail(data) {
    console.log(data);
    data['IsSubscribe'] = true;
    this.navCtrl.push(TeacherPage, {item: data});
}
  // 切换
  switchInformation(text) {
    this.collectionList=[];
    this.isdoInfinite=true;
    this.navli = text;
    this.GetSubscribeListpage.page=1;
    this.myfavoritespage.PageIndex=1;
    this.is_getData();
  }

  //下拉刷新
  doRefresh(e) {
    this.GetSubscribeListpage.page=1;
    this.myfavoritespage.PageIndex=1;
    this.GetSubscribeListpage.page=1;
    this.collectionList=[];
    this.is_getData();
    timer(1000).subscribe(() => { e.complete(); });
  }

  is_getData() {
    if (this.navli == '讲师') {
      this.GetSubscribeList();
    } else {
      this.myfollows();
    }
  }
  isAddData(e) {
    this.GetSubscribeListpage.page++;
    this.myfavoritespage.PageIndex++;
    this.is_getData();

    setTimeout(() => {
      e.complete();
    }, 1000);
  }


  // 关注讲师
 focusHandle(item) {
    const data = {
        TopicID: item.UserID
    };
     this.learnSer.SaveSubscribe(data).subscribe(
        (res) => {
          item['IsDelete']=false;
          this.commonSer.toast('关注成功');
        }
    );
  }

  cancleFocusHandle(item) {
    console.log(item);
    const data = {
        TopicID: item.UserID
    };
    this.learnSer.CancelSubscribe(data).subscribe(
        (res) => {
            item['IsDelete']=true;
            this.commonSer.toast('取消关注成功')
        }
    )
  }
  // 前往帖子详情
  goPostsContent(data) {
    this.navCtrl.push(PostsContentComponent,{data:data});
  }
}
