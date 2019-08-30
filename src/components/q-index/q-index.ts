import { Component } from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";

@Component({
  selector: 'q-index',
  templateUrl: 'q-index.html'
})
export class QIndexComponent {

  list = [];
  choice = [];

  constructor(private params: NavParams,private statusBar:StatusBar,
              private viewCtrl: ViewController) {
    this.list = this.params.get('list');
    console.log(this.list);
  }

  chooseItem(item,i){
    this.viewCtrl.dismiss(i);
  }

}
