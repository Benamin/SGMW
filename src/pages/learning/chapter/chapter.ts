import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@Component({
    selector: 'page-chapter',
    templateUrl: 'chapter.html',
})
export class ChapterPage {
    @Input() chapter;
    @Input() IsBuy;
    @Input() TeachTypeName;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
    }

    getMore(e) {
        e.show = !e.show;
    }

}
