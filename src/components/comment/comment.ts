import {Component, ElementRef, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Keyboard} from "@ionic-native/keyboard";
import {CommonService} from "../../core/common.service";
import {SelectTeacherComponent} from "../select-teacher/select-teacher";
import {defaultHeadPhoto} from "../../app/app.constants";

@Component({
    selector: 'comment',
    templateUrl: 'comment.html'
})
export class CommentComponent {
    @ViewChild('textAreaElement') textAreaElement: ElementRef;

    teacher;
    teacherList;

    replyContent: string;
    placeholder: string;
    type: string;
    starList = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    score;

    defalutPhoto = defaultHeadPhoto;   //默认头像；

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard, private commonSer: CommonService,
                public viewCtrl: ViewController,
                private modalCtrl: ModalController) {
        this.placeholder = this.navParams.get('placeholder');
        this.type = this.navParams.get('type');
        if (this.navParams.get('teacherList')) this.teacherList = this.navParams.get('teacherList');

        setTimeout(() => {
            this.textAreaElement.nativeElement.focus();
            this.keyboard.show();
        }, 500)
    }

    /**
     *
     * @param score  分数 从0开始
     */
    checkStar(score) {
        this.score = score + 1;
        let arr = new Array(5);
        for (let i = 0; i < arr.length; i++) {
            if (i < score + 1) {
                arr[i] = "icon-star-fill";
            } else {
                arr[i] = "icon-star";
            }
        }
        this.starList = arr;
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

    //选择讲师
    selectTeacher() {
        let modal = this.modalCtrl.create(SelectTeacherComponent, {
            teacherList: this.teacherList
        });
        modal.onDidDismiss(res => {
            if (res) {
                this.teacher = res;
            }
        });
        modal.present();
    }

    submit() {
        if (!this.replyContent || this.replyContent.trim() == "") {
            this.commonSer.toast('请输入评价!');
            return
        }
        if (this.type != 'talk' && !this.score) {
            this.commonSer.toast('请先打分!');
            return
        }
        if (this.type == "teacher" && !this.teacher) {
            this.commonSer.toast('请选择讲师!');
            return
        }
        if (this.type == "teacher" && this.score == 1 && this.replyContent.length < 10) {  //讲师评价出现一星的情况
            this.commonSer.toast("请至少输入10字以上的内容方可提交");
            return;
        }
        if (this.type == "course" && this.score == 1 && this.replyContent.length < 10) {  //课程评价出现一星的情况
            this.commonSer.toast("请至少输入10字以上的内容方可提交");
            return;
        }
        const data = <any>{
            'replyContent': this.replyContent,
            'score': this.score
        };
        if (this.type == "teacher") data.TopicID = this.teacher.UserID;
        this.viewCtrl.dismiss(data);
    }

}
