import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-course',
    templateUrl: 'course.html',
})
export class CoursePage {
    navbarList = [
        {type: '1', name: '学习中'},
        {type: '2', name: '已完成'},
    ]
    slide = [1,2,3]
    list = [];

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CoursePage');
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


