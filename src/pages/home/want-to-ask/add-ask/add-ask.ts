import {Component, ViewChild} from '@angular/core';
import {Content, LoadingController, NavController, Platform, Refresher, ToastController} from 'ionic-angular';
import {AppVersion} from "@ionic-native/app-version";
import {HomeService} from "../../home.service";
import {ChooseImageProvider} from "../../../../providers/choose-image/choose-image";
import {CommonService} from "../../../../core/common.service";
import {WantToAskListsPage} from "../ask-lists/ask-lists";
import {WantToAskDetailPage} from "../ask-detail/ask-detail";

@Component({
    selector: 'page-add-ask',
    templateUrl: 'add-ask.html',
})
export class AddAskPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;
    page = {
        CommonProblemLists: [],
        Title: '',
        questionDesc: '',
        askTypeArr: [],
        nowSelectAskType: null,
        UnitType: '',
        AppVersion: '',
        imgArr: []
    };

    constructor(public navCtrl: NavController, private homeSer: HomeService, private loadCtrl: LoadingController, public chooseImage: ChooseImageProvider, private platform: Platform, private appVersion: AppVersion, public toastCtrl: ToastController, private commonSer: CommonService,) {

    }

    ionViewDidLoad() {
        this.showLoading();
        this.checkVersion();
        this.GetAskType();
        this.getCommonProblem();
    }
    ionViewDidEnter() {
        this.page.nowSelectAskType = null;
        this.page.imgArr = [];
        this.page.questionDesc = '';
	}

    // 获取问题类型
    GetAskType() {
        const data = {
            code: 'QuestionType' // 问题类型 传QuestionType  资料分类传 MaterialFileType
        };
        this.homeSer.GetAskType(data).subscribe(
            (res) => {
                this.page.askTypeArr = res.data;
                if (this.page.askTypeArr.length > 0) {
                    this.page.nowSelectAskType = this.page.askTypeArr[0];
                }
            }
        )
    }

    changeAskType(aTIndex) {
        this.page.nowSelectAskType = this.page.askTypeArr[aTIndex];
    }

    //选中图片
    takePic() {
        if (this.page.imgArr.length < 4) {
            this.chooseImage.takePic((data) => {
                this.page.imgArr.push(data);
            })
        }
    }

    deleteImg(imgIndex) {
        this.page.imgArr.splice(imgIndex, 1);
        console.log('imgArr', this.page.imgArr);
    }

    //检测版本
    checkVersion() {
        let platform;
        if (this.platform.is('ios')) platform = 'IOS';
        if (this.platform.is('android')) platform = 'android';
        this.page.UnitType = platform;
        this.appVersion.getVersionNumber().then((version: string) => {
            this.page.AppVersion = version.split('.').join('');  //2123
            console.log('UnitType', this.page.UnitType, 'AppVersion', this.page.AppVersion)
        }).catch(err => {
        });
    }

    submitAdd() {
        if (this.page.nowSelectAskType === null) {
            let toast = this.toastCtrl.create({
                message: '请选择问题类型！',
                position: 'middle',
                duration: 1500
            });
            toast.present();
            return
        }
        if (!this.page.questionDesc) {
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
            Title: this.page.questionDesc, // this.page.Title,  // 标题
            questionDesc: this.page.questionDesc,  // 问题描述
            questionTypeId: this.page.nowSelectAskType.value,  // 问题类型Id
            questionType: this.page.nowSelectAskType.label, // 问题类型
            UnitType: this.page.UnitType, // 设备类型
            AppVersion: this.page.AppVersion, // 版本号
            imgAddress: this.page.imgArr // 图片地址
        };

        this.homeSer.PutQuestion(data).subscribe(
            (res) => {
                if (res.code === 200) {
                    this.commonSer.alert('问题发布成功！');
                    console.log(9999, res)
                    console.log('提交成功后清空并进入问题全部列表')
                    this.page.questionDesc = '';
                    this.page.imgArr = [];
                    this.goWantToAsk()
                    loading.dismiss();
                }
            }
        )
    }

    goWantToAsk() {
        this.navCtrl.push(WantToAskListsPage);
    }

    getCommonProblem() {
        const data = {
            PageIndex: 1,
            PageSize: 5
        };
        this.homeSer.getCommonProblem(data).subscribe(
            (res) => {
                if (res.code === 200) {
                    this.page.CommonProblemLists = res.data.QuestionItems;
                }
                this.dismissLoading()
            }
        )
    }

    goAskedDetail(item) {
        this.navCtrl.push(WantToAskDetailPage, {item: item});
    }

    doRefresh(e) {
        this.getCommonProblem();
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }

}
