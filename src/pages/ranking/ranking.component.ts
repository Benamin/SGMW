import { GetRequestService } from './../../secret/getRequest.service';
import { Component, OnInit } from '@angular/core';
import { RankingService} from './ranking.serve';
import { Storage } from "@ionic/storage";
import { LoadingController} from "ionic-angular";
@Component({
  selector: 'page-app-ranking',
  templateUrl: './ranking.component.html'
})
export class RankingComponent implements OnInit {
  navli : 'TeacherViewModel'|'StudentModel'|'examination'='TeacherViewModel';

  listType={
    TeacherViewModel:[{
      key:'TeacherTitleModels',
      name:'头衔榜'
    },{
      key:'UserScoreList',
      name:'评价榜'
    },{
      key:'UserPostList',
      name:'活跃度'
    }],
    StudentModel:[{
       key:'StudentTitleModels',
        name:'头衔榜',
    },{
       key:'StudentFinishCourseViewModels',
      name:'完成课程数'
    },{
       key:'StudentPostList',
      name:'活跃度'
    }],
    examination:[{
      name:'区域',
      },{
      name:'体系'
    }]
  };
  navlistType=[];
  listTypeName={
    TeacherViewModel:{
      key:'TeacherTitleModels',
      name:'头衔榜'
    },
    StudentModel:{
      key:'StudentTitleModels',
      name:'头衔榜',
    },
    examination:'区域'
  };
  GetRankListArr=null;
  phb_1={HeadPhoto:'',UserName:'',ForumTitle:'',ScoreAvg:null,star:null,FinishCount:null,AgentName:null,TotalCount:null};
  phb_2={HeadPhoto:'',UserName:'',ForumTitle:'',ScoreAvg:null,star:null,FinishCount:null,AgentName:null,TotalCount:null};
  phb_3={HeadPhoto:'',UserName:'',ForumTitle:'',ScoreAvg:null,star:null,FinishCount:null,AgentName:null,TotalCount:null};
  mineInfo=null;
  dataList=[];
  constructor(private serve:RankingService,private loadCtrl: LoadingController,private storage: Storage,) {

  }
  
  ngOnInit() {
    console.log('排行榜');
    this.storage.get('user').then(value => {
      if (value) {
          this.mineInfo = value;
          if (this.mineInfo.UserName && this.mineInfo.UserName.length > 3) {
              this.mineInfo.UserName = this.mineInfo.UserName.slice(0, 3) + '...';
          }
      }
      this.navlistType=this.listType.TeacherViewModel;
      this.GetRankList();
      this.GetUsertitleSearch();
    });

  }
  switchInformation(text){
    this.navli = text;
    this.navlistType = this.listType[text];
    let typeKey=this.listTypeName[text].key;
    // this.dataList=this.GetRankListArr[text][typeKey];
    this.showList(this.GetRankListArr[text][typeKey]);
  }
  
  switchInListType(data){
    this.listTypeName[this.navli] = data;
    this.showList(this.GetRankListArr[this.navli][data.key]);
    console.log(this.listTypeName);
  }
  no_list=false;
  MyRankingData=null;
  showList(arr=[]){
    this.dataList=[];
    this.MyRankingData=null;
    this.phb_1=null;
    this.phb_2=null;
    this.phb_3=null;
    this.no_list=false
    if(arr.length==0){
      this.no_list=true;
      return
    }
    if(arr[0]&&arr[0].ScoreAvg){
        arr.forEach(e => {
          e['star']=[]
          for(let n = 0;n <5;n++){
            if(n<e.ScoreAvg){
              e['star'].push(true);
            }else{
              e['star'].push(false);
            }
          }
        })
    }
    if(arr[0]){
      this.phb_1=arr[0];
    }
    if(arr[1]){
      this.phb_2=arr[1];
    }
    if(arr[2]){
      this.phb_3=arr[2];
    }
    // this.dataList = arr.slice(3,10);
    this.dataList = arr.slice(0,10);

    // this.MyRankingData = arr.slice(11);
    this.MyRankingData = arr[11];
    console.log(this.MyRankingData);

  }

  GetRankList(){
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });

    loading.present();
    
    this.serve.GetRankList().subscribe((res:any) => {
      console.log(res);
      this.GetRankListArr=res.data;
      this.switchInListType({key: "TeacherTitleModels",name: "头衔榜"});
      loading.dismiss();
    })
  }
  
  
  GetUsertitleSearch(){
    console.log(this.mineInfo);
    let data={
      forumTitleId: "",
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    userName: this.mineInfo.UserName};
    this.serve.GetUsertitleSearch(data).subscribe(res => {
      console.log(res);
    })
  }
  // /forum/userbadge/rankList

}
