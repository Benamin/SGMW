import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PDFDocumentProxy} from "pdfjs-dist";

@Component({
    selector: 'page-view-file',
    templateUrl: 'view-file.html',
})
export class ViewFilePage {

    displayData: any = {};
    totalPage;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
        this.displayData = this.navParams.get('displayData');
    }

    afterLoad(pdf: PDFDocumentProxy) {
        this.totalPage = pdf.numPages;
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

}
