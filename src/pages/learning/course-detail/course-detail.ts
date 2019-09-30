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
import {defaultHeadPhoto, defaultImg} from "../../../app/app.constants";


@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html',
})
export class CourseDetailPage {
    @ViewChild('banner') banner: ElementRef;
    @ViewChild('navbar') navbar: ElementRef;
    @ViewChild('video') video: ElementRef;
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
        {type: '3', name: '讨论', code: 'talk'},
        {type: '4', name: '讲师', code: 'teacher'},
        {type: '5', name: '评价', code: 'comment'},
        {type: '6', name: '相关', code: 'relation'},
    ];

    signObj = {
        isSign: false,
    };

    collectionObj = {
        isCollection: false
    };
    showFooter = false;

    comment = {
        course: [],
        teacher: [],
        talk: [],
    };

    files = [];

    loading;
    bar = {
        type: "1",
        show: false,
    };
    starList = new Array(5);
    defalutPhoto = defaultHeadPhoto;   //默认头像；

    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController, public appSer: AppService, public commonSer: CommonService,
                public zone: NgZone, public renderer: Renderer2, private emitService: EmitService,
                private learnSer: LearnService,
                private fileSer: FileService, private inAppBrowser: InAppBrowser, private modalCtrl: ModalController) {
        this.pId = this.navParams.get('id');
    }

    ionViewDidLoad() {
        this.scrollHeight();
    }

    async ionViewDidEnter() {
        this.showFooter = true;
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        await this.learSer.GetProductById(this.pId).subscribe(
            (res) => {
                this.product.detail = res.data;
                this.getProductInfo();
                this.getFileInfo();
                this.getCommentList();
            }
        );
    }

    //接受文件事件
    getFileInfo() {
        this.appSer.fileInfo.subscribe(value => {
            if (value) {
                this.product.videoPath = value.fileUrl;
            }
        });
    }


    ionViewWillLeave() {
        this.showFooter = false;
        this.appSer.setFile(null);
    }

    //固定navbar
    scrollHeight() {
        const height = this.banner.nativeElement.offsetHeight;
        this.content.ionScroll.subscribe(($event) => {
            this.zone.run(() => {
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
                this.product.chapter.Course.children.forEach(e => e.show = false);
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


    //课程评价
    getCommentList() {
        const data1 = {
            pageSize: 1,
            page: 1,
            TopicType: 'teacher',   //teacher  course
            topicID: this.product.detail.Teachers[0].UserID,
        }
        this.learnSer.GetComment(data1).subscribe(
            (res) => {
                if (res.data) {
                    this.comment.teacher = res.data.CommentItems;
                }
            }
        );

        const data2 = {
            pageSize: 1,
            page: 1,
            TopicType: 'course',   //teacher  course
            topicID: this.product.detail.PrId
        }
        this.learnSer.GetComment(data2).subscribe(
            (res) => {
                if (res.data) {
                    this.comment.course = res.data.CommentItems;
                }
            }
        );

        const data3 = {
            pageSize: 1,
            page: 1,
            TopicType: 'talk',   //teacher  course
            topicID: this.product.detail.PrId
        }
        this.learnSer.GetTalkList(data3).subscribe(
            (res) => {
                if (res.data) {
                    this.comment.talk = res.data.CommentItems;
                }
            }
        );
    }


    //过滤指定对象
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
        const loading = this.loadCtrl.create();
        loading.present();
        if (this.files.length == 0) {
            this.commonSer.toast('暂无学习文件');
        } else if (this.files[0].icon.includes('mp4')) {
            this.product.videoPath = this.files[0].fileUrl;
        } else if (this.files[0].icon.includes('pdf')) {
            this.openPDF(this.files[0]);
        } else {
            this.fileSer.downloadFile(this.files[0].fileUrl, this.files[0].filename);
        }
        loading.dismiss();
    }

    openPDF(file) {
        console.log(file);
        let modal = this.modalCtrl.create(ViewFilePage, {
            displayData: {
                pdfSource: {
                    url: file.fileUrl
                },
                title: file.DisplayName,
                Size: file.Size * 1024
            },

        });
        modal.present();
        event.stopPropagation();
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
            placeholder: '请输入你对讲师的评价...',
            TopicID: this.product.detail.Teachers[0].UserID,
            TopicType: 'teacher',
            PId:this.pId,
            title: '讲师评价'
        });
    }

    //课程评价
    goCourseComment() {
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请输入你对课程的评价...',
            TopicID: this.product.detail.PrId,
            TopicType: 'course',
            title: '课程评价'
        });
    }

    //课程讨论
    goCourseDiscuss() {
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请输入你要讨论的内容...',
            TopicID: this.product.detail.PrId,
            TopicType: 'talk',
            title: '课程讨论'
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

    //播放视频
    startPlay(video) {
        console.log(video);
        video.target.play();
        video.target.requestFullscreen();
    }

    getMore(e) {
        e.show = !e.show;
    }
}
