import {Component, ElementRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {
    ActionSheetController,
    Content,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform
} from 'ionic-angular';
import {VideojsComponent} from "../../../components/videojs/videojs";
import {
    defaultHeadPhoto,
    env,
    SERVER_API_URL_DEV,
    SERVER_API_URL_PROD,
    SERVER_API_URL_UAT
} from "../../../app/app.constants";
import {LearnService} from "../learn.service";
import {AppService} from "../../../app/app.service";
import {CommonService} from "../../../core/common.service";
import {EmitService} from "../../../core/emit.service";
import {FileService} from "../../../core/file.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ViewFilePage} from "../view-file/view-file";
import {CourseCommentPage} from "../course-comment/course-comment";
import {timer} from "rxjs/observable/timer";
import {CourseFilePage} from "../course-file/course-file";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";

declare let Swiper: any;
@Component({
    selector: 'page-inner-course',
    templateUrl: 'inner-course.html',
})
export class InnerCoursePage {

    @ViewChild('banner') banner: ElementRef;
    @ViewChild('navbar') navbar: ElementRef;
    @ViewChild('TalkContent') TalkContent: ElementRef;
    @ViewChild('videojsCom') videojsCom: VideojsComponent;
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
        {type: 2, name: '内训资料', code: 'chapter'},
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
        talkLoad: false,
    };
    talkObj = {  //讨论 分页
        Page: 0,
        TotalCount: 0
    }

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
    teacherFileList = []

    preImgSrc = null; //图片URL
    nowTime;

    uploadFile;  //上传文件信息
    mySwiper;

    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController, public appSer: AppService, public commonSer: CommonService,
                public zone: NgZone, public renderer: Renderer2, private emitService: EmitService,
                private learnSer: LearnService,
                private camera: Camera,
                private platform: Platform,
                private loadingCtrl: LoadingController,
                private transfer: FileTransfer,
                private actionSheetCtrl: ActionSheetController,
                private fileSer: FileService, private inAppBrowser: InAppBrowser, private modalCtrl: ModalController) {
        this.pId = this.navParams.get('id');
    }

    ionViewDidLoad() {
        this.listenerScroll();
        this.initSwiper();
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
                this.getProductInfo();
            }
        );
    }


    ionViewWillLeave() {
        this.courseFileType = null;
        this.showFooter = false;
        this.appSer.setFile(null);
        if (this.videojsCom) this.videojsCom.pageLeave();
        const arr = this.navCtrl.getViews().filter(e => e.name == 'CourseDetailPage');
        if (arr.length == 1 && this.videojsCom) this.videojsCom.destroy();
    }

    //初始化swiper
    initSwiper() {
        let that = this;
        that.mySwiper = new Swiper('.swiper-inner-course-container', {
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

    //tab切换
    changeType(item) {
        if (this.isLoad) {
            this.bar.type = item.type;
            this.mySwiper.slideTo(item.type - 1, 100);
        } else {
            this.commonSer.toast('数据加载中...')
        }
    }

    //内训资料
    async getProductInfo() {
        const data = {
            pid: this.pId
        };
        await this.learSer.GetMainFile(data).subscribe(
            (res) => {
                this.teacherFileList = res.data;
                this.loading.dismiss();
                this.isLoad = true;
            }
        );

        this.talkObj.Page = 1;
        const data2 = {
            pageSize: 5,
            page: this.talkObj.Page,
            TopicType: "course",   //teacher  course
            topicID: this.product.detail.PrId
        }
        this.learnSer.GetTalkList(data2).subscribe(
            (res) => {
                if (res.data) {
                    this.comment.talk = res.data.CommentItems;
                    this.talkObj.TotalCount = res.data.TotalCount;
                }
            }
        );

        this.getSelFile();
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
            TopicType: "course",   //teacher  course
            topicID: this.product.detail.PrId
        };
        this.learnSer.GetTalkList(data3).subscribe(   //课程讨论
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

    //获取自己上传的内训资料
    getSelFile() {
        const data2 = {
            pid: this.pId
        };
        this.learSer.GetSelfFile(data2).subscribe(
            (res) => {
                this.mainFile = res.data;
            }
        )
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
        const data = {
            pid: this.pId
        };
        this.learSer.BuyProduct(data).subscribe(
            (res) => {
                this.ionViewDidEnter();
                this.initStudy();
                this.signObj.isSign = true;
                timer(2000).subscribe(() => this.signObj.isSign = false);
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

    //选择图片
    takePic() {
        const nowTime = Date.now();
        const ApplicantSTime = this.commonSer.transFormTime(this.product.detail.ApplicantSTime);
        if (nowTime < ApplicantSTime) {
            this.commonSer.toast('内训尚未开始');
            return
        }
        const actionSheet = this.actionSheetCtrl.create({
            cssClass: 'cameraAction',
            buttons: [
                {
                    text: '拍照',
                    role: 'fromCamera',
                    handler: () => {
                        console.log('fromCamera');
                        this.selectPicture(1);
                    }
                }, {
                    text: '从相册中选',
                    role: 'fromPhoto',
                    handler: () => {
                        console.log('fromPhoto');
                        this.selectPicture(0);
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    //选择图片
    selectPicture(srcType) {
        const options: CameraOptions = {
            quality: 10,  //1 拍照  2 相册
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: srcType,
            targetWidth: 375,
            targetHeight: 667,
            saveToPhotoAlbum: false
        };
        const option: FileUploadOptions = {
            httpMethod: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            fileName: 'image.png'
        };
        if (this.platform.is('ios')) {
            this.appSer.setIOS('platformIOS');
            // @ts-ignore
            setTimeout(()=>{
                this.appSer.setIOS('innerCourse');
            },1500)
        }
        this.camera.getPicture(options).then((imagedata) => {
            let filePath = imagedata;
            if (filePath.indexOf('?') !== -1) {     //获取文件名
                filePath = filePath.split('?')[0];
            }
            let arr = filePath.split('/');
            option.fileName = arr[arr.length - 1];
            console.log(imagedata);
            console.log(arr);
            if (this.platform.is('ios')) {
                this.uploadFile = {
                    AttachmentName: option.fileName,
                    AttachmentDIsplayName: option.fileName,
                    AttachmentExt: option.fileName.split('.')[1],
                };
            } else {
                const AttachmentName = option.fileName.indexOf('.') == -1 ? `${option.fileName}.jpg` : option.fileName;
                const AttachmentExt = option.fileName.indexOf('.') == -1 ? `jpg` : option.fileName.split('.')[1];
                this.uploadFile = {
                    AttachmentName: AttachmentName,
                    AttachmentDIsplayName: AttachmentName,
                    AttachmentExt: AttachmentExt,
                };
            }

            this.upload(imagedata, option);
        })
    }

    //上传图片
    upload(file, options) {
        const uploadLoading = this.loadingCtrl.create({
            content: '上传中...',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        uploadLoading.present();
        const SERVER_URL = (env === 'localhost' ? SERVER_API_URL_DEV : (env == 'dev' ? SERVER_API_URL_DEV : (env == 'uat' ?
            SERVER_API_URL_UAT : (env == 'prod' ? SERVER_API_URL_PROD : ''))));
        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.upload(file, SERVER_URL + '/Upload/UploadFiles', options).then(
            (res) => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传成功');
                const data = JSON.parse(res.response);
                console.log(data);
                this.addRecord(data.data);
            }, err => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传错误');
            });
        fileTransfer.onProgress((listener) => {
            let per = <any>(listener.loaded / listener.total) * 100;
            per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2)
            this.zone.run(() => {
                uploadLoading.setContent(`上传中...${per}%`);
            })
        })
    }

    //提交记录
    addRecord(data) {
        const req = {
            TeachingID: this.pId,
            AttachmentName: this.uploadFile.AttachmentName,
            AttachmentDIsplayName: this.uploadFile.AttachmentDIsplayName,
            AttachmentUrl: data,
            AttachmentSize: "",
            AttachmentExt: this.uploadFile.AttachmentExt,
            Description: "",
            DownloadUrl: data
        };
        this.learnSer.AddFile(req).subscribe(
            (res) => {
                if (res.data) {
                    this.commonSer.toast('上传记录成功');
                    this.getProductInfo();
                }
            }
        )
    }


    //获取时间戳
    getTime(date) {
        return new Date(date).getTime();
    }

    //前往资料记录
    goMainFile() {
        this.navCtrl.push(CourseFilePage, {title: "已上传资料", mainFile: this.mainFile, pId: this.pId})
    }

    //教师上传的资料
    goTeacherFile() {
        this.navCtrl.push(CourseFilePage, {title: "内训资料", mainFile: this.teacherFileList})
    }

    viewimage(e) {
        console.log(e);
        this.preImgSrc = e;
    }

    //监听讨论列表滚动
    listenerScroll() {
        const documentHeight = document.body.clientHeight;   //窗口高度
        // 256为banner区域高度  44 为ion-heider的高度
        const viewHeight = documentHeight - 256 - 50 - 44;   //中间讨论区域可视高度
        this.content.ionScroll.subscribe(($event: any) => {
            if (this.bar.type == 3) {
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
        });
    }

}
