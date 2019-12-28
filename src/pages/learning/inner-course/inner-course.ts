import {Component, ElementRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {
    ActionSheetController,
    Content,
    IonicPage,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Slides
} from 'ionic-angular';
import {VideojsComponent} from "../../../components/videojs/videojs";
import {defaultHeadPhoto, SERVER_HTTP_URL} from "../../../app/app.constants";
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
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";

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
    teacherFileList = []

    preImgSrc = null; //图片URL
    nowTime;

    uploadFile;  //上传文件信息

    constructor(public navCtrl: NavController, public navParams: NavParams, private learSer: LearnService,
                public loadCtrl: LoadingController, public appSer: AppService, public commonSer: CommonService,
                public zone: NgZone, public renderer: Renderer2, private emitService: EmitService,
                private learnSer: LearnService,
                private camera: Camera,
                private loadingCtrl: LoadingController,
                private transfer: FileTransfer,
                private actionSheetCtrl: ActionSheetController,
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
        await this.learSer.GetMainFile(data).subscribe(
            (res) => {
                this.teacherFileList = res.data;
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
            quality: srcType == 1 ? 10 : 50,  //1 拍照  2 相册
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: srcType,
            saveToPhotoAlbum: false
        };
        const option: FileUploadOptions = {
            httpMethod: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            fileName: 'image.png'
        };
        this.camera.getPicture(options).then((imagedata) => {
            let filePath = imagedata;
            if (filePath.indexOf('?') !== -1) {     //获取文件名
                filePath = filePath.split('?')[0];
            }
            let arr = filePath.split('/');
            console.log(imagedata);
            console.log(arr);
            option.fileName = arr[arr.length - 1];
            this.uploadFile = {
                AttachmentName: option.fileName,
                AttachmentDIsplayName: option.fileName,
                AttachmentExt: option.fileName.split('.')[1],
            };
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
        const SERVER_URL = 'http://devapi1.chinacloudsites.cn/api'; //开发环境
        //  const SERVER_URL = 'http://sitapi1.chinacloudsites.cn/api'; //sit环境
        //  const SERVER_URL = 'https://elearningapi.sgmw.com.cn/api';  //生产环境
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.upload(file, SERVER_URL + '/Upload/UploadFiles', options).then(
            (res) => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传成功');
                const data = JSON.parse(res.response);
                this.addRecord(data.data);
            }, err => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传错误');
            });
        fileTransfer.onProgress((listener) => {
            let per = <any>(listener.loaded / listener.total) * 100;
            per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2)
            uploadLoading.setContent('上传中...' + per + '%');
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

    //教师上传的资料
    goTeacherFile() {
        this.navCtrl.push(CourseFilePage, {title: "内训资料", mainFile: this.teacherFileList})
    }

    viewimage(e) {
        console.log(e);
        this.preImgSrc = e;
    }

}
