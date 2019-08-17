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

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private keyboard: Keyboard,
                public viewCtrl: ViewController) {
        this.placeholder = this.navParams.get('placeholder');
        setTimeout(() => {
            this.textAreaElement.nativeElement.focus();
            this.keyboard.show();
        }, 500)
    }

    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

    submit() {
        this.viewCtrl.dismiss(this.replyContent);
    }

}
