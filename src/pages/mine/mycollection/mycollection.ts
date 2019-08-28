import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

@Component({
    selector: 'page-mycollection',
    templateUrl: 'mycollection.html',
})
export class MycollectionPage {

    collectionList = [];
    page = {
        page: 1,
        pageSize: 100,
        total: null
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService) {
    }

    ionViewDidLoad() {
        this.getList();
    }

    getList() {
        const data = {};
        this.mineSer.GetMyCollectionProductList(data).subscribe(
            (res) => {
                this.collectionList = res.data;
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
