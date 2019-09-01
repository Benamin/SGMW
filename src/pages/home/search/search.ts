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
        page: '1',
        pageSize: "2000"
    };
    show;

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
        if (event && event.keyCode == 13) {
            const data = {
                title: this.page.title,
                page: this.page.page,
                pageSize: this.page.pageSize
            }
            this.learnSer.GetProductList(data).subscribe(
                (res) => {
                    this.productList = res.data.ProductList;
                }
            )
            this.keyboard.hide();
        }
    }

    showKey() {
        this.keyboard.show();
    }

    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    doInfinite(e) {
        e.complete();
    }

    doRefresh(e) {
        e.complete();
    }

}
