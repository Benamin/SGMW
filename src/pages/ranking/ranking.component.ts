import { Component, OnInit } from '@angular/core';
import { RankingService} from './ranking.serve';
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
  phb_1={HeadPhoto:'',UserName:'',ForumTitle:'',ScoreAvg:null,star:null,FinishCount:null};
  phb_2={HeadPhoto:'',UserName:'',ForumTitle:'',ScoreAvg:null,star:null,FinishCount:null};
  phb_3={HeadPhoto:'',UserName:'',ForumTitle:'',ScoreAvg:null,star:null,FinishCount:null};

  dataList=[
  ];
  constructor(private serve:RankingService,private loadCtrl: LoadingController) {}
  
  ngOnInit() {
    console.log('排行榜');
    this.navlistType=this.listType.TeacherViewModel;
    this.GetRankList();
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
  showList(arr=[]){
    this.dataList=[];
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
    this.dataList = arr.slice(3);
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

  // /forum/userbadge/rankList

}
