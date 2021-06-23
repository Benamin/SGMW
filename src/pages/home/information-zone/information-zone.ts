import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, Content, LoadingController, NavController, Platform, Refresher} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {FileService} from "../../../core/file.service";
import {timer} from "rxjs/observable/timer";
import {InformationDownloadPage} from "../information-download/information-download";
import {File} from "@ionic-native/file";
import {CommonService} from "../../../core/common.service";
import {FileOpener} from "@ionic-native/file-opener";


@Component({
    selector: 'page-information-zone',
    templateUrl: 'information-zone.html',
})
export class InformationZonePage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;

    userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
        Title: '',
        page: 1,
        PageSize: 5,
        TotalCount: 0,
        isLoad: false,
        resourceLists: [],
        FileType: null,
        typeArr: []
    };

    localFile = [];
    localFileName = [];

    constructor(public navCtrl: NavController, private keyboard: Keyboard, private fileOpener: FileOpener,
                public platform: Platform, private file: File, public commonSer: CommonService,
                private homeSer: HomeService, private loadCtrl: LoadingController, private fileSer: FileService, public actionSheetCtrl: ActionSheetController,) {

    }

    ionViewDidLoad() {
        this.showLoading();
        this.page.resourceLists = [];
        this.GetAskType();
    }

    goDownLoad() {
        this.navCtrl.push(InformationDownloadPage);
    }

    // 获取问题类型
    GetAskType() {
        const data = {
            code: 'MaterialFileType' // 问题类型 传QuestionType  资料分类传 MaterialFileType
        };
        this.homeSer.GetAskType(data).subscribe(
            (res) => {
                let allType = {label: '全部类型', value: null};
                let typeArr = [allType];
                if (res.data && res.data.length > 0) {
                    for (let i = 0; i < res.data.length; i++) {
                        typeArr.push(res.data[i])
                    }
                }
                this.page.typeArr = typeArr;
                this.page.FileType = this.page.typeArr[0];
                this.switchTypeLists(this.page.FileType)
            }
        )
    }

    showKey() {
        this.keyboard.show();
    }

    //按键
    search(event) {
        if (event && event.keyCode == 13) {
            this.doSearch();
        }
    }

    doSearch() {
        this.page.page = 1;
        this.getList();
    }

    setSuffixClass(fileName) {
        let suffix = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
        // 后缀名
        // let suffixArr = ['Docx', 'PDF', 'Xls', 'PPT', 'ZIP']
        let suffixClass: Object = {'no': 'true'}
        let suffixText = '';
        // Word文档的扩展名有两个,分别是:doc和docx
        if (suffix === 'doc' || suffix === 'docx') {
            suffixClass = {'docx-bg': 'true'};
            suffixText = 'docx';
        } else if (suffix === 'pdf') { // pdf
            suffixClass = {'pdf-bg': 'true'};
            suffixText = 'pdf';
        } else if (suffix === 'xlsx' || suffix === 'xls' || suffix === 'csv') { // excel有很多版本的文件格式，另存为那里可以看到如图各类格式: xlsx/xls/csv
            suffixClass = {'xls-bg': 'true'};
            suffixText = 'xls';
        } else if (suffix === 'pptx') { // pptx
            suffixClass = {'ppt-bg': 'true'};
            suffixText = 'ppt';
        } else if (suffix === 'zip') { // pptx
            suffixClass = {'zip-bg': 'true'};
            suffixText = 'zip';
        }
        let suffixObj = {
            suffixClass: suffixClass,
            suffixText: suffixText
        }
        return suffixObj
    }

    getList() {
        this.page.page = 1;
        let dataObj = {
            DisplayName: this.page.Title,
            Page: this.page.page,
            PageSize: this.page.PageSize
        };
        if (this.page.FileType && this.page.FileType.value !== null) dataObj = Object.assign({}, dataObj, {FileTypeId: this.page.FileType.value}); // 判断是否全部类型
        this.homeSer.GetQueryMaterialFile(dataObj).subscribe(
            (res) => {
                if (this.file.dataDirectory) this.readLocalFile();
                this.page.resourceLists = this.DataAssign(res.data);
                this.page.isLoad = true;
                this.dismissLoading();
            }
        )
    }

    DataAssign(Data) {
        let Lists = Data.MaterialFileItems
        // 处理返回的 数据
        for (var i = 0; i < Lists.length; i++) {
            Lists[i].suffixObj = this.setSuffixClass(Lists[i].Name);
        }
        this.page.TotalCount = Data.TotalCount;
        return Lists;
    }

    //下拉刷新
    doRefresh(e) {
        this.page.page = 1;
        this.getList();
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
    downLoad(item, e) {
        e.stopPropagation();
        const obj = this.setSuffixClass(item.Name);
        const fileName = item.DIsplayName + "." + obj.suffixText;
        this.fileSer.downloadFile(item.FileAddress, fileName, false, "sgmwInforFile/");
        setTimeout(() => {
            this.readLocalFile();
        }, 3000);
    }

    // 切换类型
    switchTypeLists(item) {
        this.showLoading();
        this.page.FileType = item;
        this.getList();
    }

    //读取本地文件
    readLocalFile() {
        let storageDirectory;
        let folderName;
        if (this.platform.is('ios')) {
            storageDirectory = this.file.dataDirectory;
            let arr = storageDirectory.split('/');
            let index = arr.length;
            let b = arr.splice(index - 2, 2);
            folderName = b.join('/');
            storageDirectory = arr.join('/');
        } else if (this.platform.is('android')) {
            // storageDirectory = file.externalDataDirectory + 'courseFile/';
            folderName = "sgmwInforFile/"
            storageDirectory = this.file.externalRootDirectory;
        }

        this.file.listDir(storageDirectory, folderName).then(
            value => {
                this.localFile = value.concat([]);
                this.localFileName = value.map(e => {
                    const name = e.name.split(".")[0];
                    return name;
                })
                console.log(value);
            }).catch(error => {
            this.localFile = [];
            console.log("error", error)
        })
    }

    //打开本地文件
    openFile(item) {
        const obj = this.setSuffixClass(item.Name);
        const fileName = item.DIsplayName + "." + obj.suffixText;
        const file = this.localFile.find(e => e.name === fileName);
        if (file) {
            const fileType = this.fileSer.getFileMimeType(file.name);
            this.fileOpener.open(file.nativeURL, fileType).then(res => {
                console.log(JSON.stringify(res));
            }, error => {
                this.commonSer.alert(`打开文件出错,${JSON.stringify(error)}`);
            });
        }
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }
}
