import {Component, ElementRef, ViewChild} from '@angular/core';
import {defaultHeadPhoto} from "../../app/app.constants";
import {ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Keyboard} from "@ionic-native/keyboard";
import {CommonService} from "../../core/common.service";
import {SelectTeacherComponent} from "../select-teacher/select-teacher";

@Component({
    selector: 'comment-by-course',
    templateUrl: 'comment-by-course.html'
})
export class CommentByCourseComponent {

    @ViewChild('textAreaElement') textAreaElement: ElementRef;

    replyContent: string;
    placeholder: string;
    type: string;
    starList1 = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    starList2 = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    starList3 = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    score1;
    score2;
    score3;

    defalutPhoto = defaultHeadPhoto;   //默认头像；

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard, private commonSer: CommonService,
                public viewCtrl: ViewController,
                private modalCtrl: ModalController) {
        this.placeholder = this.navParams.get('placeholder');
        this.type = this.navParams.get('type');
        setTimeout(() => {
            this.textAreaElement.nativeElement.focus();
            this.keyboard.show();
        }, 500)
    }

    /**
     *
     * @param score  分数 从0开始
     */
    checkStar1(score) {
        this.score1 = score + 1;
        let arr = new Array(5);
        for (let i = 0; i < arr.length; i++) {
            if (i < score + 1) {
                arr[i] = "icon-star-fill";
            } else {
                arr[i] = "icon-star";
            }
        }
        this.starList1 = arr;
    }

    checkStar2(score) {
        this.score2 = score + 1;
        let arr = new Array(5);
        for (let i = 0; i < arr.length; i++) {
            if (i < score + 1) {
                arr[i] = "icon-star-fill";
            } else {
                arr[i] = "icon-star";
            }
        }
        this.starList2 = arr;
    }

    checkStar3(score) {
        this.score3 = score + 1;
        let arr = new Array(5);
        for (let i = 0; i < arr.length; i++) {
            if (i < score + 1) {
                arr[i] = "icon-star-fill";
            } else {
                arr[i] = "icon-star";
            }
        }
        this.starList3 = arr;
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

    submit() {
        if (!this.replyContent || this.replyContent.trim() == "") {
            this.commonSer.toast('请输入评价!');
            return
        }
        if (!this.score1 || !this.score2 || !this.score2) {
            this.commonSer.toast('请先打分!');
            return
        }
        if ((this.score1 == 1 || this.score2 == 1 || this.score3 == 1) && this.replyContent.length < 10) {  //讲师评价出现一星的情况
            this.commonSer.toast("请至少输入10字以上的内容方可提交");
            return;
        }
        const data = <any>{
            'replyContent': this.replyContent,
            'Score1': this.score1,
            'Score2': this.score2,
            'Score3': this.score3,
        };
        this.viewCtrl.dismiss(data);
    }

}
