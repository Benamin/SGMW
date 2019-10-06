import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {PDFDocumentProxy} from "pdfjs-dist";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-view-file',
    templateUrl: 'view-file.html',
})
export class ViewFilePage {

    displayData: any = {};
    totalPage;
    currentZoom = 1;
    uploadLoading;

    constructor(public navCtrl: NavController, public navParams: NavParams, private commerSer: CommonService,
                private viewCtrl: ViewController, private loadingCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.displayData = this.navParams.get('displayData');
        console.log(this.displayData);
        this.uploadLoading = this.loadingCtrl.create({
            content: '加载中...',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.uploadLoading.present();
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    //加载进度条
    progress(ev) {
        let progress = Math.round(100.0 * ev.loaded / this.displayData.Size);
        this.uploadLoading.setContent('加载中...' + progress + '%');
    }

    //加载完成
    afterLoad(pdf: PDFDocumentProxy) {
        this.uploadLoading.dismiss();
        this.totalPage = pdf.numPages;
    }

    //加载出错
    onError(ev) {
        this.commerSer.alert(JSON.stringify(ev));
    }

    //放大or缩小
    changeZoom(type){
        if(type == "add") this.currentZoom += 0.2;
        if(type == "remove") this.currentZoom -= 0.2;
    }

}
