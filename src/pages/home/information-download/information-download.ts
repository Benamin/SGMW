import {Component} from '@angular/core';
import {ActionSheetController, LoadingController, NavController, Platform} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {FileService} from "../../../core/file.service";
import {timer} from "rxjs/observable/timer";
import {File, FileEntry, IFile} from "@ionic-native/file";
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
            (value: any) => {
                value.forEach(e => {
                    this.getFileMedata(e.nativeURL, (createTime) => {
                        e.createTime = createTime;
                    });
                })
                setTimeout(() => {
                    value.sort(function (a, b) {
                        return b.createTime - a.createTime;
                    })
                    this.allList = value.concat([]);
                    this.fileList = value.concat([]);
                    this.isLoad = true;
                }, 500);
            }).catch(error => {
            this.fileList = [];
            this.allList = [];
            console.log("error", error)
        })
    }

    getFileMedata(filePath, callback) {
        console.log("-----------filepath", filePath);
        this.file.resolveLocalFilesystemUrl(filePath).then((fileEntry: FileEntry) => {
            console.log("fileEntry", fileEntry)
            return new Promise((resolve, reject) => {
                fileEntry.file(meta => resolve(meta), error => reject(error));
            });
        }).then((fileMeta: IFile) => {
            const createTime = fileMeta.lastModifiedDate.toFixed(0);
            console.log('-000000000fileMeta0000000-');
            console.log(createTime);
            callback(createTime);
        });
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
