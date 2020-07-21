import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {Componentsdetails} from './componentsdetails/componentsdetails.component';
import {ConsultationService} from './consultation.service';
import {LogService} from "../../service/log.service";
import {CommonService} from "../../core/common.service";
import {PCURL} from "../../app/app.constants";
import {DatePipe} from "@angular/common";

@IonicPage()
@Component({
    selector: 'page-consultation',
    templateUrl: 'consultation.html',
})
export class ConsultationPage {
    navli: '';
    navliopt = {};
    navliArr = [];
    dataPost = {
        "page": 0,
        "pageSize": 10,
        "total": 0,
        "Title": "",
        "Code": "publish",
        "SubTitle": "",
        "TypeID": "xyxw",
        "States": "1",
        "IsAsc": true,
        "SortDir": "DESC",
        "OrderBy": "ReleaseTime",
    }
    dataList = [];
    isdoInfinite = true;
    no_list = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private serve: ConsultationService,
        private logSer: LogService,
        public datePipe: DatePipe,
        public commonSer: CommonService,
        private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.logSer.visitLog('zx');
        this.GetDictionaryByPCode();
    }

    GetDictionaryByPCode() {
        this.serve.GetDictionaryByPCode().subscribe(res => {
            res.data.forEach(element => {
                this.navliopt[element['label']] = element.value;
            });
            this.navliArr = res.data;
            this.switchInformation(res.data[0].label);
        })
    }

    switchInformation(title) {
        this.navli = title;
        this.no_list = false;
        this.isdoInfinite = true;
        this.dataList = [];
        this.dataPost.TypeID = this.navliopt[title];
        this.dataPost.page = 1;
        this.getData();
    }

    goComponentsdetails(data) {
        this.navCtrl.push(Componentsdetails, {dataId: data.Id, navli: this.navli});
        setTimeout(() => {
            data.ReadCount++;
        }, 1500)
    }

    getData() {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        if (this.dataPost.page == 1) {
            loading.present();
        }
        this.serve.GetNewsList(this.dataPost).subscribe(res => {
            if (res.data.NewsItems.length == 0) {
                this.isdoInfinite = false;
            }
            let arr = res.data.NewsItems.map(e => {
                e.ReleaseTime = e.ReleaseTime.slice(0, 10);
                return e;
            });
            arr.forEach((element, i) => {
                element['imgarr'] = 'img1';
            });
            this.dataList = this.dataList.concat(arr);
            this.no_list = this.dataList.length == 0 ? true : false;
            if (this.dataPost.page == 1) {
                loading.dismiss();
            }
        })
    }

    doInfinite(e) {
        this.dataPost.page++;
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    doRefresh(e) {
        this.dataPost.page = 1;
        this.dataList = [];
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    //微信分享
    wxShare(item) {
        let description = item.Text.replace(/\&nbsp;/g, '');
        let thumb = '';

        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        if (item.SourceURLList.length > 0) {
            thumb = item.SourceURLList[0];
        }
        const obj = {
            Title: item.Title,
            description: this.navli,
            thumb: thumb,
            webpageUrl: `${PCURL}noticedetails/${item.Id}`
        }
        this.commonSer.weChatShare(obj);
    }
}


