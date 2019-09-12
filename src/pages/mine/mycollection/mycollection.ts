import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-mycollection',
    templateUrl: 'mycollection.html',
})
export class MycollectionPage {

    collectionList = [];
    page = {
        page: 1,
        pageSize: 10,
        TotalCount: null
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private loadCtrl:LoadingController) {
    }

    ionViewDidLoad() {
        this.getList();
    }

    getList() {
        let loading = this.loadCtrl.create({
            content:''
        });
        loading.present();
        const data = {
            page:this.page.page,
            pageSize:this.page.pageSize
        };
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                this.collectionList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                loading.dismiss();
            }
        )
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    //加载更多
    doInfinite(e) {
        if (this.collectionList.length == this.page.TotalCount || this.collectionList.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.page++;
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                this.collectionList = this.collectionList.concat(res.data.ProductList);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.page = 1;
        this.getList();
        timer(1000).subscribe(() => {e.complete();});
    }

}
