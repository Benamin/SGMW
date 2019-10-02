import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../../learning/learn.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

@Component({
    selector: 'page-live',
    templateUrl: 'live.html',
})
export class LivePage {

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learnSer: LearnService) {
    }

    navbarList = [
        {type: "0", name: "全部"},
        {type: "1", name: "今天"},
    ];

    page = {
        page: 1,
        pageSize: 10,
        total: 0,
        OrderBy: "CreateTime",
        Category: 'zb'
    };

    list = [];

    ionViewDidLoad() {
        this.getList();
    }

    changeType(e) {

    }

    getList() {
        this.learnSer.GetProductList(this.page).subscribe(
            (res) => {
                if(res.data){
                    this.list = res.data.ProductList;
                    this.page.total = res.data.TotalCount;
                }
            }
        )
    }

    goDetail(item){
        this.navCtrl.push(CourseDetailPage, {id: item.Id});
    }
}
