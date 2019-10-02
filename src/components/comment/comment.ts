import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {Keyboard} from "@ionic-native/keyboard";
import {CommonService} from "../../core/common.service";

@Component({
    selector: 'comment',
    templateUrl: 'comment.html'
})
export class CommentComponent {
    @ViewChild('textAreaElement') textAreaElement: ElementRef;

    teacher = "";
    teacherList;

    replyContent: string;
    placeholder: string;
    type: string;
    starList = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    score;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard, private commonSer: CommonService,
                public viewCtrl: ViewController) {
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

    submit() {
        if (!this.replyContent || this.replyContent.trim() == "") {
            this.commonSer.toast('请输入评价!');
            return
        }
        if (this.type != 'talk' && !this.score) {
            this.commonSer.toast('请先打分!');
            return
        }
        if (this.type == "teacher" && this.teacher == "") {
            this.commonSer.toast('请选择讲师!');
            return
        }
        const data =<any> {
            'replyContent': this.replyContent,
            'score': this.score
        };
        if(this.type == "teacher") data.TopicID = this.teacher;
        this.viewCtrl.dismiss(data);
    }

}
