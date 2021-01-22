import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {IntegralService} from "../integral.service";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-integral-list',
    templateUrl: 'integral-list.html',
})
export class IntegralListPage {

    page = {
        PageIndex: 1,
        PageSize: 10,
        TotalCount: 0,
        isLoading: false
    }
    list = [];  //积分列表
    loading;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private inteSer: IntegralService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.getList();
    }

    getList() {
        this.loading = this.loadCtrl.create();
        this.loading.present();
        const data = {
            "PageIndex": this.page.PageIndex,
            "PageSize": this.page.PageSize
        };
        this.inteSer.GetIntegralDetail(data).subscribe(res => {
            if (res.data) {
                this.list = res.data.Items;
                this.page.TotalCount = res.data.TotalCount
                this.loading.dismissAll();
            }
        })
    }

    doRefresh(e) {
        this.page.PageIndex = 1;
        this.getList();
        timer(1000).subscribe((res) => {
            e.complete();
        });
    }

    //上拉加载
    doInfinite(e) {
        if (this.list.length == this.page.TotalCount || this.list.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.PageIndex++;
        const data = {
            "PageIndex": this.page.PageIndex,
            "PageSize": this.page.PageSize
        };
        this.inteSer.GetIntegralDetail(data).subscribe(
            (res) => {
                this.list = this.list.concat(res.data.Items);
                this.page.TotalCount = res.data.TotalCount;
                this.page.isLoading = true;
                e.complete();
            }
        )
    }

}
