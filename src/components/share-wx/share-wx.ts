import {Component, Type} from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
    selector: 'share-wx',
    templateUrl: 'share-wx.html'
})
export class ShareWxComponent {


    constructor(private viewCtrl: ViewController) {
    }

    //分享到微信
    closeModal() {
        this.viewCtrl.dismiss();
    }

    shareWX(type) {
        console.log(type);
        this.viewCtrl.dismiss({type: type})
    }

}
