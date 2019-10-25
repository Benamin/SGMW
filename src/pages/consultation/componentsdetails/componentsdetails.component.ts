import { Component,ElementRef } from '@angular/core';
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
  navli='';
  constructor(public navParams: NavParams,
    private serve: ConsultationService,
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private el:ElementRef
    ) {
  }
  ngOnInit(): void {

  }
  ionViewDidEnter() {
    this.lidata = this.navParams.get('data');
    this.navli = this.navParams.get('navli');
    console.log(this.lidata);
    this.title = this.lidata.GetNewsList == 'xsal' ? "详情" : '详情中心'
    this.GetRelationNewsByID(this.lidata.Id);
  }

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
        console.log(this.el.nativeElement);
        this.el.nativeElement.querySelector('.inner-html').innerHTML=this.data.Text;
        loading.dismiss();
        setTimeout(() => {
          // let innerHtml=document.getElementById('innerHtml');
          let innerHtml:any=document.querySelectorAll('.inner-html');
          console.log(innerHtml);
          for(let n=0;n<innerHtml.length;n++){
            this.serve.ModifyALabelSkip(innerHtml[n],this.navCtrl);
          }
        }, 30);
      });
    });
  }



  goComponentsdetails(data) {
    this.navCtrl.push(Componentsdetails, { data: data });
  }
}
