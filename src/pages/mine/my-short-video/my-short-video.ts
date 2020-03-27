import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {EditPage} from "../../home/competition/edit/edit";
import {VideoBoxPage} from "../../home/short-video/video-box/video-box";
import {HomeService} from "../../home/home.service";
import {Storage} from "@ionic/storage";
import {CommonService} from "../../../core/common.service";
import {MineService} from "../mine.service";

declare let Wechat;

@Component({
    selector: 'page-my-short-video',
    templateUrl: 'my-short-video.html',
})

export class MyShortVideoPage {

    defaultImg = './assets/imgs/competition/fengmian@2x.png';
    videoLists = [];
    page = {
        searchKey: "",
        videoLists: [],
        Page: 1,
        PageSize: 10,
        TotalCount: null,
        isLoad: false
    };

    constructor(private homeSer: HomeService, public navCtrl: NavController,
                private commonSer: CommonService,
                private mineSer: MineService,
                public navParams: NavParams, private loadCtrl: LoadingController, private storage: Storage) {
    }

    ionViewDidLoad() {
        this.getList();
    }

    // 进入视频播放页
    goVideoBox(vid) {
        this.navCtrl.push(VideoBoxPage, {vid: vid});
    }

    goToEdit() {
        this.navCtrl.push(EditPage, {editType: 'video'});
    }

    clearInput() {
        this.page.searchKey = ''
    }

    doSearch(event) {
        if (event && event.keyCode == 13 && this.page.searchKey && this.page.searchKey !== '') {
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
            GetMyList: 1,
            Title: this.page.searchKey,
            Page: 1,
            PageSize: this.page.PageSize
        };
        this.homeSer.GetVideoLists(data).subscribe(
            (res) => {
                this.page.videoLists = res.data.Items;
                this.page.TotalCount = res.data.TotalCount;

                this.page.isLoad = true;
                loading.dismiss();
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
            GetMyList: 1,
            Title: this.page.searchKey,
            Page: this.page.Page,
            PageSize: this.page.PageSize
        };
        this.homeSer.GetVideoLists(data).subscribe(
            (res) => {
                this.page.videoLists = this.page.videoLists.concat(res.data.Items);
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
        console.log('分享内容', data)
        let thumb = data.CoverUrl;
        Wechat.share({
            message: {
                title: data.Title, // 标题
                description: "", // 简介
                thumb: thumb, //帖子图片
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
        }, function () {
            // alert("Success");
        }, function (reason) {
            // alert("Failed: " + reason);
        });
    }

    //删除短视频
    deleteShortVideo(item) {
        this.commonSer.alert('确认删除该短视频', () => {
            const data = {
                SVID: item.ID,
            };
            this.mineSer.DelShortVideo(data).subscribe(
                (res) => {
                    if (res.data) {
                        this.getList();
                        this.commonSer.toast('删除成功');
                    }
                }
            )
        })
    }
}

