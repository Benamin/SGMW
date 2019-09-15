import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-consultation',
    templateUrl: 'consultation.html',
})
export class ConsultationPage {
    navli:'新车资讯'|'行业新闻'|'培训资讯'='新车资讯';
    constructor(){
        
    }
    switchInformation(title){
        this.navli=title;
    }
}


