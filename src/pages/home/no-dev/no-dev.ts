import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
    selector: 'page-no-dev',
    templateUrl: 'no-dev.html',
})
export class NoDevPage {
    title;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.title = this.navParams.get('title');
        this.title=this.title?this.title:'论坛';
    }

}
