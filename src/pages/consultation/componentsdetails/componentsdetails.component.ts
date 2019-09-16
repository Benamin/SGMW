import { Component } from '@angular/core';
import { NavParams} from "ionic-angular";

@Component({
    selector: 'page-componentsdetails',
    templateUrl: 'componentsdetails.html',
})
export class Componentsdetails {
  lidata;
  constructor(public navParams: NavParams) {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata)
  }
}
