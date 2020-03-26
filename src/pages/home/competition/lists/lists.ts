import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, LoadingController, ActionSheetController, Platform} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {timer} from "rxjs/observable/timer";
import {ListsRankingPage} from "../lists-ranking/lists-ranking";
import {LookTestPage} from "../../test/look-test/look-test";
// import {TotalRankingPage} from "../total-ranking/total-ranking";
import {EditPage} from "../edit/edit";
import {VideoBoxPage} from "../../short-video/video-box/video-box";
import {DoTestPage} from "../../test/do-test/do-test";
import {CommonService} from "../../../../core/common.service";
import {PostAddComponent} from '../../../forum/post-add/post-add.component';
import {PostsContentComponent} from '../../../forum/posts-content/posts-content.component';
import {HomeService} from "../../home.service";
import {CaptureVideoOptions, MediaCapture, MediaFileData} from "@ionic-native/media-capture";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {AppService} from "../../../../app/app.service";


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
    defaultImg = './assets/imgs/competition/fengmian@2x.png';
    page = {
        myInfo: null,
        checkType: 'exam',
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
                    navBtnText: '大赛排行榜',
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
                    navBtnText: '所有视频',
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
        getParams: null,
        hasArea: false
    }

    constructor(private commonSer: CommonService, public navCtrl: NavController, public navParams: NavParams,
                private actionSheetCtrl: ActionSheetController,
                private platform: Platform,
                private appSer: AppService,
                private transfer: FileTransfer,
                private zone: NgZone,
                private loadingCtrl: LoadingController,
                private mediaCapture: MediaCapture,
                private loadCtrl: LoadingController, private homeSer: HomeService, private sanitizer: DomSanitizer) {
    }

    ionViewDidEnter() {
        this.GetSelfExamDetail();
        let competitionParam = this.navParams.get('competitionParam');
        if (competitionParam.userArea && competitionParam.userArea != 'null') {
            this.page.hasArea = true;
            // 帖子区域
            this.page.navliArr[1].secNav[1].thrNav = [
                {
                    navBtnText: '所有',
                    navBtnEn: 'all',
                    isActived: true
                },
                {
                    navBtnText: competitionParam.userArea.AreaName,
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
                    navBtnText: competitionParam.userArea.AreaName,
                    navBtnEn: 'area',
                    isActived: false
                }
            ];
        }
        if (competitionParam.cid) {
            this.page.competitionParam = competitionParam;
            this.page.getParams = {
                TopicTagPlateId: this.page.competitionParam.cid,
                TopicId: this.page.competitionParam.cid,
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

    // 获取自己的考试排名
    GetSelfExamDetail() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.homeSer.GetSelfExamDetail({}).subscribe(
            (res) => {
                this.page.myInfo = res.data;
                loading.dismiss();
            }, err => {
                console.log(err)
                loading.dismiss();
            }
        )
    }


    // 一级导航切换 （注：考试不会有）
    changeCheckType(checkType) {
        if (this.page.checkType === checkType) return;
        this.page.competitionLists = [];
        this.page.checkType = checkType;
        // if (checkType === 'recommend') this.page.Type = 1;
        // if (checkType === 'all') this.page.Type = 2;
        // if (checkType === 'mine') this.page.Type = 3;
        this.page.getParams.Page = 1;
        this.getList();
    }

    // 二级导航切换 （注：考试不会有）
    changeSecNav(typeIndex, secNavIndex, bool) {
        if (bool) return;
        var otherIndex = 1
        if (secNavIndex === 1) otherIndex = 0;
        this.page.competitionLists = [];
        this.page.navliArr[typeIndex].secNav[otherIndex].isActived = false;
        this.page.navliArr[typeIndex].secNav[secNavIndex].isActived = true;
        this.getList();
    }

    // 三级导航切换
    changeThrNav(typeIndex, secNavIndex, thrNavIndex, bool) {
        if (bool === true) return;
        var otherIndex = 1
        if (thrNavIndex === 1) otherIndex = 0;
        this.page.competitionLists = [];
        this.page.navliArr[typeIndex].secNav[secNavIndex].thrNav[otherIndex].isActived = false;
        this.page.navliArr[typeIndex].secNav[secNavIndex].thrNav[thrNavIndex].isActived = true;
        this.getList();
    }

    // 点击更多进入总排名列表 本期不加
    goTotalRanking() {
        let userArea = null
        let competitionParam = this.navParams.get('competitionParam');
        if (competitionParam.userArea && competitionParam.userArea != 'null') userArea = competitionParam.userArea;
        this.navCtrl.push(ListsRankingPage, {userArea: userArea});
    }

    // 进入考试排名列表
    // goListsRanking(tid) {
    //     this.navCtrl.push(ListsRankingPage, {tid: tid});
    // }

    // 进入图片/视频 编辑页面
    goToEdit() {
        if (this.page.checkType === this.page.navliArr[1].lable) {
            this.navCtrl.push(PostAddComponent, {data: {}});
        } else if (this.page.checkType === this.page.navliArr[2].lable) {
            this.takePhoto();
        }
    }

    // 进入视频播放页
    goVideoBox(vid) {
        this.navCtrl.push(VideoBoxPage, {ID: vid});
    }

    // 前往帖子详情
    goPostsContent(Id) {
        let data = {Id: Id}
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    // 点击考试列表
    goExam(item) {
        if (item.StudyState == 3) {
            this.navCtrl.push(LookTestPage, {item: item});
        } else {
            this.checkTesttime(item);
        }
    }

    //考试有效期校验
    checkTesttime(item) {
        const loading = this.loadCtrl.create({
            content: ''
        });
        console.log(item);
        loading.present();
        const ExamBegin = this.commonSer.transFormTime(item.ExamBegin);
        const ExamEnd = this.commonSer.transFormTime(item.ExamEnd);
        this.homeSer.getSysDateTime().subscribe(
            (res) => {
                loading.dismiss();
                const sysDate = this.commonSer.transFormTime(res.data);
                if (sysDate < ExamBegin) {
                    this.commonSer.toast('考试未开始');
                } else if (sysDate > ExamEnd && item.StudyState == 1) {
                    this.commonSer.toast('当前时间不可考试');
                } else if (ExamBegin < sysDate && sysDate < ExamEnd) {
                    this.navCtrl.push(DoTestPage, {item: item});  //未开始
                } else if (item.StudyState == 2) { // 未完成
                    this.navCtrl.push(DoTestPage, {item: item});
                }
            }
        )
    }

    // 获取列表
    getList() {
        this.page.getParams.OrderByDirection = '';
        this.page.getParams.Page = 1;
        this.page.getParams.OrderBy = '' // LikeCount//标识最热 OrderBy这个字段传：CreateTime//表示最新
        this.page.getParams.AreaID = '' // 传入则查询地区排行和排行榜//不传则查询所有地区排行榜
        let params = this.page.getParams;
        // 判断是考试/帖子/短视频
        if (this.page.checkType === this.page.navliArr[0].lable) {
            this.page.getListsApi = (data) => {
                return this.homeSer.GetExamProList(data)
            };
        } else if (this.page.checkType === this.page.navliArr[1].lable) {
            // 帖子
            if (this.page.navliArr[1].secNav[0].isActived === true) {
                this.page.getParams.OrderByDirection = 'DESC';
                // 帖子最新/最热
                this.page.getListsApi = (data) => {
                    return this.homeSer.GetAllTopicLists(data)
                };
                ;
                if (this.page.navliArr[1].secNav[0].thrNav[0].isActived === true) {
                    console.log('最新')
                    this.page.getParams.OrderBy = 'CreateTime';
                } else if (this.page.navliArr[1].secNav[0].thrNav[1].isActived === true) {
                    console.log('最热')
                    this.page.getParams.OrderBy = 'LikeCount';
                }
            } else if (this.page.navliArr[1].secNav && this.page.navliArr[1].secNav[1] && this.page.navliArr[1].secNav[1].isActived === true) {
                // 帖子排行榜
                this.page.getListsApi = (data) => {
                    return this.homeSer.GetTopicCompetitionLists(data)
                };
                if (!this.page.navliArr[1].secNav[1] || (this.page.navliArr[1].secNav[1] && this.page.navliArr[1].secNav[1].thrNav && this.page.navliArr[1].secNav[1].thrNav[0] && this.page.navliArr[1].secNav[1].thrNav[0].isActived === true)) {
                    console.log('所有排行')
                } else if (this.page.navliArr[1].secNav[1] && this.page.navliArr[1].secNav[1].thrNav && this.page.navliArr[1].secNav[1].thrNav[1] && this.page.navliArr[1].secNav[1].thrNav[1].isActived === true) {
                    console.log('区域排行')
                    this.page.getParams.AreaID = this.navParams.get('competitionParam').userArea.ID;
                }
            }
        } else if (this.page.checkType === this.page.navliArr[2].lable) {
            // 短视频
            if (this.page.navliArr[2].secNav[0].isActived === true) {
                // 短视频最新/最热
                this.page.getListsApi = (data) => {
                    return this.homeSer.GetShortVideoLists(data)
                };
                if (this.page.navliArr[2].secNav[0].thrNav[0].isActived === true) {
                    console.log('视频最新')
                    this.page.getParams.OrderBy = 'LikeCount';
                } else if (this.page.navliArr[2].secNav[0].thrNav[1].isActived === true) {
                    console.log('视频最热')
                    this.page.getParams.OrderBy = 'ReplyTime';
                }
            } else if (this.page.navliArr[2].secNav && this.page.navliArr[2].secNav[1] && this.page.navliArr[2].secNav[1].isActived === true) {
                // 短视频排行榜
                this.page.getListsApi = (data) => {
                    return this.homeSer.GetShortVideoCompitLists(data)
                };
                if (!this.page.navliArr[2].secNav[1] || (this.page.navliArr[2].secNav[1] && this.page.navliArr[2].secNav[1].thrNav && this.page.navliArr[2].secNav[1].thrNav[0] && this.page.navliArr[2].secNav[1].thrNav[0].isActived === true)) {
                    console.log('视频所有排行')
                } else if (this.page.navliArr[2].secNav[1] && this.page.navliArr[2].secNav[1].thrNav && this.page.navliArr[2].secNav[1].thrNav[1] && this.page.navliArr[2].secNav[1].thrNav[1].isActived === true) {
                    console.log('视频区域排行')
                    this.page.getParams.AreaID = this.navParams.get('competitionParam').userArea.ID;
                }
            }
        }

        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.page.getListsApi(params).subscribe(
            (res) => {
                let Data = res.data;
                let Lists = []
                if (Data.MyItems && Data.MyItems.ID) {
                    Lists = res.data.LeaderboardItems.Items;
                    this.page.getParams.TotalCount = res.data.LeaderboardItems.TotalCount;
                    Lists.unshift(Data.MyItems);
                } else {
                    this.page.getParams.TotalCount = res.data.TotalCount;
                    Lists = res.data.Items;
                }
                console.log(888, Lists)

                if (this.page.checkType === this.page.navliArr[2].lable) { // 判断是短视频就处理 返回的时间
                    for (var i = 0; i < Lists.length; i++) {
                        Lists[i].VideoMinute = this.formatSeconds(Lists[i].VideoMinute);
                    }
                }
                this.page.competitionLists = Lists;
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
        this.page.getListsApi(this.page.getParams).subscribe(
            (res) => {
                let Data = res.data;
                let Lists = []
                if (Data.MyItems && Data.MyItems.ID) {
                    Lists = res.data.SVTopicIDList;
                    Lists.unshift(Data.MyItems);
                } else {
                    Lists = res.data.Items;
                }
                console.log(888, Lists)

                if (this.page.checkType === this.page.navliArr[2].lable) { // 判断是短视频就处理 返回的时间
                    for (var i = 0; i < Lists.length; i++) {
                        Lists[i].VideoMinute = this.formatSeconds(Lists[i].VideoMinute);
                    }
                }
                this.page.competitionLists = this.page.competitionLists.concat(Lists);
                this.page.getParams.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    formatSeconds($times) {
        let $result = '00:00';
        if ($times > 0) {
            let $hour = Math.floor($times / 3600);
            let $minute = Math.floor(Math.floor($times % 3600) / 60);
            let $second = Math.floor(($times - 60 * $minute) % 60);
            let $hourStr = '' + $hour
            let $minuteStr = '' + $minute
            let $secondStr = '' + $second
            if ($hour < 10) {
                $hour == 0 ? $hourStr = '' : $hourStr = '0' + $hour + ':';
            }
            if ($minute < 10) {
                $minuteStr = "0" + $minute;
            }
            if ($second < 10) {
                $secondStr = "0" + $second;
            }
            $result = $hourStr + $minuteStr + ':' + $secondStr;
        }
        return $result
    }

    assembleHTML(strHTML: any) {
        return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    }

    takePhoto() {
        let modal = this.actionSheetCtrl.create(
            {
                buttons: [
                    {
                        text: '录制短视频',
                        role: '',
                        handler: () => {
                            this.captureVideo();
                        }
                    },
                    // {
                    //     text: '上传短视频',
                    //     role: '',
                    //     handler: () => {
                    //         this.selectVide();
                    //     }
                    // },
                    {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            return
                        }
                    },
                ]
            }
        )
        modal.present();
    }

// {
//     end:0,
//     fullPath:"file:///storage/emulated/0/DCIM/Camera/VID_20200323_103712.mp4",
//     lastModified:null,
//     lastModifiedDate:1584931048000,
//     localURL:"cdvfile://localhost/sdcard/DCIM/Camera/VID_20200323_103712.mp4",
//     name:"VID_20200323_103712.mp4",
//     size:21748732,
//     start:0,
//     type:"video/mp4",
//     "width":0,"duration":0,"bitrate":0,"codecs":null,"height":0
// }
    captureVideo() {
        let option: CaptureVideoOptions = {
            limit: 1,
            duration: 15,
            quality: 50
        };
        if (this.platform.is('ios')) {
            this.appSer.setIOS('platformIOS');
            // @ts-ignore
            setTimeout(() => {
                this.appSer.setIOS('innerCourse');
            }, 1500)
        }
        this.mediaCapture.captureVideo(option).then((mediaFiles: any) => {
            const mediaFile = mediaFiles[0];
            mediaFile.getFormatData((data: MediaFileData) => {
                Object.assign(mediaFile, data);
                console.log("mediaFile");
                console.log(mediaFile);
                this.uploadVideo(mediaFile)
            }, error => {
                console.log(error);
            })
        })
    }


    // AssetId:"nb:cid:UUID:c7a84183-07bc-4f34-b607-912b29cc09fa"
    // DownloadUrl:"https://devstorgec.blob.core.chinacloudapi.cn/asset-c7a84183-07bc-4f34-b607-912b29cc09fa/VID_20200323_111446.mp4?sv=2018-03-28&sr=b&sig=ds86zkaBbVXIDDx5KzPMLNX6xxb1GrQ8o2slCHZG5PM%3D&se=2030-03-23T03%3A15%3A40Z&sp=rcw"
    // Imgurl:"https://devstorgec.blob.core.chinacloudapi.cn/asset-f15e6c34-b6b1-4717-8ac0-4dfad2d43b5a/VID_20200323_111446_000001.jpg?sv=2017-04-17&sr=c&si=6bed0a50-3f07-42ec-acc5-bb4e0376f44c&sig=doTiLv1%2BL3KmqLcD8iU2QK7S8cGBb%2B6Zjm2K6HVma68%3D&se=2020-04-02T03%3A16%3A37Z"
    // JobId:"nb:jid:UUID:0ad700ff-0300-aa76-5699-f1ea6cb49287"
    // Type:0
    // Url:"转码中"
    uploadVideo(mediaFile) {
        const option: FileUploadOptions = {
            httpMethod: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            fileName: mediaFile.name
        };
        const uploadLoading = this.loadingCtrl.create({
            content: '上传中...',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        uploadLoading.present();
        const SERVER_URL = 'http://devapi1.chinacloudsites.cn/api'; //开发环境
        // const SERVER_URL = 'http://sitapi1.chinacloudsites.cn/api'; //sit环境
        // const SERVER_URL = 'https://elearningapi.sgmw.com.cn/api';  //生产环境
        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.upload(mediaFile.fullPath, SERVER_URL + '/AppShortVideo/UploadMainFile', option).then(
            (res) => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传成功');
                const data = JSON.parse(res.response);
                console.log("response data");
                console.log(data);
                this.navCtrl.push(EditPage, {mediaFile: mediaFile, resp: data.data});
            }, err => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传错误');
            });
        fileTransfer.onProgress((listener) => {
            let per = <any>(listener.loaded / listener.total) * 100;
            per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2);
            this.zone.run(() => {
                uploadLoading.setContent(`上传中...${per}%`);
            });
        })
    }
}
