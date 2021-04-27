import {ChangeDetectorRef, Component, ElementRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {
    AlertController,
    Content,
    LoadingController,
    ModalController, Navbar,
    NavController,
    NavParams,
    Platform,
    Slides
} from 'ionic-angular';
import {TeacherPage} from "../teacher/teacher";
import {LearnService} from "../learn.service";
import {AppService} from "../../../app/app.service";
import {CommonService} from "../../../core/common.service";
import {FileService} from "../../../core/file.service";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {ViewFilePage} from "../view-file/view-file";
import {EmitService} from "../../../core/emit.service";
import {defaultHeadPhoto} from "../../../app/app.constants";
import {VideojsComponent} from "../../../components/videojs/videojs";
import {LookExamPage} from "../../mine/look-exam/look-exam";
import {DoExamPage} from "../../mine/do-exam/do-exam";
import {MineService} from "../../mine/mine.service";
import {GlobalData} from "../../../core/GlobleData";
import {CommentComponent} from "../../../components/comment/comment";
import {CommentByCourseComponent} from "../../../components/comment-by-course/comment-by-course";
import {LookTalkVideoExamPage} from "../look-talk-video-exam/look-talk-video-exam";
import {ExamTipPage} from "../exam-tip/exam-tip";
import {ErrorExamPage} from "../../mine/error-exam/error-exam";
import {Storage} from "@ionic/storage";
import {HomeService} from "../../home/home.service";
import {CommentStarComponent} from '../../../components/comment-star/comment-star';

declare let Swiper: any;

@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html',
})
export class CourseDetailPage {
    @ViewChild('banner') banner: ElementRef;
    @ViewChild('TalkContent') TalkContent: ElementRef;
    @ViewChild('ClassmateContent') ClassmateContent: ElementRef;
    @ViewChild('CourseIntroduction') CourseIntroduction: ElementRef;
    @ViewChild('ionSlidesDIV') ionSlidesDIV: ElementRef;
    @ViewChild('videojsCom') videojsCom: VideojsComponent;
    @ViewChild('commentStar') commentStar: CommentStarComponent;
    @ViewChild(Slides) slides: Slides;
    @ViewChild('video')
    public video: ElementRef;
    @ViewChild(Content) content: Content;
    @ViewChild(Navbar) navbar: Navbar;

    product = {
        detail: <any>null,
        chapter: null,
    };

    courseFileType;
    videoInfo = {
        poster: "",
        video: "",   //视频文件信息
    };  //视频播放的信息
    iframObj = {
        fileUrl: ""
    };

    relationList = [];
    NavbarList = [
        {type: 1, name: '章节', code: 'chapter'},
        {type: 2, name: '讨论', code: 'talk'},
        {type: 3, name: '相关', code: 'relation'},
    ];

    showFooter = false;

    comment = {
        course: [],
        teacher: [],
        talk: [],
        talkLoad: false,
    };

    files = [];

    loading;
    bar = {
        code: '',
        type: 1,
        show: false,
    };
    starList = new Array(5);
    defalutPhoto = defaultHeadPhoto;   //默认头像；
    teacherList;  //讲师列表
    isLoad = false;

    SortType;  //课程有序还是无序 1 有序 2 无序
    StructureType; //章节结构状态  1 老结构即4层 2 新结构即两层

    nodeLevel4;   //视频播放当前课时节点
    tagsNodeList;   //包含作业的节点列表
    nodeLevel4List;   //所有的课时节点列表 --第四层  旧结构
    CourseEnterSource;   //进入来源

    showMore = false;  //简介折叠
    marginTop;

    isError = false;   //回顾错题弹窗

    talkObj = {  //讨论 分页
        Page: 0,
        TotalCount: 0
    }

    disableBtn = {
        signBtnDisable: false
    }

    mySwiper;

    enterResource = "";  //岗位认证课程进入
    classmate = {
        PageIndex: 1,
        PageSize: 10,
        obj: {
            List: [],
            AnswerUserTotal: 0,
            ThenUserTotal: 0,
            isLoad: false
        }
    };  //我的同学列表
    TaskId;  //学习任务ID；
    showHeader = "show";  //是否现实header


    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController, public appSer: AppService, public commonSer: CommonService,
                public zone: NgZone, public renderer: Renderer2, private emitService: EmitService,
                private learnSer: LearnService, public alertCtrl: AlertController,
                private mineSer: MineService, private storage: Storage,
                private homeSer: HomeService, public platform: Platform, private changeDetectorRef: ChangeDetectorRef,
                private global: GlobalData, private fileSer: FileService, private inAppBrowser: InAppBrowser,
                private modalCtrl: ModalController) {
        this.global.pId = this.navParams.get('id');
        this.TaskId = this.navParams.get('TaskId');
        this.StructureType = this.navParams.get('StructureType') || 1;
        this.enterResource = this.navParams.get('enterResource') || "";

        if (this.enterResource == "studyTask") {  //学习任务进入
            this.NavbarList.push({type: 4, name: '我的同学', code: 'classmate'},);
        }


    }

    //仅进入初始化加载一次
    ionViewDidLoad() {
        this.storage.remove('CourseId');
        this.listenerScroll();
        this.isError = false;
        const screenWidth = <any>window.screen.width;
        this.ionSlidesDIV.nativeElement.style.width = screenWidth + 'px';
        this.getRelationProduct();  //
        this.showFooter = true;
        this.showLoading();

        this.navbar.backButtonClick = () => {
            this.global.CourseEnterSource = "";
            this.navCtrl.pop();
        };

        this.storage.get("courseData").then((value: any) => {
            console.log(value);
            console.log(this.global.pId);
            if (value && value.length > 0) {
                const index = value.findIndex(e => e.Id === this.global.pId);
                console.log(index);
                if (index > -1) {
                    const data = value[index];
                    if ((Date.now() - data.time) < (1 * 24 * 60 * 60 * 1000)) {  //超过一天 重新加载
                        this.initOtherInfo(data.detail);
                        this.initChapterInfo(data.chapter);
                    } else {
                        this.initData();
                    }
                } else { //没有 重新查询
                    this.initData();
                }
            } else {  //没有 重新查询
                this.initData();
            }
        })
    }

    //每次进入均加载
    ionViewDidEnter() {
        this.CourseEnterSource = this.global.CourseEnterSource;
        console.log(this.CourseEnterSource);
        switch (this.CourseEnterSource) {
            case 'PDF':   //打开PDF文件返回
                break;
            case 'CourseTalk':   // 课程讨论详情返回
                this.getTalkList();   //获取课程讨论
                break;
            case 'CourseComment':   //课程评价详情返回
                this.commentStar.getCommentList(this.product.detail.PrId);  //获取课程评价
                break;
            case 'RelationCourse':          // 相关课程返回
                break;
            case 'DoExam':        //做普通选项类作业返回
                this.getCourseDetail();  //查询课程详情
                this.getChapter();   //获取章节列表
                break;
            case 'TalkExam':      //讨论作业返回
                this.getTalkList();   //获取课程讨论
                break;
            case 'VideoExam':      //视频作业返回
                this.getTalkList();   //获取课程讨论
                break;
            case 'LookExam':      //查看作业返回
                break;
            case 'LookErrorExam':      //回顾作业返回
                break;
        }
    }

    //离开页面
    ionViewDidLeave() {
        this.courseFileType = null;
        this.showFooter = false;
        this.isError = false;
        this.appSer.setFile(null);
        if (this.videojsCom) this.videojsCom.pageLeave();
        const courseArr = this.navCtrl.getViews().filter(e => e.name == 'CourseDetailPage');
        const doExamArr = this.navCtrl.getViews().filter(e => e.name == 'DoExamPage');
        const lookExamArr = this.navCtrl.getViews().filter(e => e.name == 'LookExamPage');
        if (courseArr.length == 1 && this.videojsCom && doExamArr.length == 0 && lookExamArr.length == 0) {
            this.videojsCom.destroy();
        }
    }

    //初始化查询课程信息
    initData() {
        console.log("重新请求数据");
        this.learSer.GetProductById(this.global.pId).subscribe(
            (res) => {
                if (res.data) {
                    this.initOtherInfo(res.data);
                    this.getChapter();
                } else {
                    this.dismissLoading();
                    this.commonSer.alert(res.message);
                }
            }
        );
    }

    //初始化其他信息
    initOtherInfo(data) {
        this.product.detail = data;

        //进度更新
        const overpercentage = data.overpercentage;
        document.getElementById('textProcess').innerHTML = `学习进度:${overpercentage}%`;
        document.getElementById('innerProcess').style.width = `${overpercentage}%`;

        this.global.PostsCertID = data.PostCertificationID;
        this.SortType = data.SortType;

        this.GetCommentData();   //讲师信息
        this.GetClassmate();  //我的同学
        //接受文件通知
        this.getFileInfo();
        setTimeout(() => {
            this.marginTop = this.CourseIntroduction.nativeElement.clientHeight;
        });
        this.initSwiper();
    }

    /**
     * 打开课件后更新章节进度
     * @param type = video 视频播放完成后查询作业是否解锁，若解锁直接打开作业
     * document = 文档打开后查询进度
     */
    getChapter(type?: any) {
        this.learSer.GetAdminChapterListByProductID(this.global.pId).subscribe(
            (res) => {
                //本地存储课程的信息--课程速度加速
                this.saveCourseInfo(this.product.detail, res.data);
                this.initChapterInfo(res.data, type);
            }
        );
    }

    /**
     * 初始化章节信息
     * @param data 章节数据
     * @param type 文件类型
     */
    initChapterInfo(data, type?: any) {
        this.product.chapter = data;
        this.product.chapter.Course.children.forEach(e => e.show = true);
        this.files = [];  //重置课件数组
        this.tagsNodeList = [];  //重置作业节点数组
        this.nodeLevel4List = [];  //重置课时节点数组
        this.f(this.product.chapter.Course.children);
        this.fNode(this.product.chapter.Course.children);
        if (type && type == 'video') {   //只有视频播放结束之后才校验是否打开作业
            this.fTags(this.product.chapter.Course.children);  //取出包含作业的节点
            this.checkTag();   //校验作业
        }
        this.files.forEach(e => {
            if (e.PlanStartTime) {
                e.PlanStartTime_time = this.commonSer.transFormTime(e.PlanStartTime);
            }
        });
        this.videoInfo.poster = this.product.chapter.Course.CoverUrl;
        this.dismissLoading();
        this.isLoad = true;
    }

    /**
     * 存储课程信息
     * @param detail=课程信息 chapter=章节信息  this.global.pId=当前课程ID
     */
    saveCourseInfo(detail, chapter) {
        const info = {
            "Id": detail.Id,
            "detail": detail,
            "chapter": chapter,
            "time": Date.now()
        }
        this.storage.get("courseData").then((value: any) => {
            if (value && value.length > 0) {
                const index = value.findIndex(e => e.Id === this.global.pId);
                if (index > -1) {  //已存在当前课程
                    value[index] = info;
                } else if (index === -1 && value.length < 5) {  //不存在课程 且当前课程存储长度有空余
                    value.push(info);
                } else {  //不存在课程 且当前课程存储长度无空余
                    value.splice(4, 1);
                    value.unshift(info);
                }
                this.storage.set('courseData', value);
            } else {
                const arr = [];
                arr.push(info);
                console.log('courseData', arr);
                this.storage.set('courseData', arr);
            }
        })
    }

    //初始化swiper
    initSwiper() {
        let that = this;
        that.mySwiper = new Swiper('.swiper-course-container', {
            speed: 300,// slide滑动动画时间
            observer: true,
            noSwiping: true,
            observeParents: true,
            on: {
                touchEnd: function (event) {
                    //你的事件
                    if (that.isLoad) {
                        that.bar.type = this.activeIndex + 1;
                    }
                },
                slidePrevTransitionStart: function () {  //上滑

                },
                slideNextTransitionStart: function () {  //下滑

                },

            },
        });
    }

    //接受文件打开事件通知
    getFileInfo() {
        this.appSer.fileInfo.subscribe(value => {
            if (!value) {
                return
            }
            if (value.type == 'videoPlayEnd') {
                if (!this.global.subscribeDone) {
                    this.global.subscribeDone = true;
                    setTimeout(() => {
                        this.getCourseDetail('video');   //视频播放完，更新视频学习进度 并前往判断是否应该打开作业
                    }, 500)
                }
            }
            if (value.type == 'updateDocumentProcess') {  //文档课件打开后，更新章节信息
                if (!this.global.subscribeDone) {
                    this.global.subscribeDone = true;
                    setTimeout(() => {
                        this.getCourseDetail('Document');
                    }, 500)
                }
            }
            if (value.type == 'iframe') {  //iframe
                this.courseFileType = 'iframe';
                this.iframObj = value.iframe;
            }
            if (value.type == 'ExamTip') {  //提示错题弹窗
                this.zone.run(() => {
                    this.isError = true;
                })
            }
            if (value.type == 'mp4') {  //video
                this.courseFileType = 'video';
                this.videoInfo.video = value.video;
                this.videoInfo.poster = value.video;
                if (!this.global.subscribeDone) {
                    this.nodeLevel4 = value.nodeLevel;  //视频播放的节点信息
                    this.saveProcess(value.video);
                    this.global.subscribeDone = true;
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

    //我的同学
    GetClassmate() {
        const data = {
            "PageIndex": this.classmate.PageIndex,
            "PageSize": this.classmate.PageSize,
            "PRID": this.product.detail.PrId,
            'TaskId': this.TaskId
        }
        this.homeSer.StudyPlanList(data).subscribe(
            res => {
                if (res.data) {
                    this.classmate.obj.List = res.data.UserDetails;
                    this.classmate.obj.AnswerUserTotal = res.data.AnswerUserTotal;
                    this.classmate.obj.ThenUserTotal = res.data.ThenUserTotal;
                }
            }
        )
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
                    if (exam.examStatus == 8) {  //作业完成
                        if (exam.JopType == 0) {   //选项作业
                            this.navCtrl.push(LookExamPage, {item: exam, source: 'course'})
                        } else {    //视频作业、讨论作业
                            this.navCtrl.push(LookTalkVideoExamPage, {item: exam, source: 'course'});
                        }
                    } else {  //作业未完成
                        if (exam.JopType == 0) {
                            this.navCtrl.push(DoExamPage, {item: exam, source: 'course'})
                        } else {  //视频作业、讨论作业
                            this.navCtrl.push(ExamTipPage, {item: exam});
                        }
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
            if (data[j].NodeLevel == 4 && this.StructureType == 1) {  //老结构
                this.nodeLevel4List.push(data[j]);
            }
            if (data[j].NodeLevel == 2 && this.StructureType == 2) {   //新结构
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
        this.CourseEnterSource = '';
        let arr = [];
        if (this.SortType == 1) {
            arr = this.nodeLevel4List.filter(e => e.StudyStatus == 2);
            if (arr.length && arr[arr.length - 1].files.length > 0) {
                this.openFileByType(arr[arr.length - 1], arr[arr.length - 1].files[0])
            } else {
                this.commonSer.toast('课件已学习完毕')
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
        this.global.subscribeDone = false;
        this.saveProcess(file);   //创建学习记录
        if (file.icon.includes('mp4')) {
            const mp4 = {
                type: 'mp4',
                video: file,   //文件
                source: 'courseDetail',
                nodeLevel: node   //课时节点
            };
            this.appSer.setFile(mp4);  //通知主页面播放视频
        }
        if (file.icon.includes('pdf') && this.platform.is('android')) {   //pdf文件
            this.openPDF(file);
        }
        if (file.icon.includes('iframe')) {  //iframe
            const iframe = {
                type: 'iframe',
                iframe: file
            };
            this.appSer.setFile(iframe);
            return;
        }
        if (!file.icon.includes('mp4') && !file.icon.includes('iframe')) {  //预览文件
            this.fileSer.ViewFile(file.fileUrl, file.filename);
        }
    }

    //更新学习进度  非视频
    saveProcess(file) {
        const data = {
            EAttachmentID: file.ID,
            postsCertID: this.global.PostsCertID
        };
        this.learSer.SaveStudy(data).subscribe(
            (res) => {
                this.getChapter('document');  //查询最新章节信息
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
        this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
    }

    //报名
    sign() {
        if (this.disableBtn.signBtnDisable) return;

        this.disableBtn.signBtnDisable = true;

        const data = {
            pid: this.global.pId
        };
        this.learSer.BuyProduct(data).subscribe(
            (res) => {
                this.disableBtn.signBtnDisable = false;
                setTimeout(() => {
                    this.getCourseDetail();
                }, 100)
                this.initStudy();
                this.studyNow();
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
    getCourseDetail(type?: any) {
        this.showLoading();
        this.learSer.GetProductById(this.global.pId).subscribe(
            (res) => {
                this.dismissLoading();
                if (!res.data) {
                    this.commonSer.alert(res.message);
                }
                this.global.PostsCertID = res.data.PostCertificationID;

                //页面不更新进度 强制更新
                this.product.detail = res.data;
                const overpercentage = res.data.overpercentage;
                document.getElementById('textProcess').innerHTML = `学习进度:${overpercentage}%`;
                document.getElementById('innerProcess').style.width = `${overpercentage}%`;

                if (this.CourseEnterSource === "DoExam" && overpercentage === 100) {
                    this.openComment();
                }

                if (type == "video" || type == "Document") {
                    this.getChapter(type);   //查询课程目录
                } else {
                    this.saveCourseInfo(res.data, this.product.chapter);
                }
            }
        );
    }

    //点赞or取消点赞
    handlePraise() {
        //已经扔鸡蛋且想点赞
        if (!this.product.detail.IsPraise && this.product.detail.IsHate) {
            this.commonSer.toast('您已经扔鸡蛋了哦～');
            return
        }
        this.showLoading();
        const data = {
            TopicID: this.product.detail.PrId
        }
        if (this.product.detail.IsPraise) {   //已经点赞了，去取消点赞
            this.learnSer.CancelPraise(data).subscribe(
                (res) => {
                    this.getCourseDetail();
                }
            )
        } else {
            this.learnSer.SavePraise(data).subscribe(
                (res) => {
                    this.getCourseDetail();
                }
            )
        }
    }

    //收藏or取消收藏
    handleCollection() {
        this.showLoading();
        const data = {
            CSID: this.product.detail.PrId
        };
        if (!this.product.detail.IsCollection) {
            this.learSer.SaveCollectionByCSID(data).subscribe(
                (res) => {
                    this.getCourseDetail();
                }
            )
        } else {
            this.learSer.CancelCollectionByCSID(data).subscribe(
                (res) => {
                    this.getCourseDetail();
                }
            )
        }

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


    //获取评价列表、讲师列表
    GetCommentData() {
        this.commentStar.getCommentList(this.product.detail.PrId);
        this.getTalkList();
    }

    //课程讨论
    getTalkList() {
        this.talkObj.Page = 1;
        const data3 = {
            pageSize: 5,
            page: this.talkObj.Page,
            TopicType: 'talk',   //teacher  course
            topicID: this.product.detail.PrId
        };
        this.learnSer.GetTalkLists(data3).subscribe(   //课程讨论
            (res) => {
                if (res.data) {
                    this.comment.talk = res.data.CommentItems;
                    this.talkObj.TotalCount = res.data.TotalCount;
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

    //打开课程评论弹窗
    openComment() {
        let modal = this.modalCtrl.create(CommentByCourseComponent, {
            placeholder: '请理性发言，文明用语...',
            type: 'course',
            TopicID: this.product.detail.PrId,
        });
        modal.onDidDismiss(res => {
            if (res) {
                this.commentStar.getCommentList(this.product.detail.PrId);
                this.getTalkList();
            }
        });
        modal.present();
    }

    //课程讨论
    openTalk() {
        let modal = this.modalCtrl.create(CommentComponent, {
            placeholder: '请输入讨论内容',
            type: 'talk',
        });
        modal.onDidDismiss(res => {
            if (res) {
                const data = {
                    TopicID: this.product.detail.PrId,
                    Contents: res.replyContent,
                    TopicType: 'talk'
                };
                this.learnSer.Savetalk(data).subscribe(
                    (res) => {
                        this.commonSer.toast('发表成功');
                        this.getTalkList();
                    }
                )
            }
        });
        modal.present();
    }

    //tab切换
    changeType(item) {
        console.log(item);
        if (this.isLoad) {
            this.bar.type = item.type;
            this.bar.code = item.code;
            //多课程层级时，多个swiper
            if (this.mySwiper.length > 0) {
                const index = this.mySwiper.length - 1;
                this.mySwiper[index].slideTo(item.type - 1, 100);
            } else {
                this.mySwiper.slideTo(item.type - 1, 100);
            }
        } else {
            this.commonSer.toast('数据加载中...')
        }
    }


    //获取时间戳
    getTime(date) {
        return new Date(date).getTime();
    }

    //切换slide
    slideChanged() {
    }

    //关闭弹窗
    close(e) {
        this.videoInfo.video = null;
        this.videoInfo.poster = null;
        this.iframObj = null;
        this.courseFileType = null;
    }

    //简介显示
    showIntroduction() {
        this.showMore = !this.showMore;
        setTimeout(() => {
            this.marginTop = this.CourseIntroduction.nativeElement.clientHeight;
        })
    }


    /**
     * 作业提示的情况触发的方法 仅存在普通选项作业的错误回顾
     * @param type  1=>回顾  2=>继续作业
     */
    handleShowError(type) {
        const data = {
            Fid: this.global.ExamFid
        };
        this.isError = false;
        if (type == 1) {   //回顾作业
            this.navCtrl.push(ErrorExamPage, {item: data, source: 'courseExam'})
            return
        }
        if (type == 2) {   //重新开始
            this.navCtrl.push(DoExamPage, {item: data, ExamStatusMine: 'ChongXinKaiShi'})
        }
    }


    //加载更多--课程讨论
    doInfinite() {
        if (this.comment.talk.length + 1 > this.talkObj.TotalCount) {
            this.commonSer.toast('没有更多讨论了');
            this.comment.talkLoad = false;
            return
        }
        this.talkObj.Page++;
        const data3 = {
            pageSize: 5,
            page: this.talkObj.Page,
            TopicType: 'talk',   //teacher  course
            topicID: this.product.detail.PrId
        };
        this.learnSer.GetTalkLists(data3).subscribe(   //课程讨论
            (res) => {
                if (res.data) {
                    this.zone.run(() => {
                        this.comment.talk = [...this.comment.talk, ...res.data.CommentItems];
                    });
                    this.talkObj.TotalCount = res.data.TotalCount;
                    this.comment.talkLoad = false;
                }
            }
        );
    }

    //加载更多 ----我的同学
    doInfiniteClassmate() {
        if (this.classmate.obj.List.length + 1 > this.classmate.obj.AnswerUserTotal) {
            this.commonSer.toast('没有更多同学了');
            this.classmate.obj.isLoad = false;
            return
        }
        this.classmate.PageIndex++;
        const data = {
            "PageIndex": this.classmate.PageIndex,
            "PageSize": this.classmate.PageSize,
            "PRID": this.product.detail.PrId,
            'TaskId': this.TaskId
        }
        this.homeSer.StudyPlanList(data).subscribe(
            res => {
                if (res.data) {
                    this.zone.run(() => {
                        this.classmate.obj.List = [...this.classmate.obj.List, ...res.data.UserDetails]
                    });
                    console.log(this.classmate.obj.List);
                    this.classmate.obj.AnswerUserTotal = res.data.AnswerUserTotal;
                    this.classmate.obj.ThenUserTotal = res.data.ThenUserTotal;
                    this.classmate.obj.isLoad = false;
                }
            }
        )
    }

    //监听讨论列表滚动
    listenerScroll() {
        const documentHeight = document.body.clientHeight;   //窗口高度
        // 256为banner区域高度  44 为ion-heider的高度
        const viewHeight = documentHeight - 256 - 50 - 44;   //中间讨论区域可视高度
        this.content.ionScroll.subscribe(($event: any) => {
            if (this.bar.code == "talk") {
                const TalkContentHeight = this.TalkContent.nativeElement.clientHeight - 40;  //讨论列表高度
                if (this.comment.talk.length + 1 > this.talkObj.TotalCount) {
                    this.comment.talkLoad = false;
                    return
                }

                if (this.comment.talkLoad) return
                //给予50px高度的差异值
                if ((TalkContentHeight - 50 < $event.scrollTop + viewHeight && $event.scrollTop + viewHeight < TalkContentHeight)
                    || ($event.scrollTop + viewHeight == TalkContentHeight)) {
                    console.log('加载更多');
                    this.doInfinite();
                    this.comment.talkLoad = true;
                }
            }
            if (this.bar.code == 'classmate') {
                const ClassmateContentHeight = this.ClassmateContent.nativeElement.clientHeight - 40;  //讨论列表高度
                console.log("ClassmateContentHeight", ClassmateContentHeight);
                console.log("$event.scrollTop + viewHeight", $event.scrollTop + viewHeight);
                if (this.classmate.obj.List.length + 1 > this.classmate.obj.AnswerUserTotal) {
                    console.log("1");
                    this.classmate.obj.isLoad = false;
                    return
                }
                console.log("2");
                if (this.classmate.obj.isLoad) return
                console.log("3");
                //给予50px高度的差异值
                if ((ClassmateContentHeight - 50 < $event.scrollTop + viewHeight && $event.scrollTop + viewHeight < ClassmateContentHeight)
                    || ($event.scrollTop + viewHeight == ClassmateContentHeight)) {
                    console.log("4");
                    this.classmate.obj.isLoad = true;
                    this.doInfiniteClassmate();
                }
            }
        });
    }

    //loading实例只能当前使用 当前销毁 故创建一个方法 判断是否存在loading
    showLoading() {
        if (!this.loading) {
            this.loading = this.loadCtrl.create({
                content: '',
            });
            this.loading.present();
        }
    }

    dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }

    showTips() {
        const msg = `下载的课件:安卓手机存储在根目录的sgmw文件夹目录下，苹果手机视频存储在相册内的sgmw文件夹下`;
        const alert = this.alertCtrl.create({
            title: `提示`,
            message: msg,
            cssClass: 'mineAlert',
            buttons: ['确定']
        })
        alert.present();
    }

    getShowHeader(event) {
        this.showHeader = event;
    }
}
