import {Component} from '@angular/core';
import {ActionSheetController, LoadingController, NavController} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {FileService} from "../../../core/file.service";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-information-download',
    templateUrl: 'information-download.html',
})
export class InformationDownloadPage {
		userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
        Title: '',
        page: 1,
        PageSize: 5,
        TotalCount: 0,
        isLoad: false,
        resourceLists: [],
        FileType: null,
        typeArr: [
            // { label: '全部类型', value: null },
            // { label: 'Docx', value: 'doc' },
            // { label: 'PDF', value: 'pdf' },
            // { label: 'Xls', value: 'xlsx' },
            // { label: 'PPT', value: 'pptx' },
            // { label: 'ZIP', value: 'zip' }
        ]
    };

    constructor(public navCtrl: NavController, private keyboard: Keyboard, private homeSer: HomeService,private loadCtrl: LoadingController, private fileSer: FileService, public actionSheetCtrl: ActionSheetController,) {

    }

    // ionViewDidEnter() {
    //   this.getList();
    // }
    ionViewDidLoad() {
        this.page.resourceLists = [];
        this.GetAskType();
        this.getList();
    }

    goDownLoad() {
        this.navCtrl.push(InformationDownloadPage);
    }

    // 获取问题类型
    GetAskType() {
        let loading = this.loadCtrl.create({
            content: ''
        });

        loading.present();
        const data = {
            code: 'MaterialFileType' // 问题类型 传QuestionType  资料分类传 MaterialFileType
        };
        this.homeSer.GetAskType(data).subscribe(
            (res) => {
                let allType =  { label: '全部类型', value: null };
                let typeArr = [allType];
                if (res.data && res.data.length>0) {
                    for (let i=0; i<res.data.length; i++) {
                        typeArr.push(res.data[i])
                    }
                }
                this.page.typeArr = typeArr;
                this.page.FileType = this.page.typeArr[0];
                loading.dismiss();
            }
        )
    }

    showKey() { this.keyboard.show(); }
    //按键
    search(event) {
        if (event && event.keyCode == 13) {
            this.doSearch();
        }
    }
    doSearch() {
        console.log('筛选下载的文件，无法实现的话 麻烦问下需求怎么说')
    }

    setSuffixClass(fileName) {
        let suffix = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();; // 后缀名
        // let suffixArr = ['Docx', 'PDF', 'Xls', 'PPT', 'ZIP']
        let suffixClass:Object = { 'no': 'true' }
        let suffixText = '';
        // Word文档的扩展名有两个,分别是:doc和docx
        if (suffix === 'doc' || suffix === 'docx') {
            suffixClass = { 'docx-bg': 'true' };
            suffixText = 'Docx';
        } else if (suffix === 'pdf') { // pdf
            suffixClass = { 'pdf-bg': 'true' };
            suffixText = 'PDF';
        } else if (suffix === 'xlsx' || suffix === 'xls' || suffix === 'csv') { // excel有很多版本的文件格式，另存为那里可以看到如图各类格式: xlsx/xls/csv
            suffixClass = { 'xls-bg': 'true' };
            suffixText = 'Xls';
        } else if (suffix === 'pptx') { // pptx
            suffixClass = { 'ppt-bg': 'true' };
            suffixText = 'PPT';
        } else if (suffix === 'zip') { // pptx
            suffixClass = { 'zip-bg': 'true' };
            suffixText = 'ZIP';
        }
        let suffixObj = {
            suffixClass: suffixClass,
            suffixText: suffixText
        }
        return suffixObj
    }

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        let dataObj = {
            DisplayName: this.page.Title,
            Page: 1,
            PageSize: this.page.PageSize
        };
        if (this.page.FileType && this.page.FileType.value !== null) dataObj = Object.assign({}, dataObj, { FileTypeId: this.page.FileType.value }); // 判断是否全部类型
        this.homeSer.GetQueryMaterialFile(dataObj).subscribe(
            (res) => {
                this.page.resourceLists = this.DataAssign(res.data);
                this.page.isLoad = true;
                loading.dismiss();
            }
        )
    }

    DataAssign(Data) {
        let Lists = Data.MaterialFileItems
        // 处理返回的 数据
        for (var i=0; i<Lists.length; i++) {
            Lists[i].suffixObj = this.setSuffixClass(Lists[i].Name);
        }
        this.page.TotalCount = Data.TotalCount;
        return Lists;
    }

    //下拉刷新
    doRefresh(e) {
        this.page.page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

    //加载更多
    doInfinite(e) {
        // console.log(9966, this.page.resourceLists.length, this.page.TotalCount)
        if (this.page.resourceLists.length == this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.page++;
        let paramsObj = {
            DisplayName: this.page.Title,
            Page: this.page.page,
            PageSize: this.page.PageSize
        };
        if (this.page.FileType && this.page.FileType.value !== null) paramsObj = Object.assign({}, paramsObj, {FileTypeId: this.page.FileType.value});
        this.homeSer.GetQueryMaterialFile(paramsObj).subscribe(
            (res) => {
                this.page.resourceLists = this.page.resourceLists.concat(this.DataAssign(res.data));
                e.complete();
            }
        )
    }

    //下载文件
    downLoad(fileUrl, fileName, e) {
        e.stopPropagation();
        this.fileSer.downloadFile(fileUrl, fileName,true);
    }

    // 切换类型
    switchTypeLists(item) {
        this.page.FileType = item;
        this.getList();
    }

}
