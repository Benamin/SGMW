import {Component, ElementRef, ViewChild} from '@angular/core';
import {defaultHeadPhoto} from "../../app/app.constants";
import {ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Keyboard} from "@ionic-native/keyboard";
import {CommonService} from "../../core/common.service";
import {SelectTeacherComponent} from "../select-teacher/select-teacher";
import {LearnService} from "../../pages/learning/learn.service";

@Component({
    selector: 'comment-by-course',
    templateUrl: 'comment-by-course.html'
})
export class CommentByCourseComponent {

    @ViewChild('textAreaElement') textAreaElement: ElementRef;

    replyContent: string;
    topicID: string;
    placeholder: string;
    TopicType: string;
    starList1 = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    starList2 = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    starList3 = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    starList4 = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    score1;
    score2;
    score3;
    score4;

    defalutPhoto = defaultHeadPhoto;   //默认头像；
    btnDisable = true;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard, private commonSer: CommonService,
                public viewCtrl: ViewController,
                private learnSer: LearnService,
                private modalCtrl: ModalController) {
        this.placeholder = this.navParams.get('placeholder');
        this.TopicType = this.navParams.get('type');
        this.topicID = this.navParams.get("TopicID");
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

    checkStar4(score) {
        this.score4 = score + 1;
        let arr = new Array(5);
        for (let i = 0; i < arr.length; i++) {
            if (i < score + 1) {
                arr[i] = "icon-star-fill";
            } else {
                arr[i] = "icon-star";
            }
        }
        this.starList4 = arr;
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

    submit() {
        if (!this.btnDisable) {
            return;
        }
        if (!this.replyContent || this.replyContent.trim() == "") {
            this.commonSer.toast('请输入评价!');
            return
        }
        if (!this.score1 || !this.score2 || !this.score2 || !this.score4) {
            this.commonSer.toast('请先打分!');
            return
        }
        if ((this.score1 == 1 || this.score2 == 1 || this.score3 == 1 || this.score4 == 1) && this.replyContent.length < 10) {  //讲师评价出现一星的情况
            this.commonSer.toast("请至少输入10字以上的内容方可提交");
            return;
        }
        this.btnDisable = false;
        const data = {
            TopicID: this.topicID,
            Score: 0,
            Score1: this.score1,
            Score2: this.score2,
            Score3: this.score3,
            Score4: this.score4,
            Contents: this.replyContent,
            TopicType: this.TopicType
        };
        this.learnSer.SaveComment(data).subscribe(
            (res) => {
                this.btnDisable = true;
                if (res.data) {
                    this.commonSer.toast('评价成功');
                    this.viewCtrl.dismiss(data);
                } else {
                    this.commonSer.toast(`每人只能评价一次`);
                }

            }
        )
    }
}
