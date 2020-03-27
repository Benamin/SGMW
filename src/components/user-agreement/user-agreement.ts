import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
    selector: 'user-agreement',
    templateUrl: 'user-agreement.html'
})
export class UserAgreementComponent {

    text: string;

    constructor(private viewCtrl: ViewController) {
        console.log('Hello UserAgreementComponent Component');
        this.text = 'Hello World';
    }

    //返回
    back() {
        this.viewCtrl.dismiss();
    }
}
