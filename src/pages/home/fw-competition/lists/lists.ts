import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, MenuController} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home.service";

/**
 * 服务大赛 排行榜 列表
 *
 *    |-所有
 *    |-区域
 *    |-省份
 * 短视频 列表
 */

@Component({
    selector: 'page-lists',
    templateUrl: 'lists.html',
})
export class CompetitionFWPage {
    userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
        myInfo: null,
        checkType: 'rank',
        navliArr: [
            {
                lable: 'rank',
                text: '排行榜',
                secNav: [
                    {
                        navBtnText: '所有',
                        navBtnEn: 'all',
                        isActived: true
                    },
                    {
                        navBtnText: '区域',
                        navBtnEn: 'area',
                        isActived: false
                    },
                    {
                        navBtnText: '省份',
                        navBtnEn: 'province',
                        isActived: false
                    }
                ]
            },
            {
                lable: 'short-video',
                text: '短视频',
                secNav: null
            }, ],

        competitionLists: [],
        getListsApi: null, // 请求接口服务
        competitionParam: null,
        getParams: null,
        hasArea: false,
        rankingLists: [],
        sidebarData: [
            {
                type: 'all',
                typeText: '所有',
                isActivedAll: true,
                changeTypeArr: null
            },
            {
                type: 'area',
                typeText: '区域',
                isActivedAll: true,
                changeTypeArr: [{
                    id: 0,
                    text: '江浙泸',
                    actived: false
                },
                {
                    id: 1,
                    text: '珠三角',
                    actived: false
                },
                {
                    id: 2,
                    text: '港澳台',
                    actived: false
                },
                {
                    id: 3,
                    text: '海外',
                    actived: false
                }]
            },
            {
                type: 'province',
                typeText: '省份',
                isActivedAll: true,
                changeTypeArr: [{
                    id: 0,
                    text: '安徽',
                    actived: false
                },
                {
                    id: 1,
                    text: '福建',
                    actived: false
                },
                {
                    id: 2,
                    text: '甘肃',
                    actived: false
                },
                {
                    id: 3,
                    text: '广东',
                    actived: false
                },
                {
                    id: 4,
                    text: '广西',
                    actived: false
                },
                {
                    id: 5,
                    text: '贵州',
                    actived: false
                },
                {
                    id: 6,
                    text: '海南',
                    actived: false
                },
                {
                    id: 7,
                    text: '河北',
                    actived: false
                },
                {
                    id: 8,
                    text: '河南',
                    actived: false
                },
                {
                    id: 9,
                    text: '湖北',
                    actived: false
                },
                {
                    id: 10,
                    text: '湖南',
                    actived: false
                },
                {
                    id: 11,
                    text: '江苏',
                    actived: false
                },
                {
                    id: 12,
                    text: '黑龙江',
                    actived: false
                },
                {
                    id: 13,
                    text: '江西',
                    actived: false
                },
                {
                    id: 14,
                    text: '吉林',
                    actived: false
                },
                {
                    id: 15,
                    text: '辽宁',
                    actived: false
                },
                {
                    id: 16,
                    text: '内蒙古',
                    actived: false
                },
                {
                    id: 17,
                    text: '宁夏',
                    actived: false
                },
                {
                    id: 18,
                    text: '青海',
                    actived: false
                },
                {
                    id: 19,
                    text: '山东',
                    actived: false
                },
                {
                    id: 20,
                    text: '山西',
                    actived: false
                },
                {
                    id: 21,
                    text: '陕西',
                    actived: false
                },
                {
                    id: 22,
                    text: '四川',
                    actived: false
                },
                {
                    id: 23,
                    text: '西藏',
                    actived: false
                },
                {
                    id: 24,
                    text: '新疆',
                    actived: false
                },
                {
                    id: 25,
                    text: '云南',
                    actived: false
                },
                {
                    id: 26,
                    text: '浙江',
                    actived: false
                },
                {
                    id: 27,
                    text: '香港',
                    actived: false
                },
                {
                    id: 28,
                    text: '澳门',
                    actived: false
                },
                {
                    id: 29,
                    text: '台湾',
                    actived: false
                }]
            }
        ],
        nowClick: 'all',
        dataIndex: null,
        arrIndex: null
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private loadCtrl: LoadingController,
        private homeSer: HomeService,
        public menuCtrl: MenuController
    ) {}

    ionViewDidEnter() {
        this.page.rankingLists = [
            {
                Rankid: 4,
                headPhoto: null,
                UserName: '秋国艳',
                serveNum: '621212',
                province: '江苏省',
                area: '华东区',
                city: '江苏金宇',
                TotalScore: 87
            }
        ];
        this.page.competitionLists = [{
            CoverUrl: './assets/imgs/competition/fengmian@2x.png',
            Title: '用车分享：大宝第十次的维修保养知识',
            VideoMinute: 33,
            duration: '00:23',
            commentCount: 22,
            ReplyCount: 23
        }];



        let competitionParam = this.navParams.get('competitionParam');
        if (this.competitionParam.ServerArea && this.competitionParam.ServerProvince) {
            this.page.competitionParam = competitionParam;
            this.page.getParams = {
                TopicTagPlateId: this.page.competitionParam.cid,
                TopicId: this.page.competitionParam.cid,
                topicID: this.page.competitionParam.cid,
                PageIndex: 1,
                PageSize: 10,
                TotalCount: null,
                isLoad: false
            };
            // this.getList(null);
            this.getAPData(); // 获取 区域 / 省 数据
        } else if (!competitionParam.cid) {
            console.log('服务大赛区域或省份列表 不存在！')
        }
    }

    getAPData() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        this.homeSer.GetServiceCompetitionArea({}).subscribe(
            (res) => {
                if (res.code == 200) {
                    let Data = res.data;
                    console.log('区域/省:', Data);
                    // this.page.competitionLists = this.DataAssign(Data);
                    // this.page.getParams.isLoad = true;
                    this.getList(null);
                }
                loading.dismiss();
            }, err => {
                console.log(err)
                loading.dismiss();
            }
        )
    }

    // 阻止时间冒泡
    stop(event: Event){
        if (event) event.stopPropagation();
    }

    // 获取列表
    getList(callback) {
        let params = {
            PageIndex: 1,
            PageSize: 10
        };
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        setTimeout(() => {
            if(callback) callback();
            loading.dismiss();
        }, 500)

        this.homeSer.GetServiceRankingList(params).subscribe(
            (res) => {
                if (res.code == 200) {
                    let Data = res.data;
                    console.log(111, Data)
                    // this.page.competitionLists = this.DataAssign(Data);
                    // this.page.getParams.isLoad = true;
                }
                loading.dismiss();
            }, err => {
                console.log(err)
                loading.dismiss();
            }
        )
    }

    paramAssign() {
        // 第一次加载 或切换时候的参数处理
        this.page.getParams.Page = 1;
        this.page.getParams.PageIndex = 1;
        this.page.getParams.OrderBy = '' // LikeCount//标识最热 OrderBy这个字段传：CreateTime//表示最新
        this.page.getParams.AreaID = '' // 传入则查询地区排行和排行榜//不传则查询所有地区排行榜


        if (this.page.checkType === this.page.navliArr[0].lable) {
            // 判断是 排行榜/短视频
            this.page.getListsApi = (data) => {
                return this.homeSer.GetServiceRankingList(data)
            };
        } else if (this.page.checkType === this.page.navliArr[1].lable) {
            // 短视频排行榜
            this.page.getListsApi = (data) => {
                return this.homeSer.GetShortVideoCompitLists(data)
            };
        }
    }

    // 点击 区域按钮 或者 省份按钮
    changeBtnState(dataIndex, arrIndex) {
        this.initBtnState(dataIndex, arrIndex);
    }

    changeListsType () {
        if (this.page.arrIndex === -1) {
            this.getList(() => {
                // 获取数据后关闭侧边栏并且更改tab状态
                this.closeMenu();
                this.changeSecNav(0, 0, false);
            });
            return
        }
        if (this.page.dataIndex === 1 && this.page.arrIndex !== -1) {
            // 区域 多选还是单选
            this.closeMenu();
            this.resetSecNavState(0, 1);

        }
        if (this.page.dataIndex === 2 && this.page.arrIndex !== -1) {
            // 省 多选还是单选
            this.closeMenu();
            this.resetSecNavState(0, 2);
        }
        let sidebarData = this.page.sidebarData;
        console.log(this.page.dataIndex, this.page.arrIndex, 'sidebarData:', this.page);
        console.log(`当前${sidebarData[this.page.dataIndex].typeText}是${sidebarData[this.page.dataIndex].changeTypeArr[this.page.arrIndex].text}-id:`, sidebarData[this.page.dataIndex].changeTypeArr[this.page.arrIndex].id);
        // this.getList(() => {
        //     // 获取数据后关闭侧边栏并且更改tab状态
        //     this.closeMenu();
        //     this.changeCheckType(this.page.navliArr[this.page.dataIndex].lable);
        // });

    }

    initBtnState(dataIndex, arrIndex) {
        console.log(78, dataIndex, arrIndex)
        var sidebarData = this.page.sidebarData; // sidebarData[1].changeTypeArr
        for (var i=0; i<sidebarData.length; i++) {
            if (sidebarData[i].changeTypeArr && sidebarData[i].changeTypeArr.length > 0) {
                for (var j=0; j<sidebarData[i].changeTypeArr.length; j++) {
                    //
                    if (dataIndex === i && arrIndex === j) {
                        this.page.dataIndex = dataIndex;
                        this.page.arrIndex = arrIndex;
                        // console.log(33333, this.page)
                        sidebarData[i].changeTypeArr[j].actived = true;
                        sidebarData[i].isActivedAll = false;
                    } else {
                        sidebarData[i].changeTypeArr[j].actived = false;
                    }
                }
                // 点击不限的时候
                if (arrIndex === -1) {
                    sidebarData[i].isActivedAll = true;
                    this.page.dataIndex = dataIndex;
                    this.page.arrIndex = arrIndex;
                }
            }

        }
        this.page.sidebarData = sidebarData;
    }

    // 一级导航切换 （注：考试不会有）
    changeCheckType(checkType) {
        if (this.page.checkType === checkType) return;
        // this.page.competitionLists = [];
        this.page.checkType = checkType;

        // console.log(2333, this.page.checkType, this.page.navliArr[1].lable)
    }
    // 二级导航切换 （注：考试不会有）
    changeSecNav(typeIndex, secNavIndex, bool) {
        if (bool) return;
        console.log(233, typeIndex, secNavIndex, bool, this.page.navliArr[typeIndex].secNav[secNavIndex].navBtnEn)
        // this.getList();
        if (this.page.navliArr[typeIndex].secNav[secNavIndex].navBtnEn !== 'all') {
            this.changeBtnState(typeIndex, -1);
            this.menuCtrl.open();
        }
        else {
            this.resetSecNavState(typeIndex, secNavIndex);
        }
        this.page.nowClick = this.page.navliArr[typeIndex].secNav[secNavIndex].navBtnEn;
    }

    resetSecNavState(typeIndex, secNavIndex) {
        console.log(8889, typeIndex, secNavIndex);
        this.page.navliArr[typeIndex].secNav[0].isActived = false;
        this.page.navliArr[typeIndex].secNav[1].isActived = false;
        this.page.navliArr[typeIndex].secNav[2].isActived = false;
        this.page.navliArr[typeIndex].secNav[secNavIndex].isActived = true;
    }

    closeMenu() {
        this.menuCtrl.close();
    }

    //下拉刷新
    doRefresh(e) {
        this.closeMenu();
        // console.log('doRefresh');
        // this.page.getParams.Page = 1;
        // this.page.getParams.PageIndex = 1;
        // // this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

    // 进入视频播放页
    goVideoBox(item, index) {
        console.log(item, index)
        // if (item.MyRanking && this.page.checkType === this.page.navliArr[2].lable && this.page.navliArr[2].secNav[1].isActived === true) {
        //     this.navCtrl.push(MyShortVideoBoxPage, {ID: item.ID});
        //     return;
        // }
        // let i = this.page.competitionLists[0].MyRanking ? index - 1 : index;
        // let index1 = i + 1;
        // let num = index1 % 10;
        // num = num == 0 ? 9 : num - 1;
        // const currentPage = Math.ceil(index1 / 10);
        // if (this.page.navliArr[2].secNav[1].isActived == true) { //大赛排行榜
        //     this.navCtrl.push(CompetitionVideoPage, {
        //         Page: currentPage,
        //         TopicId: this.page.competitionParam.cid,
        //         AreaID: this.page.getParams.AreaID,
        //         index: num
        //     });
        // } else {
        //     this.navCtrl.push(VideoBoxPage, { //所有视频
        //         Page: currentPage,
        //         searchKey: "",
        //         type: this.page.getParams.OrderBy,
        //         index: num
        //     });
        // }
    }

    //加载更多
    doInfinite(e) {
        // if (this.page.competitionLists.length == this.page.getParams.TotalCount || this.page.competitionLists.length > this.page.getParams.TotalCount) {
        //     e.complete();
        //     return;
        // }
        // this.page.getParams.Page++;
        // this.page.getParams.PageIndex++;
        // this.page.getListsApi(this.page.getParams).subscribe(
        //     (res) => {
        //         let Data = res.data;
        //         this.page.competitionLists = this.page.competitionLists.concat(this.DataAssign(Data));
        //         e.complete();
        //     }
        // )
    }
}
