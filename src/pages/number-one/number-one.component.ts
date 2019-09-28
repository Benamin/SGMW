import { Component } from '@angular/core';
import { NavController} from "ionic-angular";
import { NumberOneDetailsComponent } from "./numberOneDetails/numberOneDetails.component";

@Component({
    selector: 'page-number-one',
    templateUrl: 'number-one.html'
})
export class NumberOne {

  navli: '销冠风采'|'销售案例' = '销冠风采';
  constructor(private navCtrl:NavController,){
    console.log('销冠风采')
  }
  switchInformation(title){
      this.navli=title;
  }
  goComponentsdetails(data){
    this.navCtrl.push(NumberOneDetailsComponent,{data:data});
  }
}
