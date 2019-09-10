import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../../learning/learn.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {Keyboard} from "@ionic-native/keyboard";

@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {

    productList = [];
    page = {
        title: '',
        page: 1,
        pageSize: 10,
        TotalCount: null,
    };
    show;
    showTips = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, private keyboard: Keyboard,
                private learnSer: LearnService, private loadCtrl: LoadingController) {
        this.show = true;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }

    ionViewDidLeave() {
    }

    clear() {
        this.show = false;
        this.navCtrl.pop();
    }

    search(event) {
        this.showTips = false;
        if (event && event.keyCode == 13) {
            const data = {
                title: this.page.title,
                page: this.page.page,
                pageSize: this.page.pageSize
            }
            this.learnSer.GetProductList(data).subscribe(
                (res) => {
                    this.productList = res.data.ProductList;
                    this.page.TotalCount = res.data.TotalCount
                }
            );
        }
        this.keyboard.hide();
    }

    showKey() {
        this.keyboard.show();
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    doInfinite(e) {
        if (this.page.TotalCount == this.productList.length || this.productList.length > this.page.TotalCount) {
            e.complete();
            return
        }
        this.page.page++;
        const data = {
            title: this.page.title,
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = this.productList.concat(res.data.ProductList);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        );
    }

    doRefresh(e) {
        const data = {
            title: this.page.title,
            page: 1,
            pageSize: this.page.pageSize
        };
        this.learnSer.GetProductList(data).subscribe(
            (res) => {
                this.productList = res.data.ProductList;
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        );
    }

}
