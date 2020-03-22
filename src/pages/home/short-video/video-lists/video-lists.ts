import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {EditPage} from "../../competition/edit/edit";
import {VideoBoxPage} from "../video-box/video-box";
import {HomeService} from "../../home.service";

/**
 * Generated class for the ListsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
        PageSize: 10,
        TotalCount: null,
        isLoad: false
    };
    constructor(private homeSer: HomeService, public navCtrl: NavController, public navParams: NavParams,private loadCtrl: LoadingController) {
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
}
