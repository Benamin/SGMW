import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, LoadingController, ActionSheetController, Platform} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {EditPage} from "../../competition/edit/edit";
import {VideoBoxPage} from "../video-box/video-box";
import {HomeService} from "../../home.service";
import {CaptureVideoOptions, MediaCapture, MediaFile, MediaFileData} from "@ionic-native/media-capture";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {CommonService} from "../../../../core/common.service";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Entry, File} from "@ionic-native/file";
import {AppService} from "../../../../app/app.service";


@Component({
    selector: 'page-video-lists',
    templateUrl: 'video-lists.html',
})
export class VideoListsPage {
    defaultImg = './assets/imgs/competition/fengmian@2x.png'
    videoLists = [];
    page = {
        searchKey: "",
        videoLists: [],
        Page: 1,
        PageSize: 10,
        TotalCount: null,
        isLoad: false
    };

    constructor(private homeSer: HomeService, public navCtrl: NavController,
                private actionSheetCtrl: ActionSheetController,
                private mediaCapture: MediaCapture,
                private loadingCtrl: LoadingController,
                private Camera: Camera,
                private zone: NgZone,
                private platform: Platform,
                private appSer: AppService,
                private file: File,
                private commonSer: CommonService,
                private transfer: FileTransfer,
                public navParams: NavParams, private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.getList();
    }

    // 进入视频播放页
    goVideoBox(item) {
        this.navCtrl.push(VideoBoxPage, {item: item});
    }

    goToEdit() {
        let modal = this.actionSheetCtrl.create(
            {
                buttons: [
                    {
                        text: '录制短视频',
                        role: '',
                        handler: () => {
                            this.captureVideo();
                        }
                    },
                    // {
                    //     text: '上传短视频',
                    //     role: '',
                    //     handler: () => {
                    //         this.selectVide();
                    //     }
                    // },
                    {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            return
                        }
                    },
                ]
            }
        )
        modal.present();
    }

// {
//     end:0,
//     fullPath:"file:///storage/emulated/0/DCIM/Camera/VID_20200323_103712.mp4",
//     lastModified:null,
//     lastModifiedDate:1584931048000,
//     localURL:"cdvfile://localhost/sdcard/DCIM/Camera/VID_20200323_103712.mp4",
//     name:"VID_20200323_103712.mp4",
//     size:21748732,
//     start:0,
//     type:"video/mp4",
//     "width":0,"duration":0,"bitrate":0,"codecs":null,"height":0
// }
    captureVideo() {
        let option: CaptureVideoOptions = {
            limit: 1,
            duration: 15,
            quality: 50
        };
        if (this.platform.is('ios')) {
            this.appSer.setIOS('platformIOS');
            // @ts-ignore
            setTimeout(() => {
                this.appSer.setIOS('innerCourse');
            }, 1500)
        }
        this.mediaCapture.captureVideo(option).then((mediaFiles: any) => {
            const mediaFile = mediaFiles[0];
            mediaFile.getFormatData((data: MediaFileData) => {
                Object.assign(mediaFile, data);
                console.log("mediaFile");
                console.log(mediaFile);
                this.uploadVideo(mediaFile)
            }, error => {
                console.log(error);
            })
        })
    }


    // AssetId:"nb:cid:UUID:c7a84183-07bc-4f34-b607-912b29cc09fa"
    // DownloadUrl:"https://devstorgec.blob.core.chinacloudapi.cn/asset-c7a84183-07bc-4f34-b607-912b29cc09fa/VID_20200323_111446.mp4?sv=2018-03-28&sr=b&sig=ds86zkaBbVXIDDx5KzPMLNX6xxb1GrQ8o2slCHZG5PM%3D&se=2030-03-23T03%3A15%3A40Z&sp=rcw"
    // Imgurl:"https://devstorgec.blob.core.chinacloudapi.cn/asset-f15e6c34-b6b1-4717-8ac0-4dfad2d43b5a/VID_20200323_111446_000001.jpg?sv=2017-04-17&sr=c&si=6bed0a50-3f07-42ec-acc5-bb4e0376f44c&sig=doTiLv1%2BL3KmqLcD8iU2QK7S8cGBb%2B6Zjm2K6HVma68%3D&se=2020-04-02T03%3A16%3A37Z"
    // JobId:"nb:jid:UUID:0ad700ff-0300-aa76-5699-f1ea6cb49287"
    // Type:0
    // Url:"转码中"
    uploadVideo(mediaFile) {
        const option: FileUploadOptions = {
            httpMethod: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            fileName: mediaFile.name
        };
        const uploadLoading = this.loadingCtrl.create({
            content: '上传中...',
            dismissOnPageChange: true,
            enableBackdropDismiss: true,
        });
        uploadLoading.present();
        const SERVER_URL = 'http://devapi1.chinacloudsites.cn/api'; //开发环境
        // const SERVER_URL = 'http://sitapi1.chinacloudsites.cn/api'; //sit环境
        // const SERVER_URL = 'https://elearningapi.sgmw.com.cn/api';  //生产环境
        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.upload(mediaFile.fullPath, SERVER_URL + '/AppShortVideo/UploadMainFile', option).then(
            (res) => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传成功');
                const data = JSON.parse(res.response);
                console.log("response data");
                console.log(data);
                this.navCtrl.push(EditPage, {mediaFile: mediaFile, resp: data.data});
            }, err => {
                uploadLoading.dismiss();
                this.commonSer.toast('上传错误');
            });
        fileTransfer.onProgress((listener) => {
            let per = <any>(listener.loaded / listener.total) * 100;
            per = Math.round(per * Math.pow(10, 2)) / Math.pow(10, 2);
            this.zone.run(() => {
                uploadLoading.setContent(`上传中...${per}%`);
            });
        })
    }


    clearInput() {
        this.page.searchKey = ''
    }

    doSearch(event) {
        if (event && event.keyCode == 13 && this.page.searchKey && this.page.searchKey !== '') {
            this.page.Page = 1;
            this.getList();
        }
    }

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        const data = {
            GetMyList: 0,
            Title: this.page.searchKey,
            Page: 1,
            PageSize: this.page.PageSize
        };
        this.homeSer.GetVideoLists(data).subscribe(
            (res) => {
                let videoLists = res.data.Items;
                console.log('videoLists', videoLists)
                this.page.videoLists = videoLists;
                this.page.TotalCount = res.data.TotalCount;

                this.page.isLoad = true;
                loading.dismiss();
            }
        )
    }

    tranTages(data) {
        let videoLists = data;
        for (var i = 0; i < videoLists.length; i++) {
            videoLists[i].tags = videoLists[i].SVTopicIDList[0].Name;
            if (videoLists[i].SVTopicIDList && videoLists[i].SVTopicIDList.length > 1) {
                for (var k = 1; k < videoLists[i].SVTopicIDList.length; k++) {
                    videoLists[i].tags += '、' + videoLists[i].SVTopicIDList[i].Name;
                }
            }
        }
        return videoLists;
    }

    //下拉刷新
    doRefresh(e) {
        this.page.Page = 1;
        this.getList();
        timer(1000).subscribe(() => {
            e.complete();
        });
    }

    //加载更多
    doInfinite(e) {
        if (this.page.videoLists.length == this.page.TotalCount || this.page.videoLists.length > this.page.TotalCount) {
            e.complete();
            return;
        }
        this.page.Page++;
        const data = {
            GetMyList: 0,
            Title: this.page.searchKey,
            Page: this.page.Page,
            PageSize: this.page.PageSize
        };
        this.homeSer.GetVideoLists(data).subscribe(
            (res) => {
                let videoLists = res.data.Items
                this.page.videoLists = this.page.videoLists.concat(videoLists);
                this.page.TotalCount = res.data.TotalCount;
                e.complete();
            }
        )
    }


    //选择视频
    selectVide() {
        const option = {
            sourceType: 0,
            destinationType: this.Camera.DestinationType.FILE_URI,
            quality: 10,
            mediaType: this.Camera.MediaType.VIDEO,
            allowEdit: false,
        }
        this.Camera.getPicture(option).then((videoData) => {
            console.log(videoData);
            this.file.resolveLocalFilesystemUrl(videoData).then((value: Entry) => {
                console.log(value);
            })
        })
    }

    //点赞 1 or 取消点赞 2
    handleLike(item, option, e) {
        e.stopPropagation();
        const data = {
            "SVID": item.ID,
            "IsADD": option
        };
        this.homeSer.shortVideoLike(data).subscribe(
            (res) => {
                if (res.data) {
                    this.getVideoDetail(item);
                } else {
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    //获取视频详情
    getVideoDetail(item) {
        const data = {
            SVID: item.ID
        };
        this.homeSer.GetShortVideoDetail(data).subscribe(
            (res) => {
                item.LikeCount = res.data.LikeCount;
                item.IsLike = res.data.IsLike;
                item.ReplyCount = res.data.ReplyCount;
            }
        )
    }
}
