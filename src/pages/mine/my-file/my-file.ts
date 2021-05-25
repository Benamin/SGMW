import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {File} from "@ionic-native/file";
import {FileOpener} from "@ionic-native/file-opener";
import {CommonService} from "../../../core/common.service";
import {FileService} from "../../../core/file.service";


@Component({
    selector: 'page-my-file',
    templateUrl: 'my-file.html',
})
export class MyFilePage {

    storageDirectory;
    fileList;
    folderName;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private platform: Platform, private commonSer: CommonService,
                private file: File, private fileOpener: FileOpener, private fileSer: FileService
    ) {
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
            this.storageDirectory = this.file.externalDataDirectory;
        } else {
            // exit otherwise, but you could add further types here e.g. Windows
            return false;
        }
        this.readFile();
    }

    readFile() {
        console.log(this.storageDirectory)
        this.file.listDir(this.storageDirectory, this.folderName).then(
            value => {
                console.log(value);
                this.fileList = value;
            }
        )
    }

    openFile(file) {
        const fileType = this.fileSer.getFileMimeType(file.name);
        this.fileOpener.open(file.nativeURL, fileType).then(res => {
            console.log(JSON.stringify(res));
        }, error => {
            this.commonSer.alert(`打开文件出错,${JSON.stringify(error)}`);
        });
    }

}
