import { Component, OnInit } from '@angular/core';
import { NavParams, NavController} from "ionic-angular";
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
  constructor(public navParams: NavParams,private serve :numberOneService,public navCtrl: NavController) {}

  ngOnInit(): void {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata);
    this.title=this.lidata.GetNewsList=='xsal'?"详情":'详情中心'
    this.GetNewsByID(this.lidata.ID);
    this.GetRelationNewsByID(this.lidata.ID);
}
  GetNewsByID(id){
    this.serve.GetNewsByID(id).subscribe((res:any) => {
      console.log(res);
      this.data=res.data;
    });
  }
  GetRelationNewsByID(id){
    this.serve.GetRelationNewsByID(id).subscribe(res => {
      console.log(res);
      this.RelationArr=res.data;
    });
  }
  goComponentsdetails(data){
    this.navCtrl.push(NumberOneDetailsComponent,{data:data});
  }

  // /api/winnerNews/GetNewsByID?id=bf47b551-649c-410e-b424-016d73c3efcb
}
