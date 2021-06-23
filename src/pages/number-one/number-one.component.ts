import {Component, ViewChild} from '@angular/core';
import {NavController, LoadingController, ModalController, Content, Refresher} from 'ionic-angular';
import {NumberOneDetailsComponent} from "./numberOneDetails/numberOneDetails.component";
import {numberOneService} from './numberOne.service';
import {Componentsdetails} from '../consultation/componentsdetails/componentsdetails.component';
import {LogService} from "../../service/log.service";
import {ShareWxComponent} from '../../components/share-wx/share-wx';

@Component({
    selector: 'page-number-one',
    templateUrl: 'number-one.html'
})
export class NumberOne {

    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;

    navli: '销冠风采' | '销售案例' = '销冠风采';
    // 销冠风采 列表
    crownList = [];
    crownData = {
        page: 1,
        pageSize: 20,
        total: 0,
        Title: '',
        SubTitle: '',
        States: '-1',
        OrderBy: 'Sort',//排序字段
        IsAsc: true, //是否升序
        SortDir: 'ReleaseTime'
    };

    navliArr = [];
    no_list = false;
    navliopt = {};

    constructor(private navCtrl: NavController,
                private serve: numberOneService,
                private logSer: LogService, private modalCtrl: ModalController,
                private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.logSer.visitLog('zhuangyuanshuo');
        this.showLoading();
    }

    // 销冠风采
    GetNewsList() {
        this.serve.GetNewsList(this.crownData).subscribe(res => {
            let arr = res.data.NewsItems;
            if (this.crownData.page === 1) {
                this.crownList = arr;
            } else {
                this.crownList = this.crownList.concat(arr);
            }
            this.no_list = this.crownList.length == 0;
            this.dismissLoading();
        });
    };

    // 查看案例详情
    goComponentsdetailsOne(data) {
        data['Id'] = data['ID'];
        this.navCtrl.push(NumberOneDetailsComponent, {data: data});
    }

    // 下拉加载更多
    doInfinite(e) {
        console.log("doInfinite");
        this.crownData.page++;
        this.GetNewsList();
    }


    // 微信分享
    wxShare(data) {
        let description = data.Mark;
        let thumb = data.ImageURL;

        if (description.length > 100) {
            description = description.slice(0, 100);
        }

        const obj = {
            title: data.Name,
            description: description,
            thumb: thumb,
            paramsUrl: "/static/openApp.html?scheme_url=numberOne&Id=" + data.Id
        }
        let modal = this.modalCtrl.create(ShareWxComponent, {
            data: obj,
        });
        modal.present();
    }

    doRefresh(e) {
        this.crownData.page = 1;
        this.GetNewsList();
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }

}
