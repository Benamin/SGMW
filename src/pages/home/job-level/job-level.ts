import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {JobLevelInfoPage} from "../job-level-info/job-level-info";


@Component({
    selector: 'page-job-level',
    templateUrl: 'job-level.html',
})
export class JobLevelPage {
    page = {
        jobLevelList: [],
        PositionName: '',
        Search: "",//岗位认证名称
        Page: 1,
        PageSize: 10,
        TotalCount: null,
        isLoad: false,
        Type: 1 //int类型1-推荐、2-所有、3-我的
    };
    navliArr = [{
        lable: 'recommend',
        text: '推荐'
    }, {
        lable: 'all',
        text: '所有'
    }, {
        lable: 'mine',
        text: '我的'
    }];
    checkType = "recommend";

    constructor(public navCtrl: NavController, private homeSer: HomeService,
                private loadCtrl: LoadingController, private keyboard: Keyboard) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ionViewDidLoad() {
        this.getList();
    }

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            Search: this.page.Search,
            Page: 1,
            PageSize: this.page.PageSize,
            Type: this.page.Type
        };
        this.homeSer.GetJobLevelList(data).subscribe(
            (res) => {
                // for (var i=0;i<res.data.Items.length; i++) {
                //     res.data.Items[i].OverPercentage = 34;
                // } // 测试数据
                this.page.PositionName = res.data.PositionName
                this.page.jobLevelList = this.tranTimeArea(res.data.Items);
                this.page.TotalCount = res.data.TotalCount;
                this.page.isLoad = true;
                loading.dismiss();
                // console.log('GetJobLevelList', res);
            }
        )
    }

    tranTimeArea(listsArr) {
        let newListsArr = listsArr;
        for (var i=0; i<listsArr.length; i++) {
            if (newListsArr[i].StartTime && newListsArr[i].EndTime) {
                let startTimeArr = newListsArr[i].StartTime.split('T');
                let endTimeArr = newListsArr[i].EndTime.split('T');
                let startTime = startTimeArr[0] + ' ' + startTimeArr[1].split(':')[0] + ':' + startTimeArr[1].split(':')[1];
                let endTime = endTimeArr[0] + ' ' + endTimeArr[1].split(':')[0] + ':' + endTimeArr[1].split(':')[1];
                newListsArr[i].timeArea = startTime + ' 至 ' + endTime;
            }
        }
        return newListsArr
    }

    //按键
    search(event) {
        if (event && event.keyCode == 13) {
            this.page.Page = 1;
            this.getList();
            //搜索
            // if (this.page.Title) this.logSer.keyWordLog(this.page.Title);
        }
    }

    showKey() {
        this.keyboard.show();
    }

    changeCheckType(checkType) {
        if (this.checkType === checkType) return;
        this.checkType = checkType;
        if (checkType === 'recommend') this.page.Type = 1;
        if (checkType === 'all') this.page.Type = 2;
        if (checkType === 'mine') this.page.Type = 3;
        this.page.Page = 1;
        this.getList();
    }

    // 前往岗位认证详情
    goJobLevelInfo(e) {
        this.navCtrl.push(JobLevelInfoPage, {id: e.ID});
    }

    //加载更多
    doInfinite(e) {
        if (this.page.jobLevelList.length == this.page.TotalCount || this.page.jobLevelList.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.Page++;
        const data = {
            Search: this.page.Search,
            Page: this.page.Page,
            PageSize: this.page.PageSize,
            Type: this.page.Type
        };
        this.homeSer.GetJobLevelList(data).subscribe(
            (res) => {
                this.page.jobLevelList = this.tranTimeArea(this.page.jobLevelList.concat(res.data.Items));
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.Page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

}
