import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
import {LearnService} from "../learn.service";
import {HomeService} from "../../home/home.service";
import {GlobalData} from "../../../core/GlobleData";
import {CommonService} from "../../../core/common.service";
import {ChooseImageProvider} from "../../../providers/choose-image/choose-image";
import {EditPage} from "../../home/competition/edit/edit";
import {ShortVideoProvider} from "../../../providers/short-video/short-video";


@Component({
    selector: 'page-video-exam',
    templateUrl: 'video-exam.html',
})
export class VideoExamPage {
    @ViewChild(Navbar) navbar: Navbar;

    Fid;
    exam = {
        QnAInfos: null, //题目信息
        ExamInfo: null  //作业信息
    };

    score = {
        score: 100,
        show: false,
        isDone: false,
    };

    isrelease = false; //是否分享讨论组0 不发，1发
    CoverUrl;

    videoObj;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public learnSer: LearnService,
                public chooseImage: ChooseImageProvider,
                public homeSer: HomeService,
                public global: GlobalData,
                public shortVideoPro: ShortVideoProvider,
                public commonSer: CommonService,
                public loadCtrl: LoadingController) {
    }


    ionViewDidLoad() {
        this.global.CourseEnterSource = "VideoExam";
        const loading = this.loadCtrl.create({
            content: '作业加载中...'
        });
        loading.present();
        const data = {
            Fid: this.navParams.get('Fid')
        };
        this.homeSer.getPaperDetailByStu(data).subscribe(
            (res) => {
                loading.dismiss();
                if (res.Result !== 0) {
                    if(res.message) this.commonSer.alert(res.message);
                    if(res.Message) this.commonSer.alert(res.Message);
                }
                this.exam.ExamInfo = res.data.ExamInfo;
                this.exam.QnAInfos = res.data.QnAInfos.length ? res.data.QnAInfos[0] : {};
            }
        )
    }

    /**
     * 上传视频
     * data:{resp:{},mediaFile:{}}
     */
    takeVideo() {
        this.shortVideoPro.chooseVideo((data) => {
            this.videoObj = data;
        })
    }

    //选中图片
    takePic() {
        this.chooseImage.takePic((data) => {
            this.CoverUrl = data;
        })
    }

    //返回键触犯暂存
    backSubmit() {
        const loading = this.loadCtrl.create({
            content: `暂存中...`
        });
        loading.present();
        const data = {
            submitType: 2,
            isrelease: this.isrelease === true ? 1 : 0,
            postsCertID: this.global.PostsCertID,
        };
        this.learnSer.submitPaperHomeWorkw(data, this.exam).subscribe(
            (res) => {
                loading.dismiss();
                if (res.code == 200) {
                    this.commonSer.toast('暂存成功');
                    this.navCtrl.getPrevious().data.courseEnterSource = '';
                    this.navCtrl.pop();
                } else {
                    this.commonSer.toast(res.Message);
                }
            }
        )
    }

    //确认提交 status 2-暂存 3-提交
    submit(status) {
        let msg;
        if (status == 2) msg = '暂存';
        if (status == 3) {
            msg = '提交';
            if (!this.CoverUrl) {
                this.commonSer.toast('请上传封面图');
                return;
            }
            if (!this.videoObj) {
                this.score.isDone = true;
                return
            }
        }
        this.commonSer.alert(`确认${msg}?`, () => {
            const loading = this.loadCtrl.create({
                content: `${msg}中...`
            });
            loading.present();
            const params = {
                submitType: status,
                isrelease: this.isrelease === true ? 1 : 0,
                postsCertID: this.global.PostsCertID,
            };
            const QnAInfosv = {
                "QnAID": this.exam.QnAInfos.QnAID,
                "StuQnAID": this.exam.QnAInfos.StuQnAID,
                "StuAnswer": "",
                videoData: {
                    AssetId: this.videoObj.resp.AssetId,
                    JobId: this.videoObj.resp.JobId,
                    Url: this.videoObj.resp.Url,
                    DownloadUrl: this.videoObj.resp.DownloadUrl,
                    Type: this.videoObj.resp.Type,
                    Imgurl: this.CoverUrl,
                    icon: this.videoObj.mediaFile.name.includes('MOV') ? "MOV" : "MP4",//如果是mp4格式的需要写mp4，如果是avi格式的需要写avi
                    DisplayName: this.videoObj.mediaFile.name,//文件显示名称
                    Size: this.videoObj.mediaFile.size,//文件大小
                    fileUrl: this.videoObj.resp.Url,//文件转码地址
                    Duration: this.videoObj.mediaFile.duration || 0,
                    filename: this.videoObj.mediaFile.name,//文件名称
                    Description: "视频作业",//文件简介
                    UploadWay: 0,//上传方式:0.本地上传，1.外部链接，选择课件
                }
            }
            this.exam.ExamInfo.qnAInfos = this.exam.QnAInfos;
            const data = {
                ExamInfo: this.exam.ExamInfo,
                QnAInfosv: QnAInfosv
            }
            this.learnSer.submitPaperHomeWorkv(params, data).subscribe(
                (res) => {
                    loading.dismiss();
                    if (res.code == 200 && status == 3) {
                        this.score.score = Math.ceil(res.message);
                        this.score.show = true;
                    } else if (res.code == 200 && status == 2) {
                        this.commonSer.toast('暂存成功');
                        this.navCtrl.getPrevious().data.courseEnterSource = '';
                        this.navCtrl.remove(3, 2);
                    } else {
                        this.commonSer.toast(JSON.stringify(res));
                    }
                }
            )
        });
    }

    //考分提示
    close(e) {
        this.score.show = false;
        this.navCtrl.remove(3, 2);
    }

    //未做完提示关闭
    closeDone(e) {
        this.score.isDone = false;
    }

}
