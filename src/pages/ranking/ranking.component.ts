import {GetRequestService} from './../../secret/getRequest.service';
import {Component, OnInit} from '@angular/core';
import {RankingService} from './ranking.serve';
import {Storage} from "@ionic/storage";
import {LoadingController} from "ionic-angular";
import {LogService} from "../../service/log.service";

@Component({
    selector: 'page-app-ranking',
    templateUrl: './ranking.component.html'
})
export class RankingComponent implements OnInit {
    navli: 'TeacherViewModel' | 'StudentModel' | 'examination' = 'TeacherViewModel';

    listType = {
        TeacherViewModel: [{
            key: 'TeacherTitleModels',
            name: '头衔榜'
        }, {
            key: 'UserScoreList',
            name: '评价榜'
        }, {
            key: 'UserPostList',
            name: '活跃度'
        }],
        StudentModel: [{
            key: 'StudentTitleModels',
            name: '头衔榜',
        }, {
            key: 'StudentFinishCourseViewModels',
            name: '完成课程数'
        }, {
            key: 'StudentPostList',
            name: '活跃度'
        }],
        examination: [{
            key: 'AreaExamTopList',
            name: '区域',
        }, {
            key: 'ManageExamTopList',
            name: '体系'
        }]
    };
    navlistType = [];
    listTypeName = {
        TeacherViewModel: {
            key: 'TeacherTitleModels',
            name: '头衔榜'
        },
        StudentModel: {
            key: 'StudentTitleModels',
            name: '头衔榜',
        },
        examination: {
            key: 'AreaExamTopList',
            name: '区域',
        },
    };
    GetRankListPage={
        TeacherViewModel:{ // 讲师榜
            TeacherTitleModels:1 , // 头衔榜
            UserScoreList:1 , // 评价榜
            UserPostList:1 , // 活跃度
        },
        StudentModel:{ // 学员榜
            StudentTitleModels:1, // 头衔
            StudentPostList:1,  // 完成课程数
            StudentFinishCourseViewModels:1, // 活跃度
        },
      
    }
    GetRankListArr:any = {
        TeacherViewModel:{ // 讲师榜
            TeacherTitleModels:[] , // 头衔榜
            UserScoreList:[] , // 评价榜
            UserPostList:[] , // 活跃度
        },
        StudentModel:{ // 学员榜
            StudentTitleModels:[], // 头衔
            StudentPostList:[],  // 完成课程数
            StudentFinishCourseViewModels:[], // 活跃度
        },
        examination:{ // 考试榜
            Exam:{},
            AreaExamTopList:[], // 地区
            ManageExamTopList:[], // 体系
        }
    };
    phb_1 = {
        HeadPhoto: '',
        UserName: '',
        ForumTitle: '',
        ScoreAvg: null,
        star: null,
        FinishCount: null,
        AgentName: null,
        TotalCount: null
    };
    phb_2 = {
        HeadPhoto: '',
        UserName: '',
        ForumTitle: '',
        ScoreAvg: null,
        star: null,
        FinishCount: null,
        AgentName: null,
        TotalCount: null
    };
    phb_3 = {
        HeadPhoto: '',
        UserName: '',
        ForumTitle: '',
        ScoreAvg: null,
        star: null,
        FinishCount: null,
        AgentName: null,
        TotalCount: null
    };
    mineInfo = null;
    dataList = [];
    examinationData={Exam:{EName:"",Extend1:'',TotalScore:""},AreaExamTopList:[],ManageExamTopList:[]}
    constructor(private serve: RankingService, private loadCtrl: LoadingController, private storage: Storage,
                private logSer:LogService) {

    }

    ngOnInit() {
        console.log('排行榜');
       
        this.logSer.visitLog('pxb');
        this.storage.get('user').then(value => {
            if (value) {
                this.mineInfo = value;
                if (this.mineInfo.UserName && this.mineInfo.UserName.length > 3) {
                    this.mineInfo.UserName = this.mineInfo.UserName.slice(0, 3) + '...';
                }
            }
            this.navlistType = this.listType.TeacherViewModel;
            this.GetRankList();
            this.GetUsertitleSearch();
        });

    }
    getExamTopList( ){
        // api/exam/getExamTopList
        // this.GetRankListArr = res.data;
        console.log('列表信息', this.GetRankListArr) ;
        this.serve.getExamTopList().subscribe((res:any) => {
            if(res.data){
                if(Array.isArray(res.data.AreaExamTopList)){
                    res.data.AreaExamTopList.forEach(item => {
                        item['UserName']= item.Name;
                        item['FinishCount']= item.AvgScoreStr;
                    })
                }
                if(Array.isArray(res.data.ManageExamTopList)){
                    res.data.ManageExamTopList.forEach(item => {
                        item['UserName']=  item.Name;
                        item['FinishCount']= item.AvgScoreStr;
                        
                    })
                }
                this.GetRankListArr['examination']=res.data;
                this.examinationData = res.data;
            }
            console.log('获取考试排行榜信息',res,this.examinationData);
        })
    }

    switchInformation(text) {
        this.navli = text;
        this.navlistType = this.listType[text];
        let typeKey = this.listTypeName[text].key;
        this.switchInListKey=this.listTypeName[text];
        console.log('切换',this.listTypeName[text])
        // StudentTitleModels TeacherViewModel
        // this.dataList=this.GetRankListArr[text][typeKey];
        this.isdoInfinite=true;
        this.showList(this.GetRankListArr[text][typeKey]);
    }
    switchInListKey={
        key: 'TeacherTitleModels',
        name: '头衔榜'
    };
    switchInListType(data) {
        this.switchInListKey=data;
        this.listTypeName[this.navli] = data;
        console.log(this.GetRankListArr,'数据组');
        this.dataList=[];
        this.showList(this.GetRankListArr[this.navli][data.key]);
        console.log(this.listTypeName);
    }

    no_list = false;
    MyRankingData = null;

    showList(arr = []) {
        this.dataList = [];
        this.MyRankingData = null;
        this.phb_1 = null;
        this.phb_2 = null;
        this.phb_3 = null;
        this.no_list = false
        if (arr.length == 0) {
            this.no_list = true;
            return
        }
        if (arr[0] && arr[0].ScoreAvg) {
            arr.forEach(e => {
                e['star'] = []
                for (let n = 0; n < 5; n++) {
                    if (n < e.ScoreAvg) {
                        e['star'].push(true);
                    } else {
                        e['star'].push(false);
                    }
                }
            })
        }

        arr.sort((a, b) => {
            if (a.RankNum) {
                return parseInt(a.RankNum) - parseInt(b.RankNum);
            }

        });
        
        if (arr[0]) {
            this.phb_1 = arr[0];
        }
        if (arr[1]) {
            this.phb_2 = arr[1];
        }
        if (arr[2]) {
            this.phb_3 = arr[2];
        }
        // let new_arr=arr.slice(3);
        this.dataList = arr.slice(3);
        // new_arr.forEach((e,i) => {
        //     if(!this.dataList[i]){
        //         this.dataList[i]=e
        //     }
        // })

        // this.dataList = arr.slice(0,10);

        // this.MyRankingData = arr.slice(11);
        // if (arr[10]) {
        //     this.MyRankingData = arr[10];
        // }

    }

    GetRankList() {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });

        loading.present();

        this.serve.GetRankList().subscribe((res: any) => {
            this.GetRankListArr = res.data;
            this.getExamTopList();
            this.switchInListType({key: "TeacherTitleModels", name: "头衔榜"});
            loading.dismiss();
        })
    }


    GetUsertitleSearch() {
        let data = {
            forumTitleId: "",
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            userName: this.mineInfo.UserName
        };
        this.serve.GetUsertitleSearch(data).subscribe(res => {
            console.log(res);
        })
    }

    // /forum/userbadge/rankList
    isdoInfinite=true;
    Infinite(e){
        console.log('模块',this.navli,this.listTypeName[this.navli] );
   
        this.GetRankListPage[this.navli][this.switchInListKey.key]++;
        let data={
            "OrderBy": "",
            "OrderByDirection": "",
            "PageIndex": this.GetRankListPage[this.navli][this.switchInListKey.key],
            "PageSize": 10
        }

        let key=this.switchInListKey.key;
        if(this.navli=='TeacherViewModel'){// 讲师榜
            if(key=='TeacherTitleModels'){ //头衔榜
                this.badgeteachertitlelist(data);
            }
            if(key=='UserScoreList'){ //评价榜
                this.teachscorelist(data);
            }
            if(key=='UserPostList'){ //讲师 活跃度
                this.teacherpostlist(data);
            }
        }
        if(this.navli=='StudentModel'){ // 学院 榜
            if(key=='StudentTitleModels'){ //头衔榜
                this.studenttitlelist(data);
            }
            if(key=='StudentFinishCourseViewModels'){ //完成课程数
                this.studentstudylist(data);
            }
            if(key=='StudentPostList'){ //活跃度
                this.studentpostlist(data);
            }
        //     key: 'StudentTitleModels',
        //     name: '头衔榜',
        // }, {
        //     key: 'StudentFinishCourseViewModels',
        //     name: '完成课程数'
        // }, {
        //     key: 'StudentPostList',
        //     name: '活跃度'
        }

        setTimeout(() => {
            e.complete();
        }, 1000);
        console.log('页码',this.GetRankListPage);
      
    }
    //讲师头衔
    badgeteachertitlelist(data){
        this.serve.badgeteachertitlelist(data).subscribe((res:any) => {
            if(res.data.Items.length>0){
                this.addlist(res.data)
            }else{
                this.isdoInfinite=false;
            }
        })
    }
    //讲师活跃度
    teacherpostlist(data){
        this.serve.teacherpostlist(data).subscribe((res:any) => {
            if(res.data.Items.length>0){
                this.addlist(res.data)
            }else{
                this.isdoInfinite=false;
            }
        })
    }

    //讲师评论
    teachscorelist(data){
        this.serve.teachscorelist(data).subscribe((res:any) => {
            if(res.data.Items.length>0){
                this.addlist(res.data)
            }else{
                this.isdoInfinite=false;
            }
        })
    }

    // 学员榜
    studenttitlelist(data){
        this.serve.studenttitlelist(data).subscribe((res:any) => {
            if(res.data.Items.length>0){
                this.addlist(res.data)
            }else{
                this.isdoInfinite=false;
            }
        })
    }

    // 学员活跃度
    studentpostlist(data){
        this.serve.studentpostlist(data).subscribe((res:any) => {
            if(res.data.Items.length>0){
                this.addlist(res.data)
            }else{
                this.isdoInfinite=false;
            }
        })
    }
    
    // 加载更多学员完成课程数
    studentstudylist(data){
        this.serve.studentstudylist(data).subscribe((res:any) => {
            if(res.data.Items.length>0){
                this.addlist(res.data)
            }else{
                this.isdoInfinite=false;
            }
        })
    }


    addlist(data){
        let arr=data.Items;
        let oldarr=this.GetRankListArr[this.navli][this.switchInListKey.key];
        this.GetRankListArr[this.navli][this.switchInListKey.key] = oldarr.concat(arr);
        this.showList(this.GetRankListArr[this.navli][this.switchInListKey.key]);
    }
    
}
