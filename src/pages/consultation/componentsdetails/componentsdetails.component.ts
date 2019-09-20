import { Component } from '@angular/core';
import { NavParams} from "ionic-angular";
import {ConsultationService} from '../consultation.service';
@Component({
    selector: 'page-componentsdetails',
    templateUrl: 'componentsdetails.html',
})
export class Componentsdetails {
  lidata;
  data:any={Title:'',ReleaseTime:'',Text:''};

  constructor(public navParams: NavParams,private serve :ConsultationService) {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata);
    this.GetNewsByID(this.lidata.Id);
    this.GetRelationNewsByID(this.lidata.Id);
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
    });
  }
  // https://devapi.chinacloudsites.cn/api/ENews/GetNewsByID?id=5238d84e-076b-4f8e-b170-016d1fc55996
}
