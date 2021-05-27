import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, LoadingController, ActionSheetController, Platform} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {EditPage} from "../../competition/edit/edit";
import {VideoBoxPage} from "../video-box/video-box";
import {HomeService} from "../../home.service";
import {CommonService} from "../../../../core/common.service";
import {ShortVideoProvider} from "../../../../providers/short-video/short-video";
import {GlobalData} from "../../../../core/GlobleData";

declare var Wechat;

@Component({
    selector: 'page-video-lists',
    templateUrl: 'video-lists.html',
})
export class VideoListsPage {
    defaultImg = './assets/imgs/competition/fengmian@2x.png'
    videoLists = [];
    page = {
        searchKey: "",
        videoLists: [],
        Page: 1,
        TopicId: '',
        PageSize: 10,
        TotalCount: null,
        isLoad: false
    };

    type = 'ReplyTime'; //LikeCount//标识最热 OrderBy这个字段传：CreateTime//表示最新

    constructor(private homeSer: HomeService, public navCtrl: NavController,
                private loadingCtrl: LoadingController,
                private commonSer: CommonService,
                private globalData: GlobalData,
                private shortVideoPro: ShortVideoProvider,
                public navParams: NavParams, private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.homeSer.GetCompetitionID({code: 'xsds'}).subscribe(
            (res) => {
                this.page.TopicId = res.data;
                this.getList();
            }
        )
    }

    // 进入视频播放页
    goVideoBox(index) {
        let index1 = index + 1;
        const num = index1 % 10;
        const currentPage = Math.ceil(index1 / 10);
        this.navCtrl.push(VideoBoxPage, {
            Page: currentPage,
            searchKey: this.page.searchKey,
            type: this.type,
            TopicId: this.page.TopicId,
            index: num == 0 ? 9 : num - 1
        });
    }

    goToEdit() {
        this.shortVideoPro.chooseVideo((data) => {
            this.globalData.TopicType = 'xsds';
            this.navCtrl.push(EditPage, data);
        })
    }


    clearInput() {
        this.page.searchKey = ''
    }

    doSearch(event) {
        if (event && event.keyCode == 13 && this.page.searchKey) {
            this.page.Page = 1;
            this.getList();
        }
    }

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            Title: this.page.searchKey,
            Page: 1,
            PageSize: this.page.PageSize,
            "OrderBy": this.type,
            "SortDir": "desc",
            "IsAsc": true,
            "TopicId": this.page.TopicId,
            "TopicTagPlateId": this.page.TopicId,
        };
        this.homeSer.GetShortVideoLists(data).subscribe(
            (res) => {
                loading.dismiss();
                if (res.data) {
                    this.page.videoLists = res.data.Items;
                    this.page.TotalCount = res.data.TotalCount;
                    this.page.isLoad = true;
                } else {
                    this.commonSer.alert(res.message);
                }
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

    //加载更多
    doInfinite(e) {
        if (this.page.videoLists.length == this.page.TotalCount || this.page.videoLists.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.Page++;
        const data = {
            Title: this.page.searchKey,
            Page: this.page.Page,
            PageSize: this.page.PageSize,
            "OrderBy": this.type,
            "SortDir": "desc",
            "IsAsc": true,
            "TopicId": this.page.TopicId,
            "TopicTagPlateId": this.page.TopicId,
        };
        this.homeSer.GetShortVideoLists(data).subscribe(
            (res) => {
                let videoLists = res.data.Items
                this.page.videoLists = this.page.videoLists.concat(videoLists);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //点赞 1 or 取消点赞 2
    handleLike(item, option, e) {
        e.stopPropagation();
        const data = {
            "SVID": item.ID,
            "IsADD": option
        };
        this.homeSer.shortVideoLike(data).subscribe(
            (res) => {
                if (res.data) {
                    this.getVideoDetail(item);
                } else {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //获取视频详情
    getVideoDetail(item) {
        const data = {
            SVID: item.ID
        };
        this.homeSer.GetShortVideoDetail(data).subscribe(
            (res) => {
                item.LikeCount = res.data.LikeCount;
                item.IsLike = res.data.IsLike;
                item.ReplyCount = res.data.ReplyCount;
            }
        )
    }

    // 微信分享
    wxShare(data) {
        let thumb = data.CoverUrl;
        Wechat.share({
            message: {
                title: data.Title, // 标题
                description: "", // 简介
                thumb: thumb, //动态图片
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                // media: "YOUR_MEDIA_OBJECT_HERE",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: `http://a1.hellowbs.com/openApp.html?scheme_url=shortVideo&Id=${data.ID}`
                }
            },
            scene: Wechat.Scene.SESSION
        }, () => {
            // alert("Success");
        }, (reason) => {
            // alert("Failed: " + reason);
        });
    }


    getDuration(ev, item) {
        let value = Math.ceil(ev.target.duration);
        let minute = <any>Math.floor(value / 60);
        let second = <any>(value % 60);
        minute = minute > 9 ? minute : '0' + minute;
        second = second > 9 ? second : '0' + second;
        item.duration = minute + ':' + second
    }
}
