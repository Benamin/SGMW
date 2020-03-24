import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {ListsRankingPage} from "../lists-ranking/lists-ranking";
import {TotalRankingPage} from "../total-ranking/total-ranking";
import {EditPage} from "../edit/edit";
import {VideoBoxPage} from "../../short-video/video-box/video-box";
import {HomeService} from "../../home.service";

/**
 * 销售大赛 列表
 * 考试项目列表（第几轮考试列表）
 *    |-某一轮考试（项目）的列表
 * 帖子
 *    |-所有帖子
 *      |-最新
 *      |-最热
 *    |-帖子排行榜
 *      |-所有
 *      |-东区
 * 短视频
 *    |-所有视频
 *      |-最新
 *      |-最热
 *    |-大赛排行榜
 *      |-所有
 *      |-东区
 */

@Component({
    selector: 'page-lists',
    templateUrl: 'lists.html',
})
export class CompetitionListsPage {
    userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
        checkType: 'short-video',
        navliArr: [{
            lable: 'exam',
            text: '考试',
            secNav: null
        }, {
            lable: 'topic',
            text: '帖子',
            secNav: [
                {
                    navBtnText: '所有帖子',
                    navBtnEn: 'allTopic',
                    isActived: true,
                    thrNav: [
                        {
                            navBtnText: '最新',
                            navBtnEn: 'new',
                            isActived: true
                        },
                        {
                            navBtnText: '最热',
                            navBtnEn: 'hot',
                            isActived: false
                        }
                    ]
                },
                {
                    navBtnText: '帖子排行榜',
                    navBtnEn: 'topicCompetition',
                    isActived: false,
                    thrNav: null
                }
            ]
        }, {
            lable: 'short-video',
            text: '短视频',
            secNav: [
                {
                    navBtnText: '我的视频',
                    navBtnEn: 'myVideo',
                    isActived: true,
                    thrNav: [
                        {
                            navBtnText: '最新',
                            navBtnEn: 'new',
                            isActived: true
                        },
                        {
                            navBtnText: '最热',
                            navBtnEn: 'hot',
                            isActived: false
                        }
                    ]
                },
                {
                    navBtnText: '大赛排行榜',
                    navBtnEn: 'ranking',
                    isActived: false,
                    thrNav: null
                }
            ]
        }],

        competitionLists: [],
        getListsApi: null, // 请求接口服务
        competitionParam: null,
        getParams: null
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController, private homeSer: HomeService) {
    }

    ionViewDidLoad() {
        let competitionParam = this.navParams.get('competitionParam');
        if (competitionParam.userArea && competitionParam.userArea != 'null') {
            // 帖子区域
            this.page.navliArr[1].secNav[1].thrNav = [
                {
                    navBtnText: '所有',
                    navBtnEn: 'all',
                    isActived: true
                },
                {
                    navBtnText: '东区',
                    navBtnEn: 'area',
                    isActived: false
                }
            ];
            // 帖子区域
            this.page.navliArr[2].secNav[1].thrNav = [
                {
                    navBtnText: '所有',
                    navBtnEn: 'all',
                    isActived: true
                },
                {
                    navBtnText: '东区',
                    navBtnEn: 'area',
                    isActived: false
                }
            ];
        }
        if (competitionParam.cid) {
            this.page.competitionParam = competitionParam;
            this.page.getParams = {
                topicID: this.page.competitionParam.cid,
                Page: 1,
                PageSize: 10,
                TotalCount: null,
                isLoad: false
            };

            this.getList();
        } else if (!competitionParam.cid) {
            console.log('大赛id不存在')
        }
    }


    // 一级导航切换 （注：考试不会有）
    changeCheckType(checkType) {
        if (this.page.checkType === checkType) return;
        this.page.checkType = checkType;
        // if (checkType === 'recommend') this.page.Type = 1;
        // if (checkType === 'all') this.page.Type = 2;
        // if (checkType === 'mine') this.page.Type = 3;
        // this.page.Page = 1;
        this.getList();
    }

    // 二级导航切换 （注：考试不会有）
    changeSecNav(typeIndex, secNavIndex, bool) {
        if (bool) return;
        var otherIndex = 1
        if (secNavIndex === 1) otherIndex = 0;
        this.page.navliArr[typeIndex].secNav[otherIndex].isActived = false;
        this.page.navliArr[typeIndex].secNav[secNavIndex].isActived = true;
    }

    // 三级导航切换
    changeThrNav(typeIndex, secNavIndex, thrNavIndex, bool) {
        console.log(999, this.page.navliArr)
        if (bool === true) return;
        var otherIndex = 1
        if (thrNavIndex === 1) otherIndex = 0;
        this.page.navliArr[typeIndex].secNav[secNavIndex].thrNav[otherIndex].isActived = false;
        this.page.navliArr[typeIndex].secNav[secNavIndex].thrNav[thrNavIndex].isActived = true;
    }

    // 点击更多进入总排名列表 本期不加
    // goTotalRanking() {
    //     this.navCtrl.push(TotalRankingPage);
    // }

    // 进入考试排名列表
    goListsRanking(tid) {
        this.navCtrl.push(ListsRankingPage, {tid: tid});
    }

    // 进入图片/视频 编辑页面
    goToEdit() {
        this.navCtrl.push(EditPage, {editType: 'topic'});
    }

    // 进入视频播放页
    goVideoBox(vid) {
        this.navCtrl.push(VideoBoxPage, {vid: vid});
    }

    // 获取列表
    getList() {
        let params = {}
        params = {
            topicID: this.page.competitionParam.cid,
            Page: 1,
            PageSize: this.page.getParams.PageSize
        };
        // 判断是考试/帖子/短视频
        if (this.page.checkType === this.page.navliArr[0].lable) {
            this.page.getListsApi = (data) => { return this.homeSer.GetExamProList(data) };
        } else if (this.page.checkType === this.page.navliArr[1].lable) {
            // 帖子
            if (this.page.navliArr[1].secNav[0].isActived === true) {
                // 帖子最新/最热
                this.page.getListsApi = (data) => { return this.homeSer.GetAllTopicLists(data) };;
            } else if (this.page.navliArr[1].secNav[1].isActived === true) {
                // 帖子排行榜
                this.page.getListsApi = (data) => { return this.homeSer.GetTopicCompetitionLists(data) };
            }
        } else if(this.page.checkType === this.page.navliArr[2].lable) {
            // 短视频
            if (this.page.navliArr[1].secNav[0].isActived === true) {
                // 短视频最新/最热
                this.page.getListsApi = (data) => { return this.homeSer.GetShortVideoLists(data) };
            } else if (this.page.navliArr[1].secNav[1].isActived === true) {
                // 短视频排行榜
                this.page.getListsApi = (data) => { return this.homeSer.GetShortVideoCompitLists(data) };
            }
        }

        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.page.getListsApi(params).subscribe(
            (res) => {
                let Lists = res.data.Items
                if(this.page.checkType === this.page.navliArr[2].lable) { // 判断是短视频就处理 返回的时间
                    for (var i=0; i<Lists.length; i++) {
                        Lists[i].VideoMinute = this.formatSeconds(Lists[i].VideoMinute);
                    }
                }
                this.page.competitionLists = Lists;
                console.log(888, res.data)
                this.page.getParams.TotalCount = res.data.TotalCount;
                this.page.getParams.isLoad = true;
                loading.dismiss();
            }, err => {
                console.log(err)
                loading.dismiss();
            }
        )
    }


    //下拉刷新
    doRefresh(e) {
        this.page.getParams.Page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

    //加载更多
    doInfinite(e) {
        if (this.page.competitionLists.length == this.page.getParams.TotalCount || this.page.competitionLists.length > this.page.getParams.TotalCount) {
            e.complete();
            return;
        }
        this.page.getParams.Page++;
        let params = {
            topicID: this.page.competitionParam.cid,
            Page: this.page.getParams.Page,
            PageSize: this.page.getParams.PageSize
        };

        this.page.getListsApi(params).subscribe(
            (res) => {
                let Lists = res.data.Items
                if(this.page.checkType === this.page.navliArr[2].lable) { // 判断是短视频就处理 返回的时间
                    for (var i=0; i<Lists.length; i++) {
                        Lists[i].VideoMinute = this.formatSeconds(Lists[i].VideoMinute);
                    }
                }
                this.page.competitionLists = this.page.competitionLists.concat(Lists);
                this.page.getParams.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    formatSeconds($times){
        let $result = '00:00';
        if ($times>0){
            let $hour = Math.floor($times/3600);
            let $minute = Math.floor(Math.floor($times%3600)/60);
            let $second = Math.floor(($times-60 * $minute) % 60);
            let $hourStr = ''
            let $minuteStr = ''
            let $secondStr = ''
            if ($hour < 10) {
                $hour == 0 ? $hourStr = '' : $hourStr = '0' + $hour + ':';
            }
            if($minute<10){
                $minuteStr = "0" + $minute;
            }
            if($second<10){
                $secondStr = "0" + $second;
            }
            $result =  $hourStr + $minuteStr + ':' + $secondStr;
        }
        return $result
    }
}
