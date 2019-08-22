import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-course',
    templateUrl: 'course.html',
})
export class CoursePage {
    slide = [1,2,3]
    list = [];

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.getList()
    }

    getList(){
        for (let i = 0;i < 10;i++){
            this.list.push(i)
        }
    }

    slideChanged(){

    }

    doRefresh(e){
        e.complete();
    }

    doInfinite(e){
        const len = this.list.length;
        for (let i = len;i < len +10;i++){
            this.list.push(i)
        }
        e.complete();
    }

}
