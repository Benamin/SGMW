import { Component, OnInit,ElementRef } from '@angular/core';
import { NavParams, NavController,LoadingController} from "ionic-angular";
import {numberOneService} from '../numberOne.service';
import {InAppBrowser} from "@ionic-native/in-app-browser";


@Component({
  selector: 'page-numberOneDetails',
  templateUrl: './numberOneDetails.component.html',
})
export class NumberOneDetailsComponent implements OnInit {
  lidata;
  title="";
  data:any={Name:"",ModifyTime:"",Mark:""};
  RelationArr=[];
  constructor(public navParams: NavParams,
    private serve :numberOneService,
    public navCtrl: NavController,
    private loadCtrl: LoadingController,
    private inAppBrowser: InAppBrowser,
    private el:ElementRef
  ) {}

  ngOnInit(): void {
   
}
ionViewDidEnter() {
  this.lidata = this.navParams.get('data');
  console.log(this.lidata);
  this.title=this.lidata.GetNewsList=='xsal'?"详情":'详情中心'
  // this.GetNewsByID(this.lidata.ID);
  this.GetRelationNewsByID(this.lidata.ID);
};
  GetRelationNewsByID(id){
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });

    loading.present();
    this.serve.GetRelationNewsByID(id).subscribe(res1 => {
      this.serve.GetNewsByID(id).subscribe((res2:any) => {

        res1.data.forEach(item => {
          if(!item.ReleaseTime){
            item.ReleaseTime=item.ModifyTime;
          }
          item.ReleaseTime=item.ReleaseTime.replace('T',' ');
          item.ReleaseTime=item.ReleaseTime.slice(0,16);
        });

        if(!res2.data.ReleaseTime){
          res2.data.ReleaseTime= this.serve.formatDate(new Date(res2.data.ModifyTime),4);
        }
        res2.data.ReleaseTime=res2.data.ReleaseTime.replace('T',' ');
        res2.data.ReleaseTime=res2.data.ReleaseTime.slice(0,16);

        this.data=res2.data;
        this.RelationArr=res1.data;
        this.el.nativeElement.querySelector('.inner-html').innerHTML=this.data.Text;

        loading.dismiss();
        setTimeout(() => {
          let innerHtml:any=document.querySelectorAll('.inner-html');
          console.log(innerHtml);
          for(let n=0;n<innerHtml.length;n++){
            this.serve.ModifyALabelSkip(innerHtml[n],this.navCtrl);
          }
        }, 30);
      });
    });
  }
  goComponentsdetails(data){
    this.navCtrl.push(NumberOneDetailsComponent,{data:data});
  }


}
