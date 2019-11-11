import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {MineService} from "../../mine/mine.service";
import {defaultImg} from "../../../app/app.constants";

@Component({
    selector: 'page-inner-train',
    templateUrl: 'inner-train.html',
})
export class InnerTrainPage {

    defaultImg = defaultImg;
    page = {
        list: [],
        page: 1,
        pageSize: 10,
        TotalItems: null,
        isLoad: false
    }

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private loadCtrl: LoadingController, private mineSer: MineService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InnerTrainPage');
    }

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                this.page.list = res.data.ProductList;
                this.page.TotalItems = res.data.TotalCount;
                this.page.isLoad = true;
                loading.dismiss();
            }
        )
    }

    //加载更多
    doInfinite(e) {
        if (this.page.list.length == this.page.TotalItems || this.page.list.length > this.page.TotalItems) {
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
                this.page.list = this.page.list.concat(res.data.ProductList);
                this.page.TotalItems = res.data.TotalCount;
                e.complete();
            }
        )
    }

    //下拉刷新
    doRefresh(e) {
        this.page.page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

    //前往详情
    getItem(item){

    }

}
