import {Component, ElementRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {Content, IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {TeacherPage} from "../teacher/teacher";
import {CourseCommentPage} from "../course-comment/course-comment";
import {timer} from "rxjs/observable/timer";
import {LearnService} from "../learn.service";
import {AppService} from "../../../app/app.service";
import {CommonService} from "../../../core/common.service";
import {FileService} from "../../../core/file.service";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {ViewFilePage} from "../view-file/view-file";
import {EmitService} from "../../../core/emit.service";


@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html',
})
export class CourseDetailPage {
    @ViewChild('banner') banner: ElementRef;
    @ViewChild('navbar') navbar: ElementRef;
    @ViewChild(Content) content: Content;

    pId;
    product = {
        detail: <any>null,
        chapter: null,
        videoPath: null
    };
    learnList = [];
    navbarList = [
        {type: '1', name: '简介', code: 'desc'},
        {type: '2', name: '章节', code: 'chapter'},
        {type: '3', name: '教师', code: 'teacher'},
        {type: '4', name: '评价', code: 'comment'},
        {type: '5', name: '相关', code: 'relation'},
    ];

    signObj = {
        isSign: false,
    };

    collectionObj = {
        isCollection: false
    };

    files = [];

    loading;
    bar = {
        type: "1",
        show: false,
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController, public appSer: AppService, public commonSer: CommonService,
                public zone: NgZone, public renderer: Renderer2, private emitService: EmitService,
                private fileSer: FileService, private inAppBrowser: InAppBrowser, private modalCtrl: ModalController) {
        this.pId = this.navParams.get('id');
    }

    async ionViewDidEnter() {
        this.scrollHeight();
        this.loading = this.loadCtrl.create({
            content: '课程正在打开...'
        });
        this.loading.present();
        await this.learSer.GetProductById(this.pId).subscribe(
            (res) => {
                this.product.detail = res.data;
                this.getProductInfo();
                this.getFileInfo();
            }
        );
    }

    getInfo(event) {
        console.log(event)
    }

    //接受文件事件
    getFileInfo() {
        this.appSer.fileInfo.subscribe(value => {
            if (value) {
                this.product.videoPath = value.fileUrl;
            }
        });
    }


    ionViewDidLeave() {
        console.log('leave');
        this.appSer.setFile(null);
    }


    openPDF(file) {
        let modal = this.modalCtrl.create(ViewFilePage, {
            displayData: {
                pdfSource: {
                    url: file.fileUrl
                },
                title: file.filename
            },

        });
        modal.present();
    }

    //固定navbar
    scrollHeight() {
        const height = this.banner.nativeElement.offsetHeight;
        this.content.ionScroll.subscribe(($event) => {
            this.zone.run(() => {
                console.log(this.content.scrollTop)
                if (this.content.scrollTop > height) {
                    this.bar.show = true;
                    this.renderer.addClass(this.navbar.nativeElement, 'tabs-fixed-scroll')
                } else {
                    this.bar.show = false;
                    this.renderer.removeClass(this.navbar.nativeElement, 'tabs-fixed-scroll')
                }
            })
        })
    }

    //课程详情、课程章节、相关课程、课程评价
    async getProductInfo() {
        const data = {
            pid: this.pId
        };
        await this.learSer.GetAdminChapterListByProductID(this.pId).subscribe(
            (res) => {
                this.product.chapter = res.data;
                this.f(this.product.chapter.Course.children);
            }
        );

        await this.learSer.GetRelationProductList(data).subscribe(
            (res) => {
                this.learnList = res.data.ProductList;
            }
        );

        const data1 = {
            topicID: this.product.detail.PrId
        };
        await this.learSer.GetCommentSum(data1).subscribe(
            (res) => {

            }
        );
        this.loading.dismiss();
    }

    f(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].files.length > 0) {
                this.files = this.files.concat(data[i].files);
            }
            if (data[i].children.length > 0) this.f(data[i].children);
        }
    }

    //立即学习
    studyNow() {
        console.log(this.files);
        if (this.files.length == 0) {
            this.commonSer.toast('暂无学习文件');
        } else if (this.files[0].icon.includes('mp4')) {
            this.product.videoPath = this.files[0].fileUrl;
        } else {
            if (this.files[0].fileUrl) {
                this.commonSer.toast('暂时只可预览pdf文件');
                // this.viewOfficeFile(this.files[0].fileUrl, this.files[0].filename);
            }
        }
    }

    teachDetail() {
        this.navCtrl.push(TeacherPage, {item: this.product.detail.Teachers[0]});
    }

    async focusHandle(UserID) {
        const data = {
            TopicID: UserID
        };
        await this.learSer.SaveSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('关注成功');
                this.ionViewDidEnter();
            }
        )
    }

    async cancleFocusHandle(UserID) {
        const data = {
            TopicID: UserID
        };
        this.learSer.CancelSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('取消关注成功');
                this.ionViewDidEnter();
            }
        )
    }

    //教师评价
    goTeacherComment() {
        console.log(this.product.detail.Teachers[0].UserID)
        this.navCtrl.push(CourseCommentPage, {
            TopicID: this.product.detail.Teachers[0].UserID,
            TopicType: 'teacher',
            title: '教师评价'
        });
    }

    //课程评价
    goCourseComment() {
        this.navCtrl.push(CourseCommentPage, {
            TopicID: this.product.detail.PrId,
            TopicType: 'course',
            title: '课程评价'
        });
    }

    //课程
    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    //报名
    sign() {
        const data = {
            pid: this.pId
        };
        this.learSer.BuyProduct(data).subscribe(
            (res) => {
                this.ionViewDidEnter();
                this.initStudy();
                this.signObj.isSign = true;
                timer(1000).subscribe(() => this.signObj.isSign = false);
            }
        )
    }

    //初始化作业
    initStudy() {
        console.log(this.product.detail.PrId)
        const data = {
            TopicID: this.product.detail.PrId,
        };
        this.learSer.examByStudy(data).subscribe(
            (res) => {

            }
        )
    }

    //收藏
    collection() {
        const data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.SaveCollectionByCSID(data).subscribe(
            (res) => {
                this.ionViewDidEnter();
                this.collectionObj.isCollection = true;
                timer(1000).subscribe(() => this.collectionObj.isCollection = false);
            }
        )
    }

    //取消收藏
    cancleCollection() {
        const data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.CancelCollectionByCSID(data).subscribe(
            (res) => {
                this.ionViewDidEnter();
            }
        )
    }

    changeType(item) {
        this.bar.type = item.type;
        // this.done.emit(item);
    }

    getNavbar(e) {
        console.log(e);
    }
}
