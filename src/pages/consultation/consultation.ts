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
        "pageSize": 10,
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
    isdoInfinite=true;

    constructor(private navCtrl:NavController,public navParams: NavParams,private serve:ConsultationService){
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getData();
    }
    switchInformation(title){
        this.navli=title;
        this.dataList=[];
        this.dataPost.page=1;
        this.getData();
    }
    goComponentsdetails(data){
        this.navCtrl.push(Componentsdetails,{data:data});
    }
    getData(){
        this.serve.GetNewsList(this.dataPost).subscribe(res => {
            // this.dataPost.page++;
            console.log(res);
            if(res.data.NewsItems.length==0){
                this.isdoInfinite=false;
            }
            let arr=res.data.NewsItems;
            arr.forEach((element,i) => {
                element['imgarr']='img1';
                // if(i%3==2){ // img1 img3 imgBig
                //     element['imgarr']='imgBig';
                // }
            });
            this.dataList=this.dataList.concat(arr);
        })
    }

    doInfinite(e){
        console.log('加载')
        this.dataPost.page++;
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }
    doRefresh(e){
        console.log('刷新')
        this.dataPost.page=1;
        this.dataList=[];
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }
}


