import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
    selector: 'privacy',
    templateUrl: 'privacy.html'
})
export class PrivacyComponent {

    text: string;

    constructor(public viewCtrl: ViewController,) {
        this.text = 'Hello World';
    }

    //返回
    back() {
        this.viewCtrl.dismiss();
    }

}
