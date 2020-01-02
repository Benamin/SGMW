import {Component, ElementRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {Content, IonicPage, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
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
import {VideojsComponent} from "../../../components/videojs/videojs";


@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html',
})
export class CourseDetailPage {
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
        {type: 4, name: '讲师', code: 'teacher'},
        {type: 5, name: '评价', code: 'comment'},
        {type: 6, name: '相关', code: 'relation'},
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
    teacherList;  //讲师列表
    isLoad = false;

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
                this.getProductInfo();
                this.getFileInfo();
                this.getTeacher();
            }
        );
    }

    //接受文件事件
    getFileInfo() {
        this.appSer.fileInfo.subscribe(value => {
            if (value && value == 'videoPlayEnd') {
                this.updateVideoStatus();   //更新视频学习进度
            }
            if (value && value == 'updateProcess') {  //更新章节信息
                this.getChapter();
            }
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

    //课程详情、课程章节、相关课程、课程评价
    async getProductInfo() {
        this.getChapter();
        const data = {
            pid: this.pId
        };
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
    }

    //打开课件后更新章节进度
    getChapter() {
        this.learSer.GetProductById(this.pId).subscribe(
            (res) => {
                this.product.detail = res.data;
            }
        );
        this.learSer.GetAdminChapterListByProductID(this.pId).subscribe(
            (res) => {
                this.product.chapter = res.data;
                this.product.chapter.Course.children.forEach(e => e.show = true);
                this.f(this.product.chapter.Course.children);
                this.files.forEach(e => {
                    if (e.PlanStartTime) {
                        e.PlanStartTime_time = this.commonSer.transFormTime(e.PlanStartTime);
                    }
                });
                this.videoInfo.poster = this.product.chapter.Course.CoverUrl;
                this.loading.dismiss();
                this.isLoad = true;
            }
        );
    }

    //讲师评价下-讲师列表
    getTeacher() {
        const data = {
            id: this.pId
        }
        this.learnSer.GetTeacherListByPID(data).subscribe(
            (res) => {
                if (res.data) {
                    this.teacherList = res.data;
                    this.getCommentList();
                }
            }
        )
    }


    //课程评价
    getCommentList() {
        if (this.teacherList.length > 0) {
            const data1 = {
                pageSize: 5,
                page: 1,
                TopicType: 'teacher',   //teacher  course
                topicID: this.teacherList[0].UserID,
            }
            this.learnSer.GetComment(data1).subscribe(   //讲师评价
                (res) => {
                    if (res.data) {
                        this.comment.teacher = res.data.CommentItems;
                    }
                }
            );
        }

        const data2 = {
            pageSize: 5,
            page: 1,
            TopicType: 'course',   //teacher  course
            topicID: this.product.detail.PrId
        }
        this.learnSer.GetComment(data2).subscribe(  //课程评价
            (res) => {
                if (res.data) {
                    this.comment.course = res.data.CommentItems;
                }
            }
        );

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

    //更新学习进度  非视频
    saveProcess(file) {
        const data = {
            EAttachmentID: file.ID
        };
        this.learSer.SaveStudy(data).subscribe(
            (res) => {
                this.getChapter();  //查询最新章节信息
            }
        )
    }

    //更新视频学习状态
    updateVideoStatus() {
        const data = {
            cid: this.pId
        }
        this.learnSer.UpdateVideoStudySum(data).subscribe(
            (res) => {
                this.getChapter();  //查询最新章节信息
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

    //教师详情
    teachDetail(item) {
        this.navCtrl.push(TeacherPage, {item: item});
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
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请输入你对讲师的评价...',
            TopicID: this.product.detail.PrId,
            TopicType: 'teacher',
            PId: this.pId,
            title: '讲师评价'
        });
    }

    //课程评价
    goCourseComment() {
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请输入你的评价...',
            TopicID: this.product.detail.PrId,
            TopicType: 'course',
            title: this.product.detail.TeachTypeName == "直播" ? '直播评价' : '课程评价',
            text: this.product.detail.TeachTypeName == "直播" ? "直播" : "课程"
        });
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

    //课程
    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
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

    //收藏
    saveCollection() {
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        const data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.SaveCollectionByCSID(data).subscribe(
            (res) => {
                this.getCourseDetail();
                this.collectionObj.isCollection = true;
                timer(1000).subscribe(() => this.collectionObj.isCollection = false);
            }
        )
    }

    //取消收藏
    cancleCollection() {
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        const data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.CancelCollectionByCSID(data).subscribe(
            (res) => {
                this.getCourseDetail();
            }
        )
    }

    //点赞
    savePraise() {
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        const data = {
            TopicID: this.product.detail.PrId
        }
        this.learnSer.SavePraise(data).subscribe(
            (res) => {
                this.getCourseDetail();
            }
        )

    }

    //取消点赞
    cancelPraise() {
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        const data = {
            TopicID: this.product.detail.PrId
        }
        this.learnSer.CancelPraise(data).subscribe(
            (res) => {
                this.getCourseDetail();
            }
        )
    }

    //扔鸡蛋
    saveHate() {
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        const data = {
            TopicID: this.product.detail.PrId
        }
        this.learnSer.SaveHate(data).subscribe(
            (res) => {
                this.getCourseDetail();
            }
        )
    }

    //取消扔鸡蛋
    cancelHate() {
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        const data = {
            TopicID: this.product.detail.PrId
        }
        this.learnSer.CancelHate(data).subscribe(
            (res) => {
                this.getCourseDetail();
            }
        )
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

    //关闭弹窗
    close(e) {
        this.videoInfo.video = null;
        this.videoInfo.poster = null;
        this.iframObj = null;
        this.courseFileType = null;
    }

}
