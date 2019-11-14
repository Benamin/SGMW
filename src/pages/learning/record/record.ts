import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FileService} from "../../../core/file.service";

@Component({
  selector: 'page-record',
  templateUrl: 'record.html',
})
export class RecordPage {
  @Input() fileList;
  @Input() maxNum;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private fileSer:FileService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordPage');
  }

  //office、pdf、图片、视频
  openFile(file){
    this.fileSer.viewFile(file.fileUrl, file.filename);
  }

}
