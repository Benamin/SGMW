import {Component} from '@angular/core';
import { NavController, NavParams, ViewController,ToastController, LoadingController, Platform } from 'ionic-angular';
import {defaultHeadPhoto} from "../../../app/app.constants";
import {Storage} from "@ionic/storage";
import {HomeService} from "../home.service";
import {ChooseImageProvider} from "../../../providers/choose-image/choose-image";
import {AppVersion} from "@ionic-native/app-version";
import {CommonService} from "../../../core/common.service";
// import {WantToAskListsPage} from "../want-to-ask/ask-lists/ask-lists";

@Component({
    selector: 'page-want-ask-modal',
    templateUrl: 'want-ask-modal.html',
})
export class wantAskModalPage {

    nowItemObj = null;
    mineInfo = null;
    defaultHeadPhoto = defaultHeadPhoto;
    askTypeArr = []
    nowSelectAskType = null
    questionDesc = ''
    imgArr = []
    UnitType = ''
    AppVersion = ''

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                private storage: Storage,
                private homeSer: HomeService,
                private loadCtrl: LoadingController,
                private platform: Platform,
                private appVersion: AppVersion,
                public chooseImage: ChooseImageProvider,
                private commonSer: CommonService,
                public toastCtrl: ToastController) {
    }

    ionViewDidEnter() {
        this.nowSelectAskType = null;
        this.imgArr = [];
        this.questionDesc = '';

        this.GetAskType();
        this.storage.get('user').then(value => {
            if (value) {
                this.mineInfo = value;
            }
        });
        let dateDay = new Date().getTime();
        this.storage.set('TodayTodayIsWantAsk', dateDay);
    }

    // 获取问题类型
    GetAskType() {
        let loading = this.loadCtrl.create({
            content: ''
        });

        loading.present();
        const data = {
            code: 'QuestionType' // 问题类型 传QuestionType  资料分类传 MaterialFileType
        };
        this.homeSer.GetAskType(data).subscribe(
            (res) => {
                console.log(9999, res.data)
                this.askTypeArr = res.data;
                loading.dismiss();
            }
        )
    }

    changeAskType(aTIndex) {
        this.nowSelectAskType = this.askTypeArr[aTIndex];
    }

    //检测版本
    checkVersion() {
        let platform;
        if (this.platform.is('ios')) platform = 'IOS';
        if (this.platform.is('android')) platform = 'android';
        this.UnitType = platform;
        this.appVersion.getVersionNumber().then((version: string) => {
            this.AppVersion = version.split('.').join('');  //2123
            console.log('UnitType', this.UnitType, 'AppVersion', this.AppVersion)
        }).catch(err => {
        });
    }

    //选中图片
    takePic() {
        if (this.imgArr.length < 4) {
            this.chooseImage.takePic((data) => {
                this.imgArr.push(data);
            })
        }
    }

    submitAdd() {
        if (this.nowSelectAskType === null) {
            let toast = this.toastCtrl.create({
                message: '请选择反馈类型！',
                position: 'middle',
                duration: 1500
            });
            toast.present();
            return
        }

        if (!this.questionDesc) {
            let toast = this.toastCtrl.create({
                message: '请填写描述！',
                position: 'middle',
                duration: 1500
            });
            toast.present();
            return
        }
        let loading = this.loadCtrl.create({
            content: ''
        });

        loading.present();
        const data = {
            Title: this.questionDesc, // this.Title,  // 标题
            questionDesc: this.questionDesc,  // 问题描述
            questionTypeId: this.nowSelectAskType.value,  // 问题类型Id
            questionType: this.nowSelectAskType.label, // 问题类型
            UnitType: this.UnitType, // 设备类型
            AppVersion: this.AppVersion, // 版本号
            imgAddress: this.imgArr // 图片地址
        };

        this.homeSer.PutQuestion(data).subscribe(
            (res) => {
                if (res.code === 200) {
                    this.close();
                    let toast = this.toastCtrl.create({
                        message: '问题发布成功！',
                        position: 'middle',
                        duration: 1500
                    });
                    toast.present();
                    this.questionDesc = '';
                    this.imgArr = [];
                    // let timer = setTimeout(() => {
                    //     this.goWantToAsk()
                    // }, 1000);
                    loading.dismiss();
                }
            }
        )
    }

    // goWantToAsk() {
    //     this.navCtrl.push(WantToAskListsPage);
    // }


    close() {
        this.viewCtrl.dismiss();
    }

    stop(e) {
        e.stopPropagation();
    }

}
