import {Component, ElementRef} from '@angular/core';
import {NavParams, NavController, LoadingController, ModalController} from "ionic-angular";
import {ConsultationService} from '../consultation.service';
import {PCURL} from "../../../app/app.constants";
import {CommonService} from "../../../core/common.service";
import {ShareWxComponent} from "../../../components/share-wx/share-wx";

@Component({
    selector: 'page-componentsdetails',
    templateUrl: 'componentsdetails.html',
})
export class Componentsdetails {
    lidataId;
    title = "";
    data: any = {Title: '', ReleaseTime: '', Text: ''};
    RelationArr = [];
    navli = '';

    constructor(public navParams: NavParams,
                private serve: ConsultationService,
                private navCtrl: NavController,
                private loadCtrl: LoadingController,
                private el: ElementRef,
                private modalCtrl: ModalController,
                public commonSer: CommonService
    ) {
    }

    ionViewDidLoad() {
        this.lidataId = this.navParams.get('dataId');
        this.navli = this.navParams.get('navli');
        this.serve.UpdateNewsReadCount(this.lidataId).subscribe(res => {
            if (!res.data) {
            }
        })
        this.GetRelationNewsByID(this.lidataId);
    }

    GetRelationNewsByID(id) {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });

        loading.present();
        this.serve.GetRelationNewsByID(id).subscribe(res1 => {
            this.serve.GetNewsByID(id).subscribe((res2: any) => {

                res1.data.forEach(item => {
                    item.ReleaseTime = item.ReleaseTime.replace('T', ' ');
                    item.ReleaseTime = item.ReleaseTime.slice(0, 10);
                });


                this.RelationArr = res1.data;
                this.data = res2.data;
                this.data.ReleaseTime = this.data.ReleaseTime.replace('T', ' ');
                this.data.ReleaseTime = this.data.ReleaseTime.slice(0, 10);
                this.el.nativeElement.querySelector('.inner-html').innerHTML = this.data.Text;
                loading.dismiss();
                setTimeout(() => {
                    // let innerHtml=document.getElementById('innerHtml');
                    let innerHtml: any = document.querySelectorAll('.inner-html');
                    for (let n = 0; n < innerHtml.length; n++) {
                        this.serve.ModifyALabelSkip(innerHtml[n], this.navCtrl);
                    }
                }, 30);
            });
        });
    }


    goComponentsdetails(data) {
        this.navCtrl.push(Componentsdetails, {dataId: data.Id});
        setTimeout(() => {
            data.ReadCount++;
        }, 2000)
    }

    //微信分享
    wxShare(item) {
        let modal = this.modalCtrl.create(ShareWxComponent, {data: item});
        modal.present();
    }
}
