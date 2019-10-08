import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from "ionic-angular";
import { ConsultationService } from '../consultation.service';
@Component({
  selector: 'page-componentsdetails',
  templateUrl: 'componentsdetails.html',
})
export class Componentsdetails {
  lidata;
  title = "";
  data: any = { Title: '', ReleaseTime: '', Text: '' };
  RelationArr = [];
  constructor(public navParams: NavParams,
    private serve: ConsultationService,
    public navCtrl: NavController,
    private loadCtrl: LoadingController) {

  }
  ngOnInit(): void {
    this.lidata = this.navParams.get('data');
    console.log(this.lidata);
    this.title = this.lidata.GetNewsList == 'xsal' ? "详情" : '详情中心'
    // this.GetNewsByID(this.lidata.Id);
    this.GetRelationNewsByID(this.lidata.Id);
  }
  // GetNewsByID(id){
  //   this.serve.GetNewsByID(id).subscribe((res:any) => {
  //     console.log(res);
  //     this.data=res.data;
  //   });
  // }
  GetRelationNewsByID(id) {
    let loading = this.loadCtrl.create({
      content: '加载中...'
    });

    loading.present();
    this.serve.GetRelationNewsByID(id).subscribe(res1 => {
      this.serve.GetNewsByID(id).subscribe((res2: any) => {

        res1.data.forEach(item => {
          item.ReleaseTime=item.ReleaseTime.replace('T',' ');
          item.ReleaseTime=item.ReleaseTime.slice(0,16);
        });

        this.RelationArr = res1.data;
        this.data = res2.data;
        this.data.ReleaseTime=this.data.ReleaseTime.replace('T',' ');
        this.data.ReleaseTime=this.data.ReleaseTime.slice(0,16);
        loading.dismiss();
      });
    });
  }


  goComponentsdetails(data) {
    this.navCtrl.push(Componentsdetails, { data: data });
  }
}
