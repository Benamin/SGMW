import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-app-ranking',
  templateUrl: './ranking.component.html'
})
export class RankingComponent implements OnInit {
  navli : 'teacher'|'student'|'examination'='teacher';

  listType={
    teacher:[{
      name:'头衔榜'
    },{
      name:'评价榜'
    },{
      name:'活跃度'
    }],
    student:[{
        name:'头衔榜',
    },{
      name:'完成课程数'
    },{
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
    teacher:'头衔榜',
    student:'头衔榜',
    examination:'区域'
  };
  dataList=[
    {name:'秋国艳',index:'4',src:'/assets/imgs/forum/other/p771_avatar1@3x.jpg',grade:'至尊王者 I'},
    {name:'秋国艳',index:'5',src:'/assets/imgs/forum/other/p771_avatar1@3x.jpg',grade:'至尊王者 I'},
    {name:'秋国艳',index:'6',src:'/assets/imgs/forum/other/p771_avatar1@3x.jpg',grade:'至尊王者 I'},
    {name:'秋国艳',index:'7',src:'/assets/imgs/forum/other/p771_avatar1@3x.jpg',grade:'至尊王者 I'},
    {name:'秋国艳',index:'8',src:'/assets/imgs/forum/other/p771_avatar1@3x.jpg',grade:'至尊王者 I'},
    {name:'秋国艳',index:'9',src:'/assets/imgs/forum/other/p771_avatar1@3x.jpg',grade:'至尊王者 I'},
    {name:'秋国艳',index:'10',src:'/assets/imgs/forum/other/p771_avatar1@3x.jpg',grade:'至尊王者 I'},

  ];
  constructor() {}

  ngOnInit() {
    this.navlistType=this.listType.teacher;
  }
  switchInformation(text){
    this.navli=text;
    this.navlistType=this.listType[text];
  }
  
  switchInListType(data){
    this.listTypeName[this.navli] = data.name;
    console.log(this.listTypeName);
  }

}
