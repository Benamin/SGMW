import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../learn.service";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-teacher',
    templateUrl: 'teacher.html',
})
export class TeacherPage {

    info;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private learSer:LearnService,private commonSer:CommonService) {
    }

    ionViewDidLoad() {
        this.info = this.navParams.get('item');
    }

    async focusHandle(UserID) {
        const data = {
            TopicID: UserID
        };
        await this.learSer.SaveSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('关注成功');
                this.info.IsSubscribe = true;
            }
        )
    }

    async cancleFocusHandle(UserID) {
        const data = {
            TopicID: UserID
        };
        this.learSer.CancelSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('取消关注成功');
                this.info.IsSubscribe = false;
            }
        )
    }
}
