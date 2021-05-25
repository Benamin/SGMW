import {Component} from '@angular/core';
import {ActionSheetController, LoadingController, NavController, Platform} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {FileService} from "../../../core/file.service";
import {timer} from "rxjs/observable/timer";
import {File} from "@ionic-native/file";
import {CommonService} from "../../../core/common.service";
import {FileOpener} from "@ionic-native/file-opener";

@Component({
    selector: 'page-information-download',
    templateUrl: 'information-download.html',
})
export class InformationDownloadPage {
    storageDirectory;
    folderName;
    fileList = [];
    isLoad = false;

    constructor(public navCtrl: NavController, private keyboard: Keyboard,
                private platform: Platform, private file: File, private commonSer: CommonService,
                private fileOpener: FileOpener,
                private homeSer: HomeService, private loadCtrl: LoadingController, private fileSer: FileService, public actionSheetCtrl: ActionSheetController,) {
    }

    ionViewDidLoad() {
        if (this.platform.is('ios')) {
            this.storageDirectory = this.file.dataDirectory;
            let arr = this.storageDirectory.split('/');
            let index = arr.length;
            let b = arr.splice(index - 2, 2);
            this.folderName = b.join('/');
            this.storageDirectory = arr.join('/');
        } else if (this.platform.is('android')) {
            // this.storageDirectory = this.file.externalDataDirectory + 'courseFile/';
            this.folderName = "sgmw/"
            this.storageDirectory = this.file.externalRootDirectory;
        } else {
            // exit otherwise, but you could add further types here e.g. Windows
            return false;
        }
        this.readFile();
    }

    readFile() {
        console.log(this.storageDirectory);
        this.file.listDir(this.storageDirectory, this.folderName).then(
            value => {
                this.fileList = value;
                this.isLoad = true;
                console.log(value);
            }).catch(error => {
            console.log("error", error)
        })
    }

    openFile(file) {
        const fileType = this.fileSer.getFileMimeType(file.name);
        this.fileOpener.open(file.nativeURL, fileType).then(res => {
            console.log(JSON.stringify(res));
        }, error => {
            this.commonSer.alert(`打开文件出错,${JSON.stringify(error)}`);
        });
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
        console.log('筛选下载的文件，无法实现的话 麻烦问下需求怎么说')
    }

    setSuffixClass(fileName) {
        let suffix = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();; // 后缀名
        // let suffixArr = ['Docx', 'PDF', 'Xls', 'PPT', 'ZIP']
        let suffixClass: Object = {'no': 'true'}
        let suffixText = '';
        // Word文档的扩展名有两个,分别是:doc和docx
        if (suffix === 'doc' || suffix === 'docx') {
            suffixClass = {'docx-bg': 'true'};
            suffixText = 'Docx';
        } else if (suffix === 'pdf') { // pdf
            suffixClass = {'pdf-bg': 'true'};
            suffixText = 'PDF';
        } else if (suffix === 'xlsx' || suffix === 'xls' || suffix === 'csv') { // excel有很多版本的文件格式，另存为那里可以看到如图各类格式: xlsx/xls/csv
            suffixClass = {'xls-bg': 'true'};
            suffixText = 'Xls';
        } else if (suffix === 'pptx') { // pptx
            suffixClass = {'ppt-bg': 'true'};
            suffixText = 'PPT';
        } else if (suffix === 'zip') { // pptx
            suffixClass = {'zip-bg': 'true'};
            suffixText = 'ZIP';
        }
        let suffixObj = {
            suffixClass: suffixClass,
            suffixText: suffixText
        }
        return suffixObj
    }

}
