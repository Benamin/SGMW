import {Component, ElementRef} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {EidtModalComponent} from '../../../../components/eidt-modal/eidt-modal.component';//需要弹出的页面

/**
 * Generated class for the EditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-edit',
    templateUrl: 'edit.html',
})
export class EditPage {
    editTitle = '帖子编辑'
    form = {
        title: '',
    }
    modal

    constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,private elementRef: ElementRef) {
    }

    ionViewDidLoad() {
        let editType = this.navParams.get('editType');
        if (editType && editType === 'video') {
            // video 视频
            this.editTitle = '视频编辑';
        } else if (editType && editType === 'topic') {
            // topic 帖子
            this.editTitle = '帖子编辑';
        }
        console.log('ionViewDidLoad EditPage');

    }

    goBack() {
        this.navCtrl.pop();
    }


    showModal(type) {
        console.log(888, type)
        this.modal = this.modalCtrl.create(EidtModalComponent, {'modalType': type});
        this.modal.present();
    }

    uploadFile(e) {
        let pics = this.elementRef.nativeElement.getElementsByClassName('picInput')[0];
        // let promises = files.map((img: any, index) => { })

        console.log('pics Blob:', pics)
    }
}
