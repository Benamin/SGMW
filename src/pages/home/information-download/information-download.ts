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
    allList = <any>[];
    fileList = <any>[];
    isLoad = false;
    keyWord = "";

    constructor(public navCtrl: NavController, private keyboard: Keyboard,
                private platform: Platform, private file: File, private commonSer: CommonService,
                private fileOpener: FileOpener,
                private homeSer: HomeService, private loadCtrl: LoadingController, private fileSer: FileService, public actionSheetCtrl: ActionSheetController,) {
    }

    ionViewDidLoad() {
        this.readFile();
    }

    readFile() {
        if (this.platform.is('ios')) {
            this.storageDirectory = this.file.dataDirectory;
            let arr = this.storageDirectory.split('/');
            let index = arr.length;
            let b = arr.splice(index - 2, 2);
            this.folderName = b.join('/');
            this.storageDirectory = arr.join('/');
        } else if (this.platform.is('android')) {
            // this.storageDirectory = this.file.externalDataDirectory + 'courseFile/';
            this.folderName = "sgmwInforFile/"
            this.storageDirectory = this.file.externalRootDirectory;
        } else {
            // exit otherwise, but you could add further types here e.g. Windows
            return false;
        }
        console.log(this.storageDirectory);
        this.file.listDir(this.storageDirectory, this.folderName).then(
            value => {
                this.allList = value.concat([]);
                this.fileList = value.concat([]);
                this.isLoad = true;
                console.log(value);
            }).catch(error => {
            this.fileList = [];
            this.allList = [];
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
        const arr = this.allList.filter(e => e.name.includes(this.keyWord));
        this.fileList = arr.concat([]);
        this.isLoad = true;
    }
}
