import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../../learning/learn.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

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

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learnSer: LearnService, private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }

    clear() {
        this.navCtrl.pop();
    }

    search() {
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
