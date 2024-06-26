import {Component, ViewChild} from '@angular/core';
import {
    Content,
    IonicPage,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Refresher
} from 'ionic-angular';
import {MineService} from "../../../mine/mine.service";
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../home.service";
import {LookTestPage} from "../look-test/look-test";
import {DoTestPage} from "../do-test/do-test";
import {CommonService} from "../../../../core/common.service";
import {DatePipe} from "@angular/common";
import {EmitService} from "../../../../core/emit.service";
import {LogService} from "../../../../service/log.service";
import {Storage} from "@ionic/storage";
import {SimulationTestPage} from "../../simulation-test/simulation-test";
import {ShareWxComponent} from "../../../../components/share-wx/share-wx";

@Component({
    selector: 'page-exam',
    templateUrl: 'test-center.html',
})
export class TestCenterPage {
    @ViewChild(Content) content: Content;
    @ViewChild(Refresher) refresher: Refresher;

    navbarList = [
        {type: '1', name: '未开始'},
        {type: '2', name: '未完成'},
        {type: '3', name: '已完成'},
    ];

    /// 1-未开始
    /// 2-进行中
    /// 3-已完成
    page = {
        EName: '',
        StudyState: 1,
        EType: 2,
        load: false,
        Page: 1,
        PageSize: 10,
        TotalItems: 0,
    };
    examList = [];
    clickDisable = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, private mineSer: MineService,
                private homeSer: HomeService, private datePipe: DatePipe,
                private commonSer: CommonService, private modalCtrl: ModalController,
                public eventEmitSer: EmitService,
                private storage: Storage,
                private logSer: LogService,
                private loadCtrl: LoadingController) {
        this.storage.set('sgmwType', null);
    }

    ionViewDidLoad() {
        this.logSer.visitLog('kszx');
    }

    ionViewDidEnter() {
        this.eventEmitSer.eventEmit.emit('false');
        this.page.Page = 1;
        this.getList();
        this.showLoading();
    }

    //考试列表-EType
    //EType  1-等级考试 2-普通考试 3-课堂练习（预习作业）4-课后作业 5-调查问卷
    getList() {
        const data = {
            StudyState: [this.page.StudyState],
            EType: [this.page.EType],
            Page: this.page.Page,
            PageSize: this.page.PageSize,
            EGroup: [1],
            OrderBy: 'EndTime',
            IsAsc: false
        };
        this.homeSer.searchExamByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toastTest(res.Message);
                }
                this.examList = res.data.Items;
                this.page.TotalItems = res.data.TotalItems;
                this.page.load = true;
                this.dismissLoading()
            }
        )
    }

    changeType(e) {
        this.page.load = false;
        this.examList = [];
        this.page.Page = 1;
        this.page.StudyState = e.type;
        this.getList();
        this.showLoading();
    }

    goExam(item) {
        if (this.page.StudyState == 3) {
            this.navCtrl.push(LookTestPage, {item: item});
        } else {
            this.checkTesttime(item);
        }
    }

    //考试有效期校验
    checkTesttime(item) {
        const loading = this.loadCtrl.create();
        loading.present();
        const ExamBegin = this.commonSer.transFormTime(item.ExamBegin);
        const ExamEnd = this.commonSer.transFormTime(item.ExamEnd);
        this.homeSer.getSysDateTime().subscribe(
            (res) => {
                loading.dismiss();
                const sysDate = this.commonSer.transFormTime(res.data);
                if (sysDate < ExamBegin) {
                    this.commonSer.toastTest('考试未开始');
                } else if (sysDate > ExamEnd && this.page.StudyState == 1) {
                    this.commonSer.toastTest('当前时间不可考试');
                } else if (ExamBegin < sysDate && sysDate < ExamEnd) {
                    this.navCtrl.push(DoTestPage, {item: item});  //未开始
                } else if (this.page.StudyState == 2) {                    //未完成
                    this.navCtrl.push(DoTestPage, {item: item});
                }
            }
        )
    }

    //加载更多
    doInfinite(e) {
        if (this.page.TotalItems < this.examList.length || this.page.TotalItems == this.examList.length) {
            e.complete();
            return
        }
        this.page.Page++;
        const data = {
            StudyState: [this.page.StudyState],
            EGroup: [1],
            EType: [this.page.EType],
            Page: this.page.Page,
            PageSize: this.page.PageSize,
            OrderBy: 'EndTime',
            IsAsc: false
        };
        this.homeSer.searchExamByStu(data).subscribe(
            (res) => {
                if (res.Result == 1) {
                    this.commonSer.toastTest(res.Message);
                }
                this.examList = this.examList.concat(res.data.Items);
                this.page.TotalItems = res.data.TotalItems;
                e.complete();
            }
        );
    }

    // 微信分享
    wxShare(data) {
        let description = data.SubjectName;
        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        const obj = {
            "title": data.EName,
            "description": description,
            "thumb": data.PictureSrc,
            "paramsUrl": `/static/openApp.html?scheme_url=test&Fid=${data.Fid}`
        }
        let modal = this.modalCtrl.create(ShareWxComponent,
            {data: obj});
        modal.present();
    }

    //模拟考试
    goToSimulation() {
        this.navCtrl.push(SimulationTestPage);
    }

    doRefresh(e) {
        this.page.Page = 1;
        this.getList();
    }

    showLoading() {
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        this.refresher.complete();
    }

}
