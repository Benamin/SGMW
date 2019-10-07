import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import { NavController, NavParams,LoadingController} from "ionic-angular";
import { Componentsdetails } from './componentsdetails/componentsdetails.component';
import {ConsultationService} from './consultation.service';
@IonicPage()
@Component({
    selector: 'page-consultation',
    templateUrl: 'consultation.html',
})
export class ConsultationPage {
    navli:'新车资讯'|'行业新闻'|'培训资讯'='新车资讯';
    navliopt = {};
    dataPost={
        "page": 0,
        "pageSize": 10,
        "total": 0,
        "Title": "",
        "Code": "publish",
        "SubTitle": "",
        "TypeID":"xyxw", 
        "States": "1",  
        "OrderBy": "IsStick",
        "IsAsc": true,
        "SortDir": "DESC"
    }
    dataList=[];
    isdoInfinite=true;
    no_list=false;
  
    constructor(private navCtrl:NavController,
        public navParams: NavParams,
        private serve:ConsultationService,
        private loadCtrl: LoadingController){
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this.getData();
 
        this.GetDictionaryByPCode();
    }
    GetDictionaryByPCode(){
      
     
       
        this.serve.GetDictionaryByPCode().subscribe(res => {
            console.log('新闻列表',res);
            res.data.forEach(element => {
                this.navliopt[element['label']]= element.value;
            });
            this.switchInformation('新车资讯');
           
        })
    }
    switchInformation(title){
    
        this.navli=title;
        this.no_list=true;
        this.isdoInfinite=true;
        this.dataList=[];
        this.dataPost.TypeID=this.navliopt[title];
        this.dataPost.page=1;
        this.getData();
    }
    
    goComponentsdetails(data){
        this.navCtrl.push(Componentsdetails,{data:data});
    }
    getData(){
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        if(this.dataPost.page==1){
            loading.present();
        }
        this.serve.GetNewsList(this.dataPost).subscribe(res => {
            // this.dataPost.page++;
            console.log(res);
            if(res.data.NewsItems.length==0){
                this.isdoInfinite=false;
            }
            let arr=res.data.NewsItems;
            arr.forEach((element,i) => {
                element['imgarr']='img1';
            });
            this.dataList=this.dataList.concat(arr);
            this.no_list=this.dataList.length==0?true:false;
            loading.dismiss();
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


