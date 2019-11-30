import {Component, ElementRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {Content, IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {VideojsComponent} from "../../../components/videojs/videojs";
import {defaultHeadPhoto} from "../../../app/app.constants";
import {LearnService} from "../learn.service";
import {AppService} from "../../../app/app.service";
import {CommonService} from "../../../core/common.service";
import {EmitService} from "../../../core/emit.service";
import {FileService} from "../../../core/file.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ViewFilePage} from "../view-file/view-file";
import {TeacherPage} from "../teacher/teacher";
import {CourseCommentPage} from "../course-comment/course-comment";
import {timer} from "rxjs/observable/timer";
import {CourseFilePage} from "../course-file/course-file";

@Component({
    selector: 'page-inner-course',
    templateUrl: 'inner-course.html',
})
export class InnerCoursePage {

    @ViewChild('banner') banner: ElementRef;
    @ViewChild('navbar') navbar: ElementRef;
    @ViewChild('videojsCom') videojsCom: VideojsComponent;
    @ViewChild(Slides) slides: Slides;
    @ViewChild('video')
    public video: ElementRef;
    @ViewChild(Content) content: Content;

    pId;
    product = {
        detail: <any>null,
        chapter: null,
    };
    courseFileType;
    videoInfo = {
        poster: null,
        video: null,   //视频文件信息
    };  //视频播放的信息
    iframObj;
    learnList = [];
    navbarList = [
        {type: 1, name: '简介', code: 'desc'},
        {type: 2, name: '章节', code: 'chapter'},
        {type: 3, name: '讨论', code: 'talk'},
        {type: 4, name: '记录', code: 'task'},
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
        type: 1,
        show: false,
    };
    starList = new Array(5);
    defalutPhoto = defaultHeadPhoto;   //默认头像；
    isLoad = false;
    mainFile = [];   //已上传资料

    preImgSrc = null; //图片URL
    nowTime

    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController, public appSer: AppService, public commonSer: CommonService,
                public zone: NgZone, public renderer: Renderer2, private emitService: EmitService,
                private learnSer: LearnService,
                private fileSer: FileService, private inAppBrowser: InAppBrowser, private modalCtrl: ModalController) {
        this.pId = this.navParams.get('id');
    }

    ionViewDidLoad() {
        this.slides.autoHeight = true;
        this.slides.onlyExternal = true;
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
                this.product.detail.StartTime = this.commonSer.transFormTime(this.product.detail.StartTime);
                this.product.detail.ApplicantSTime = this.commonSer.transFormTime(this.product.detail.ApplicantSTime);
                this.product.detail.EndTime = this.commonSer.transFormTime(this.product.detail.EndTime);
                this.product.detail.ApplicantETime = this.commonSer.transFormTime(this.product.detail.ApplicantETime);
                this.nowTime = Date.now();  //当前时间
                this.getCommentList();
                this.getProductInfo();
                this.getFileInfo();
            }
        );
    }

    //接受文件事件
    getFileInfo() {
        this.appSer.fileInfo.subscribe(value => {
            if (value && value.icon == 'iframe') {
                this.courseFileType = 'iframe';
                this.iframObj = value;
            } else if (value && value.icon == 'mp4') {
                this.courseFileType = 'video';
                this.videoInfo.video = value;
                this.videoInfo.poster = value;
            }
        });
    }


    ionViewWillLeave() {
        this.courseFileType = null;
        this.showFooter = false;
        this.appSer.setFile(null);
        if (this.videojsCom) this.videojsCom.pageLeave();
        const arr = this.navCtrl.getViews().filter(e => e.name == 'CourseDetailPage');
        if (arr.length == 1 && this.videojsCom) this.videojsCom.destroy();
    }

    //课程详情、课程章节、相关课程、课程评价、已上传资料
    async getProductInfo() {
        const data = {
            pid: this.pId
        };
        await this.learSer.GetAdminChapterListByProductID(this.pId).subscribe(
            (res) => {
                this.product.chapter = res.data;
                this.product.chapter.Course.children.forEach(e => e.show = true);
                this.f(this.product.chapter.Course.children);
                this.files.forEach(e => {
                    if (e.PlanStartTime) {
                        e.PlanStartTime_time = this.commonSer.transFormTime(e.PlanStartTime);
                    }
                });
                console.log(this.files);
                this.videoInfo.poster = this.product.chapter.Course.CoverUrl;
                this.loading.dismiss();
                this.isLoad = true;
            }
        );

        const data1 = {
            topicID: this.product.detail.PrId
        };
        await this.learSer.GetCommentSum(data1).subscribe(
            (res) => {

            }
        );

        const data2 = {
            pid: this.pId
        };
        await this.learSer.GetSelfFile(data2).subscribe(
            (res) => {
                this.mainFile = res.data;
            }
        )
    }

    //课程评价
    getCommentList() {
        const data3 = {
            pageSize: 5,
            page: 1,
            TopicType: 'talk',   //teacher  course
            topicID: this.product.detail.PrId
        }
        this.learnSer.GetTalkList(data3).subscribe(   //课程讨论
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
        if (this.files.length == 0) {
            this.commonSer.toast('暂无学习文件');
            return;
        }

        console.log(this.files[0]);
        const nowTime = new Date().getTime();
        const planStartTime = this.commonSer.transFormTime(this.files[0].PlanStartTime);

        let text = this.product.detail.TeachTypeName == "直播" ? "直播" : "课程"
        if (nowTime < planStartTime) {
            this.commonSer.toast(`${text}还未开始，请等待开始后再观看`);
            return
        }

        const loading = this.loadCtrl.create();
        loading.present();
        this.saveProcess(this.files[0]);
        if (this.files[0].icon.includes('mp4')) {
            this.courseFileType = 'video';
            this.videoInfo.video = this.files[0];
        } else if (this.files[0].icon.includes('pdf')) {
            this.openPDF(this.files[0]);
        } else if (this.files[0].icon.includes('iframe')) {
            this.courseFileType = 'iframe';
            this.iframObj = this.files[0];
        } else {
            this.fileSer.viewFile(this.files[0].fileUrl, this.files[0].filename);
        }

        loading.dismiss();
    }

    //更新学习进度
    saveProcess(file) {
        const data = {
            EAttachmentID: file.ID
        };
        this.learSer.SaveStudy(data).subscribe(
            (res) => {
                console.log(res.message);
            }
        )
    }

    //打开pdf文件
    openPDF(file) {
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

    //课程讨论
    goCourseDiscuss() {
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请输入你要讨论的内容...',
            TopicID: this.product.detail.PrId,
            TopicType: 'talk',
            title: this.product.detail.TeachTypeName == "直播" ? '直播讨论' : '课程讨论',
            text: this.product.detail.TeachTypeName == "直播" ? "直播" : "课程"
        });
    }

    //报名
    sign() {
        let text = this.product.detail.TeachTypeName == "直播" ? "直播" : "课程";
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
        const data = {
            CSID: this.product.detail.PrId,
        };
        this.learSer.initStuHomework(data).subscribe(
            (res) => {

            }
        )
    }

    //课程详情
    getCourseDetail() {
        this.learSer.GetProductById(this.pId).subscribe(
            (res) => {
                this.loading.dismiss();
                this.product.detail = res.data;
            }
        );
    }

    changeType(item) {
        this.bar.type = item.type;
        this.slides.slideTo(item.type - 1, 100);
    }


    //获取时间戳
    getTime(date) {
        return new Date(date).getTime();
    }

    //切换slide
    slideChanged() {
        this.bar.type = this.slides.realIndex + 1;
    }

    //前往资料记录
    goMainFile() {
        this.navCtrl.push(CourseFilePage, {title: "已上传资料", mainFile: this.mainFile})
    }

    viewimage(e) {
        console.log(e);
        this.preImgSrc = e;
    }

}