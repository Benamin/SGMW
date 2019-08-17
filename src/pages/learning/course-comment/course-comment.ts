import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CommentComponent} from "../../../components/comment/comment";


@Component({
    selector: 'page-course-comment',
    templateUrl: 'course-comment.html',
})
export class CourseCommentPage {
    title;
    list = new Array(10)

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private modalCtrl: ModalController) {
        this.title = this.navParams.get("title");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CourseCommentPage');
    }

    openComment() {
        let modal = this.modalCtrl.create(CommentComponent, {placeholder: '请输入评价'});
        modal.onDidDismiss(res => {
            if (res) {
                console.log(res);
                this.replyHandle();
            }
        });
        modal.present();
    }

    replyHandle() {

    }

}
