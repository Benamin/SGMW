import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from "ionic-angular";
import { ConsultationService } from '../consultation.service';
import {InAppBrowser} from "@ionic-native/in-app-browser";

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
    public navCtrl: NavController,
    private loadCtrl: LoadingController,
    private inAppBrowser: InAppBrowser) {
  }
  ngOnInit(): void {
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
        loading.dismiss();
        setTimeout(() => {
            this.ModifyALabelSkip();
        }, 30);
      });
    });
  }
  ModifyALabelSkip(){
    let innerHtml=document.getElementById('innerHtml');
    let allA=innerHtml.querySelectorAll('a');
    for(let n=0;n<allA.length;n++){
        let onedom=allA[n];
        let _href=onedom.getAttribute('href');
        if(_href){
          onedom.setAttribute('_href',_href);
          onedom.setAttribute('href','javascript:void(0);');
          onedom.addEventListener('click',(e:any) => {
            console.log(e.target.getAttribute('_href'));
            let url_href=e.target.getAttribute('_href');
            this.inAppBrowser.create(url_href, '_system');
          })
        }
    }
  }


  goComponentsdetails(data) {
    this.navCtrl.push(Componentsdetails, { data: data });
  }
}
