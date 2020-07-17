import {Component} from '@angular/core';
import {ViewController, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the ListsRankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'eidt-modal',
    templateUrl: './eidt-modal.component.html'
})
export class EidtModalComponent {
    modalTitle;
    modalType = 'template';

    list = [];

    selectList = [];

    constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.modalType = this.navParams.get('modalType');
        this.list = this.navParams.get('list');
        this.list.forEach(e => e.selected = false);
    }

    //取消
    dismiss() {
        this.viewCtrl.dismiss();
    }

    //确定
    submit() {
        this.viewCtrl.dismiss(this.selectList);
    }

    selectItem(item) {
        const index = this.selectList.findIndex(e => e.Id == item.Id);
        if (index > -1) {
            item.selected = false;
            this.selectList.splice(index, 1);
        } else {
            item.selected = true;
            this.selectList.push(item);
        }
    }
}
