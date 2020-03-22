import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

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
  modalTitle
  modalType = 'template'
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('this.navParams', this.navParams.get('modalType'))
    this.modalType = this.navParams.get('modalType');
    // if (modalType) {
    //   if (modalType === 'template') { // 模板多选弹窗
    //     ;
    //   } else if (modalType === 'topic') { // 话题多选弹窗
    //     this.modalTitle = '请选择话题块';
    //   }
    // }
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
