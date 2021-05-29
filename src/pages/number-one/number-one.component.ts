import {Component} from '@angular/core';
import {NavController, LoadingController, ModalController} from 'ionic-angular';
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

    // 销售案例 列表
    dataList = [];
    // 销售案例 id 信息
    informationopt = {};
    // 销售案例分页信息
    dataPost = {
        "page": 1,
        "pageSize": 10,
        "total": 0,
        "Title": "",
        "Code": "publish",
        "SubTitle": "",
        "TypeID": "xsal",
        "States": "1",
        "OrderBy": "ReleaseTime",
        "IsAsc": true,
        "SortDir": "ReleaseTime"
    };
    navliArr = [];
    isdoInfinite = true;
    no_list = false;
    navliopt = {};

    constructor(private navCtrl: NavController,
                private serve: numberOneService,
                private logSer: LogService, private modalCtrl: ModalController,
                private loadCtrl: LoadingController) {
        this.GetDictionaryByPCode();
        this.logSer.visitLog('zhuangyuanshuo');
    }

    // 切换 '销冠风采'|'销售案例'
    switchInformation(title) {
        this.isdoInfinite = true;
        this.no_list = false;
        this.isdoInfinite = true;
        this.dataList = [];
        this.crownList = [];
        this.dataPost.TypeID = this.navliopt[title];
        this.dataPost.page = 1;
        this.crownData.page = 1;
        this.navli = title;
        this.getData();
    }

    //销售案例
    newsGetNewsList() {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        if (this.dataPost.page == 1) {
            loading.present();
        }
        this.serve.newsGetNewsList(this.dataPost).subscribe(res => {
            if (res.data.NewsItems.length == 0) {
                this.isdoInfinite = false;
            }
            let arr = res.data.NewsItems;
            this.dataList = this.dataList.concat(arr);
            this.no_list = this.dataList.length == 0 ? true : false;
            if (this.dataPost.page == 1) {
                loading.dismiss();
            }
        });
    }

    GetDictionaryByPCode() {
        this.serve.GetDictionaryByPCode().subscribe(res => {
            if (!res.data) {
                return
            }
            if (res.data.length == 0) {
                this.isdoInfinite = false;
            }
            res.data.forEach(item => {
                if (item.TypeCode == 'zys') {
                    this.navliArr = item.children;
                    item.children.forEach(e => {
                        this.navliopt[e['label']] = e.value;
                    });
                    this.dataPost.TypeID = item.children[0].value;
                }
            });
            this.getData();
        });
    }

    // 销冠风采
    GetNewsList() {
        let loading = this.loadCtrl.create({
            content: '加载中...'
        });
        if (this.dataPost.page == 1) {
            loading.present();
        }
        this.serve.GetNewsList(this.crownData).subscribe(res => {
            if (res.data.NewsItems.length == 0) {
                this.isdoInfinite = false;
            }
            let arr = res.data.NewsItems;
            this.crownList = this.crownList.concat(arr);
            this.no_list = this.crownList.length == 0 ? true : false;
            if (this.dataPost.page == 1) {
                loading.dismiss();
            }
        });
    };

    // 查看案例详情
    goComponentsdetailsOne(data) {
        data['Id'] = data['ID'];
        this.navCtrl.push(NumberOneDetailsComponent, {data: data});
    }

    goComponentsdetails(data) {
        data['GetNewsList'] = 'xsal';
        this.navCtrl.push(Componentsdetails, {dataId: data.Id, navli: '销售案例'});
    }

    // 请求数据
    getData() {
        if (this.navli == '销冠风采') {
            this.GetNewsList();
        } else {
            this.newsGetNewsList();
        }
    }

    // 下拉加载更多
    doInfinite(e) {
        this.dataPost.page++;
        this.crownData.page++;
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }


    // 下拉刷新
    doRefresh(e) {
        this.isdoInfinite = true;
        this.no_list = false;
        this.isdoInfinite = true;
        this.dataList = [];
        this.crownList = [];
        this.dataPost.page = 1;
        this.crownData.page = 1;
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
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
}
