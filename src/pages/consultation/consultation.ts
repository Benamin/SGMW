import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import { NavController, NavParams} from "ionic-angular";
import { Componentsdetails } from './componentsdetails/componentsdetails.component';
import {ConsultationService} from './consultation.service';

@IonicPage()
@Component({
    selector: 'page-consultation',
    templateUrl: 'consultation.html',
})
export class ConsultationPage {
    navli:'新车资讯'|'行业新闻'|'培训资讯'='新车资讯';
    dataPost={
        "page": 1,
        "pageSize": 30,
        "total": 0,
        "Title": "",
        "Code": "publish",
        "SubTitle": "",
        "TypeID":"xczx", 
        "States": "1",  
        "OrderBy": "IsStick",
        "IsAsc": true,
        "SortDir": "DESC"
    }
    dataList=[];
    constructor(private navCtrl:NavController,public navParams: NavParams,private serve:ConsultationService){
        this.getData();
    }
    switchInformation(title){
        this.navli=title;
        this.dataList=[];
        this.getData();
    }
    goComponentsdetails(data){
        this.navCtrl.push(Componentsdetails,{data:data});
    }
    
    getData(){
        this.serve.GetNewsList(this.dataPost).subscribe(res => {
            console.log(res);
            let arr=res.data.NewsItems;
            arr.forEach((element,i) => {
                element['imgarr']='img1';
                if(i%3==2){ // img1 img3 imgBig
                    element['imgarr']='imgBig';

                }
            });
            this.dataList=arr;
        })
    }
}


