import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {File} from "@ionic-native/file";
import {e} from "@angular/core/src/render3";


@Component({
    selector: 'page-my-file',
    templateUrl: 'my-file.html',
})
export class MyFilePage {

    storageDirectory;
    fileList;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private platform: Platform,
                private file: File
    ) {
    }

    ionViewDidLoad() {
        if (this.platform.is('ios')) {
            this.storageDirectory = this.file.documentsDirectory;
        } else if (this.platform.is('android')) {
            // this.storageDirectory = this.file.externalDataDirectory + 'courseFile/';
            this.storageDirectory = this.file.externalDataDirectory;
        } else {
            // exit otherwise, but you could add further types here e.g. Windows
            return false;
        }
        this.readFile();
    }

    readFile() {
        this.file.listDir(this.storageDirectory, 'courseFile').then(
            value => {
                this.fileList = value;
            }
        )
    }

}
