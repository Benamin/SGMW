import { Component } from '@angular/core';

@Component({
    selector: 'page-number-one',
    templateUrl: 'number-one.html'
})
export class NumberOne {

  navli: '销冠风采'|'销售案例' = '销冠风采';
  constructor(){
    console.log('销冠风采')
  }
  switchInformation(title){
      this.navli=title;
  }
}
