import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MineService} from "../mine.service";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
    selector: 'page-notification-detail',
    templateUrl: 'notification-detail.html',
})
export class NotificationDetailPage {

    id;
    detail;

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private sanitizer:DomSanitizer) {
    }

    ionViewDidLoad() {
        this.id = this.navParams.get('id');
        this.getDetail();
    }

    getDetail() {
        const data = {
            id: this.id
        }
        this.mineSer.GetNewsById(data).subscribe(
            (res) => {
                this.detail = res.data;
                let con = this.detail.Text.replace(/\r?\n/g, "<br />");
                this.detail.Text = this.sanitizer.bypassSecurityTrustHtml(con);
            }
        )
    }

}
