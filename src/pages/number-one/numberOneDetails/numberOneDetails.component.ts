import { Component, OnInit } from '@angular/core';
import { NavParams, NavController,LoadingController} from "ionic-angular";
import {numberOneService} from '../numberOne.service';
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
    private loadCtrl: LoadingController) {}

  ngOnInit(): void {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata);
    this.title=this.lidata.GetNewsList=='xsal'?"详情":'详情中心'
    // this.GetNewsByID(this.lidata.ID);
    this.GetRelationNewsByID(this.lidata.ID);
}
  // GetNewsByID(id){
  //   this.serve.GetNewsByID(id).subscribe((res:any) => {
  //     console.log(res);
  //     this.data=res.data;
  //   });
  // }
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

        loading.dismiss();
      });
    });
  }
  goComponentsdetails(data){
    this.navCtrl.push(NumberOneDetailsComponent,{data:data});
  }

  // /api/winnerNews/GetNewsByID?id=bf47b551-649c-410e-b424-016d73c3efcb
}
