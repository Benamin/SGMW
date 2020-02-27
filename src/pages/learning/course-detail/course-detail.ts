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
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";
import {MineService} from "../../mine/mine.service";
import {GlobalData} from "../../../core/GlobleData";


@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html',
})
export class CourseDetailPage {
    @ViewChild('banner') banner: ElementRef;
    @ViewChild('navbar') navbar: ElementRef;
    @ViewChild('ionSlidesDIV') ionSlidesDIV: ElementRef;
    @ViewChild('videojsCom') videojsCom: VideojsComponent;
    @ViewChild(Slides) slides: Slides;
    @ViewChild('video')
    public video: ElementRef;
    @ViewChild(Content) content: Content;

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

    relationList = [];
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

    SortType;  //课程有序还是无序 1 有序 2 无序

    nodeLevel4;   //视频播放当前课时节点
    tagsNodeList;   //包含作业的节点列表
    nodeLevel4List;   //所有的课时节点列表
    enterSource;   //进入来源


    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController, public appSer: AppService, public commonSer: CommonService,
                public zone: NgZone, public renderer: Renderer2, private emitService: EmitService,
                private learnSer: LearnService,
                private mineSer: MineService,
                private global: GlobalData,
                private fileSer: FileService, private inAppBrowser: InAppBrowser, private modalCtrl: ModalController) {
        this.global.pId = this.navParams.get('id');
    }

    ionViewDidLoad() {
        this.slides.autoHeight = true;
        this.slides.onlyExternal = true;
        this.courseFileType = null;
        const screenWidth = <any>window.screen.width;
        this.ionSlidesDIV.nativeElement.style.width = screenWidth + 'px';
    }

    ionViewWillEnter() {
        this.enterSource = this.navParams.get('courseEnterSource');
        this.showFooter = true;
        this.loading = this.loadCtrl.create({
            content: '',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        this.loading.present();
        console.log('ionViewWillEnter');
        this.learSer.GetProductById(this.global.pId).subscribe(
            (res) => {
                this.product.detail = res.data;
                this.global.PostsCertID = res.data.PostCertificationID;
                this.SortType = res.data.SortType;
                this.getChapter();  //章节信息
                this.getRelationProduct();  //
                if (this.enterSource != 'examBack') {
                    this.getTeacher();
                }
                //接受文件通知
                this.getFileInfo();
            }
        );
    }

    //离开页面
    ionViewDidLeave() {
        console.log('leave');
        this.courseFileType = null;
        this.showFooter = false;
        this.appSer.setFile(null)
        if (this.videojsCom) this.videojsCom.pageLeave();
        const courseArr = this.navCtrl.getViews().filter(e => e.name == 'CourseDetailPage');
        const doExamArr = this.navCtrl.getViews().filter(e => e.name == 'DoExamPage');
        const lookExamArr = this.navCtrl.getViews().filter(e => e.name == 'LookExamPage');
        if (courseArr.length == 1 && this.videojsCom && doExamArr.length == 0 && lookExamArr.length == 0) {
            this.videojsCom.destroy();
        }
    }

    //接受文件打开事件通知
    getFileInfo() {
        this.appSer.fileInfo.subscribe(value => {
            if (!value) {
                return
            }
            console.error('接受文件打开事件')
            console.error(value);
            if (value.type == 'videoPlayEnd') {
                if (!this.global.subscribeDone) {
                    this.global.subscribeDone = true;
                    this.getChapter('video');   //视频播放完，更新视频学习进度 并前往判断是否应该打开作业
                }
            }
            if (value.type == 'updateDocumentProcess') {  //文档课件打开后，更新章节信息
                if (!this.global.subscribeDone) {
                    this.global.subscribeDone = true;
                    this.getChapter('document');
                }
            }
            if (value.type == 'iframe') {  //iframe
                this.courseFileType = 'iframe';
                this.iframObj = value.iframe;
            }
            if (value.type == 'mp4') {  //video
                this.courseFileType = 'video';
                this.videoInfo.video = value.video;
                this.videoInfo.poster = value.video;
                this.nodeLevel4 = value.nodeLevel;  //视频播放的节点信息
                if (!this.global.subscribeDone) {
                    console.log(`getFileInfo,pid:${this.global.pId}`);
                    console.info('当前视频播放节点');
                    this.global.subscribeDone = true;
                    console.info(this.nodeLevel4);
                    console.log(`courseFileType:${this.courseFileType}`);
                    this.saveProcess(value.video);
                }
            }
        });
    }

    //相关课程
    getRelationProduct() {
        const data = {
            pid: this.global.pId
        };
        this.learSer.GetRelationProductList(data).subscribe(
            (res) => {
                this.relationList = res.data.ProductList;
            }
        );
    }

    /**
     * 打开课件后更新章节进度
     * @param type = video 视频播放完成后查询作业是否解锁，若解锁直接打开作业
     * document = 文档打开后查询进度
     */
    getChapter(type?: any) {
        if (type === 'video') {
            this.getCourseDetail();
        }

        console.log('打开课件后更新章节进度');
        this.learSer.GetAdminChapterListByProductID(this.global.pId).subscribe(
            (res) => {
                this.product.chapter = res.data;
                this.product.chapter.Course.children.forEach(e => e.show = true);
                this.files = [];  //重置课件数组
                this.tagsNodeList = [];  //重置作业节点数组
                this.nodeLevel4List = [];  //重置课时节点数组
                this.f(this.product.chapter.Course.children);
                this.fNode(this.product.chapter.Course.children);
                if (type == 'video') {   //只有视频播放结束之后才校验是否打开作业
                    this.fTags(this.product.chapter.Course.children);  //取出包含作业的节点
                    this.checkTag();   //校验作业
                }
                if (this.enterSource == 'examBack') {  //做完作业返回
                    if (this.product.detail.overpercentage == 100) {
                        this.commonSer.toast('恭喜您完成课程学习!');
                    } else {
                        this.studyContinue();
                    }
                }
                this.files.forEach(e => {
                    if (e.PlanStartTime) {
                        e.PlanStartTime_time = this.commonSer.transFormTime(e.PlanStartTime);
                    }
                });
                console.log(`包含作业的节点列表：`);
                console.log(this.tagsNodeList);
                console.log(`所有的课时节点列表：`);
                console.log(this.nodeLevel4List);
                this.videoInfo.poster = this.product.chapter.Course.CoverUrl;
                this.loading.dismiss();
                this.isLoad = true;
            }
        );
    }

    /**
     * 校验作业并跳转
     */
    checkTag() {
        this.tagsNodeList.forEach(e => {
            if (e.ID == this.nodeLevel4.ID) { //查到了ID
                for (let t = 0; t < e.tags.length; t++) {
                    if (e.tags[t].StudyStatus == 2) {  //作业已解锁 并且未完成
                        this.handleVideoExam(e.tags[t]);
                        break
                    }
                }
            }
        })
    }

    //查询作业信息
    handleVideoExam(exam) {
        let load = this.loadCtrl.create({
            content: '正在前往作业，请等待...'
        });
        load.present();
        const data = {
            Eid: exam.id
        };
        this.mineSer.getExam(data).subscribe(
            (res) => {
                if (res.data) {
                    exam.Fid = res.data.ID;
                    if (exam.examStatus == 8) {
                        this.navCtrl.push(LookExamPage, {item: exam});
                    } else {
                        this.navCtrl.push(DoExamPage, {item: exam, source: 'course'});
                    }
                    load.dismiss();
                }
            }
        )
    }

    /**
     *所有的课时节点
     */
    fNode(data) {
        for (let j = 0; j < data.length; j++) {
            if (data[j].NodeLevel == 4) {
                this.nodeLevel4List.push(data[j]);
            }
            if (data[j].children.length > 0) this.fNode(data[j].children);
        }
    }

    /**
     * 将章节树上包含作业的节点转化为列表
     * @param data
     */
    fTags(data) {
        for (let j = 0; j < data.length; j++) {
            if (data[j].tags.length > 0) {
                this.tagsNodeList.push(data[j]);
            }
            if (data[j].children.length > 0) this.fTags(data[j].children);
        }
    }

    /**
     * 过滤指定课件对象
     * @param data
     * data[i].files 是数组
     */
    f(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].files.length > 0) {
                this.files = this.files.concat(data[i].files);
            }
            if (data[i].children.length > 0) this.f(data[i].children);
        }
    }

    //立即学习 打开第一个课件
    studyNow() {
        console.log('studyNow')
        if (this.files.length == 0) {
            this.commonSer.toast('暂无学习文件');
            return;
        }
        const nowTime = new Date().getTime();
        const planStartTime = this.commonSer.transFormTime(this.files[0].PlanStartTime);

        let text = this.product.detail.TeachTypeName == "直播" ? "直播" : "课程"
        if (nowTime < planStartTime) {
            this.commonSer.toast(`${text}还未开始，请等待开始后再观看`);
            return
        }

        this.openFileByType(this.nodeLevel4List[0], this.files[0]);
    }

    /**
     * 继续学习 针对有序课程跳到最后一个解锁的课时的课件
     * StudyStatus 1未解锁 2 已解锁
     * SortType 1有序 2 无序
     */
    studyContinue() {
        console.log('studyContinue');
        this.enterSource = '';
        let arr = [];
        if (this.SortType == 1) {
            arr = this.nodeLevel4List.filter(e => e.StudyStatus == 2);
            if (arr.length && arr[arr.length - 1].files.length > 0) {
                this.openFileByType(arr[arr.length - 1], arr[arr.length - 1].files[0])
            }
        } else {
            this.studyNow();
        }
    }

    /**
     *根据课件类型打开课件
     * @param node 课时节点信息
     * @param file 课件信息
     */
    openFileByType(node, file) {
        console.log(file);
        const loading = this.loadCtrl.create();
        loading.present();
        this.saveProcess(file);   //创建学习记录
        this.global.subscribeDone = false;
        if (file.icon.includes('mp4')) {
            const mp4 = {
                type: 'mp4',
                video: file,   //文件
                source: 'courseDetail',
                nodeLevel: node   //课时节点
            };
            this.appSer.setFile(mp4);  //通知主页面播放视频
        }
        if (file.icon.includes('pdf')) {
            this.openPDF(file);
        }
        if (file.icon.includes('iframe')) {
            const iframe = {
                type: 'iframe',
                iframe: file
            };
            this.appSer.setFile(iframe);
        }
        if (!file.icon.includes('pdf') && !file.icon.includes('mp4')) {
            this.fileSer.viewFile(file.fileUrl, file.filename);
        }

        loading.dismiss();
    }

    //更新学习进度  非视频
    saveProcess(file) {
        const data = {
            EAttachmentID: file.ID,
            postsCertID: this.global.PostsCertID
        };
        this.learSer.SaveStudy(data).subscribe(
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

    //课程
    goCourse(e) {
        this.navCtrl.push(CourseDetailPage, {id: e.Id});
    }

    //报名
    sign() {
        const data = {
            pid: this.global.pId
        };
        this.learSer.BuyProduct(data).subscribe(
            (res) => {
                this.getCourseDetail();
                this.initStudy();
                this.studyNow();
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
                if (!res.data) {
                    this.commonSer.toast('作业初始化失败')
                }
            }
        )
    }

    //课程详情
    getCourseDetail() {
        console.log('课程详情');
        this.learSer.GetProductById(this.global.pId).subscribe(
            (res) => {
                this.loading.dismiss();
                this.product.detail = res.data;
                this.global.PostsCertID = res.data.PostCertificationID;
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
        if (this.product.detail.IsHate) {
            this.commonSer.toast('您已经扔鸡蛋了哦～');
            return
        }
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
        if (this.product.detail.IsPraise) {
            this.commonSer.toast('您已经点赞了哦～');
            return
        }
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

    //关注讲师
    focusHandle(UserID) {
        const data = {
            TopicID: UserID
        };
        this.learSer.SaveSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('关注成功');
                this.getCourseDetail();
            }
        )
    }


    //讲师评价下-讲师列表
    getTeacher() {
        const data = {
            id: this.global.pId
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
        };
        this.learnSer.GetTalkList(data3).subscribe(   //课程讨论
            (res) => {
                if (res.data) {
                    this.comment.talk = res.data.CommentItems;
                }
            }
        );
    }

    //取消关注
    cancleFocusHandle(UserID) {
        const data = {
            TopicID: UserID
        };
        this.learSer.CancelSubscribe(data).subscribe(
            (res) => {
                this.commonSer.toast('取消关注成功');
                this.getCourseDetail();
            }
        )
    }

    //教师评价
    goTeacherComment() {
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请理性发言，文明用语...',
            TopicID: this.product.detail.PrId,
            TopicType: 'teacher',
            PId: this.global.pId,
            title: '讲师评价'
        });
    }

    //课程评价
    goCourseComment() {
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请理性发言，文明用语...',
            TopicID: this.product.detail.PrId,
            TopicType: 'course',
            title: this.product.detail.TeachTypeName == "直播" ? '直播评价' : '课程评价',
            text: this.product.detail.TeachTypeName == "直播" ? "直播" : "课程"
        });
    }

    //课程讨论
    goCourseDiscuss() {
        this.navCtrl.push(CourseCommentPage, {
            placeholder: '请理性发言，文明用语...',
            TopicID: this.product.detail.PrId,
            TopicType: 'talk',
            title: this.product.detail.TeachTypeName == "直播" ? '直播讨论' : '课程讨论',
            text: this.product.detail.TeachTypeName == "直播" ? "直播" : "课程"
        });
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
