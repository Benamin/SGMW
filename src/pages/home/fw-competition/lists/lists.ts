import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, MenuController} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home.service";
import {ShortVideoProvider} from "../../../../providers/short-video/short-video";
import {EditPage} from "../../competition/edit/edit";
import {GlobalData} from "../../../../core/GlobleData";

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
            },],

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
                }]
            }
        ],
        nowClick: 'all',
        dataIndex: null,
        arrIndex: null,
        isSearch: false
    }

    constructor(
        private shortVideoPro: ShortVideoProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public globalData: GlobalData,
        private loadCtrl: LoadingController,
        private homeSer: HomeService,
        public menuCtrl: MenuController
    ) {
    }

    ionViewDidEnter() {
        let competitionParam = this.navParams.get('competitionParam');
        console.log('competitionParam', competitionParam);
        if (competitionParam.ServerAreaArr && competitionParam.ServerProvinceArr) {
            this.page.competitionParam = competitionParam;
            this.page.getParams = {
                TopicTagPlateId: competitionParam.cid,
                TopicId: competitionParam.cid,
                topicID: competitionParam.cid,
                Agent: '', // 区域 string
                Province: '', // 省份 string
                CXType: '', // 查询类型：1：区域，2：省份，3：姓名或服务商或单位简称  int
                SearchCriteria: '', // 姓名或服务商或单位简称 string
                PageIndex: 1,
                PageSize: 10,
                TotalCount: null,
                isLoad: false
            };
            let ServerAreaArr = competitionParam.ServerAreaArr;
            let ServerProvinceArr = competitionParam.ServerProvinceArr;

            let areaChangeTypeArr = [];
            for (var i = 0; i < ServerAreaArr.length; i++) {
                let arritem = {
                    id: ServerAreaArr[i].AreaCode,
                    text: ServerAreaArr[i].AreaName,
                    actived: false
                }
                areaChangeTypeArr.push(arritem)
            }
            let provinceChangeTypeArr = [];
            for (var j = 0; j < ServerProvinceArr.length; j++) {
                let arritem = {
                    id: ServerProvinceArr[j].ProvinceCode,
                    text: ServerProvinceArr[j].ProvinceName,
                    actived: false
                }
                provinceChangeTypeArr.push(arritem)
            }
            this.page.sidebarData = [
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
                    changeTypeArr: areaChangeTypeArr
                },
                {
                    type: 'province',
                    typeText: '省份',
                    isActivedAll: true,
                    changeTypeArr: provinceChangeTypeArr
                }
            ];
            console.log('侧边栏数据', this.page.sidebarData);

            this.page.getListsApi = (data) => {
                return this.homeSer.GetServiceRankingList(data)
            };
            this.getList(null);
            // this.getAPData(); // 获取 区域 / 省 数据
        } else if (!competitionParam.cid) {
            console.log('服务大赛区域或省份列表 不存在！')
        }
    }

    doSearch(event) {
        this.page.nowClick = this.page.navliArr[0].secNav[0].navBtnEn;
        this.page.getParams.Agent = ''; // 区域 string
        this.page.getParams.Province = '';  // 省份 string
        // 所有省份 / 所有区域
        if (event && event.keyCode == 13) {
            this.search(3);
        }
    }

    search(CXType) {
        this.page.competitionLists = [];
        if (CXType != '') {
            this.page.getListsApi = (data) => {
                return this.homeSer.GetServiceRankingTJList(data)
            }
            this.page.isSearch = true;
        } else {
            this.page.getListsApi = (data) => {
                return this.homeSer.GetServiceRankingList(data)
            };
            this.page.isSearch = false;
        }
        this.page.getParams.CXType = CXType; // CXType -- 查询类型：1：区域，2：省份，3：姓名或服务商或单位简称  int
        this.page.getParams.PageIndex = 1;

        this.getList(() => {
            // 获取数据后关闭侧边栏并且更改tab状态
            this.closeMenu();
            if (this.page.nowClick !== 'all') {
                console.log('this.page.nowClick', this.page.nowClick)
                this.resetSecNavState(0, CXType);
            }
        });
    }

    // 阻止时间冒泡
    stop(event: Event) {
        if (event) event.stopPropagation();
    }

    // 获取列表
    getList(callback) {
        let params = this.page.getParams;
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();

        if (this.page.checkType === this.page.navliArr[1].lable) {
            this.page.getParams.Page = 1;
            this.page.getParams.PageIndex = 1;
            // 大赛 视频列表
            this.page.getListsApi = (data) => {
                return this.homeSer.GetShortVideoCompitLists(data)
            };
        }

        this.page.getListsApi(params).subscribe(
            (res) => {
                if (res.code == 200) {
                    let Data = res.data;

                    console.log(111, Data)
                    this.page.competitionLists = this.DataAssign(Data);
                    this.page.getParams.isLoad = true;
                    this.page.getParams.SearchCriteria = '';

                    if (callback) callback();
                }
                loading.dismiss();
            }, err => {
                console.log(err)
                loading.dismiss();
            }
        )
    }

    DataAssign(Data) {
        // 处理返回的 数据
        let Lists = []
        // 判断是否短视频
        if (this.page.checkType === this.page.navliArr[1].lable) {
            if (Data && Data.LeaderboardItems && Data.LeaderboardItems.Items && Data.LeaderboardItems.Items.length > 0) {
                Lists = Data.LeaderboardItems.Items
                this.page.getParams.TotalCount = Data.LeaderboardItems.TotalCount;
            }
        } else {
            if (Data.Items && Data.Items.length > 0) {
                this.page.getParams.TotalCount = Data.TotalCount;
                Lists = Data.Items;
            }
        }

        return Lists;
    }

    paramAssign() {
        // 第一次加载 或切换时候的参数处理
        this.page.getParams.Page = 1;
        this.page.getParams.PageIndex = 1;
        this.page.getParams.OrderBy = '' // LikeCount//标识最热 OrderBy这个字段传：CreateTime//表示最新
        // this.page.getParams.AreaID = '' // 传入则查询地区排行和排行榜//不传则查询所有地区排行榜

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

    changeListsType() {
        this.page.getParams.Agent = ''; // 区域 string
        this.page.getParams.Province = '';  // 省份 string

        // 所有省份 / 所有区域
        if (this.page.arrIndex === -1) {
            this.page.nowClick = this.page.navliArr[0].secNav[0].navBtnEn;
            this.search('');
            return
        }

        let sidebarData = this.page.sidebarData;
        console.log(this.page.dataIndex, this.page.arrIndex, 'sidebarData:', this.page);
        console.log(`当前${sidebarData[this.page.dataIndex].typeText}是${sidebarData[this.page.dataIndex].changeTypeArr[this.page.arrIndex].text}-id:`, sidebarData[this.page.dataIndex].changeTypeArr[this.page.arrIndex].id);

        if (this.page.dataIndex === 1 && this.page.arrIndex !== -1) {
            // 区域 多选还是单选
            this.page.getParams.Agent = sidebarData[this.page.dataIndex].changeTypeArr[this.page.arrIndex].text; // 区域 string
            this.search(1);
        }
        if (this.page.dataIndex === 2 && this.page.arrIndex !== -1) {
            // 省 多选还是单选
            this.page.getParams.Province = sidebarData[this.page.dataIndex].changeTypeArr[this.page.arrIndex].text; //  省份 string
            this.search(2);
        }
    }

    initBtnState(dataIndex, arrIndex) {
        console.log(78, dataIndex, arrIndex)
        var sidebarData = this.page.sidebarData; // sidebarData[1].changeTypeArr
        for (var i = 0; i < sidebarData.length; i++) {
            if (sidebarData[i].changeTypeArr && sidebarData[i].changeTypeArr.length > 0) {
                for (var j = 0; j < sidebarData[i].changeTypeArr.length; j++) {
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
        this.page.competitionLists = [];
        this.page.checkType = checkType;

        this.page.getParams.Page = 1;
        this.page.getParams.PageIndex = 1;
        this.getList(null);
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
        } else {
            this.resetSecNavState(typeIndex, secNavIndex);
        }
        this.page.nowClick = this.page.navliArr[typeIndex].secNav[secNavIndex].navBtnEn;

        console.log('this.page.nowClick', this.page.nowClick)
        if (this.page.nowClick === 'all') {
            this.page.getParams.Agent = ''; // 区域 string
            this.page.getParams.Province = '';  // 省份 string
            // 所有省份 / 所有区域
            this.search('');
        }
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
        console.log('doRefresh');
        this.page.getParams.Page = 1;
        this.page.getParams.PageIndex = 1;
        this.getList(null);
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

    // 进入视频播放页
    goVideoBox(item, index) {
        console.log(item, index)
        // if (item.MyRanking && this.page.checkType === this.page.navliArr[1].lable && this.page.navliArr[1].secNav[1].isActived === true) {
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
        if (this.page.competitionLists.length == this.page.getParams.TotalCount || this.page.competitionLists.length > this.page.getParams.TotalCount) {
            e.complete();
            return;
        }
        this.page.getParams.PageIndex++;
        this.page.getListsApi(this.page.getParams).subscribe(
            (res) => {
                let Data = res.data;
                this.page.competitionLists = this.page.competitionLists.concat(this.DataAssign(Data));
                e.complete();
            }
        )
    }

    takePhoto() {
        this.shortVideoPro.chooseVideo((data) => {
            this.globalData.TopicType = 'fwds';
            this.navCtrl.push(EditPage, data);
        })
    }

    //获取视频时长
    getDuration(ev, item) {
        let value = Math.ceil(ev.target.duration);
        let minute = <any>Math.floor(value / 60);
        let second = <any>(value % 60);
        minute = minute > 9 ? minute : '0' + minute;
        second = second > 9 ? second : '0' + second;
        item.duration = minute + ':' + second
    }
}
