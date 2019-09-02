import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {Keyboard} from "@ionic-native/keyboard";

@Component({
    selector: 'comment',
    templateUrl: 'comment.html'
})
export class CommentComponent {
    @ViewChild('textAreaElement') textAreaElement: ElementRef;

    replyContent: string;
    placeholder: string;
    type: string;
    starList = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
    score;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard,
                public viewCtrl: ViewController) {
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
        const data = {
            'replyContent': this.replyContent,
            'score': this.score
        };
        this.viewCtrl.dismiss(data);
    }

}
