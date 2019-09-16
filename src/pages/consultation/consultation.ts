import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import { NavController, NavParams} from "ionic-angular";
import { Componentsdetails } from './componentsdetails/componentsdetails.component';

@IonicPage()
@Component({
    selector: 'page-consultation',
    templateUrl: 'consultation.html',
})
export class ConsultationPage {
    navli:'新车资讯'|'行业新闻'|'培训资讯'='新车资讯';
    constructor(private navCtrl:NavController,public navParams: NavParams){
        
    }
    switchInformation(title){
        this.navli=title;
    }
    goComponentsdetails(){
        this.navCtrl.push(Componentsdetails,{data:{id:'1',title:'这是一个标题'}});
    }
}


