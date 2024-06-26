import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
    ActionSheetController, Content,
    LoadingController,
    ModalController,
    Navbar,
    NavController,
    NavParams, Refresher
} from "ionic-angular";
import {PhotoLibrary} from "@ionic-native/photo-library";
import {ForumService} from '../forum.service';
import {CommonService} from "../../../core/common.service";
import {ViewReplyComponent} from '../view-reply/view-reply.component';
import {ReportPage} from "../report/report";
import {Storage} from "@ionic/storage";
import {DatePipe} from "@angular/common";
import {defaultHeadPhoto} from "../../../app/app.constants";
import {ShareWxComponent} from "../../../components/share-wx/share-wx";
import {PersonalCenterPage} from "../../home/personal-center/personal-center";

declare var Wechat;
declare let Swiper: any;
declare let videojs: any;
declare let amp: any;

interface IInput {
    canEdit: boolean,   //能否编辑
    selectedIndex: number,    //默认选择项索引
    images: any[],
    selectedCount?: number    //选中总数
}

@Component({
    selector: 'page-posts-content',
    templateUrl: './posts-content.component.html',
})
export class PostsContentComponent {
    @ViewChild('panel') panel: ElementRef;
    @ViewChild(Navbar) navbar: Navbar;
    @ViewChild(Refresher) refresher: Refresher;
    @ViewChild(Content) content: Content;

    defaultHeadPhoto = defaultHeadPhoto;
    lidata = {Id: '', TopicPlateId: "", Name: ""};
    inputText = "";
    textareaBlur = false;
    dataCon = <any>{
        "SetTopTime": "0001-01-01T00:00:00",
        "LockTime": "0001-01-01T00:00:00",
        "PosterHeadPhoto": "",
        "Replys": [],
        "Id": "",
        "Title": "",
        "TopicPlateId":
            "8dd8410d-5828-6352-3b79-0405039d37dc",
        "TopicPlateName": "",
        "Content": "",
        "Status": 2,
        "StatusName": "",
        "IsTop": false,
        "IsLocked": false,
        "Poster": "",
        "PostTimeFormatted": "2019/09/29 14:26:39",
        "PostRelativeTime": "",
        "FollowCount": '0',
        "LikeCount": '0',
        "DislikeCount": 0,
        "FavoritesCount": null,
        "ReplyCount": null,
        ViewCount: 0
    };
    @ViewChild('nnerhtml')
    greetDiv: ElementRef;
    initVideo;

    // 查看动态详情
    constructor(private serve: ForumService,
                public navParams: NavParams,
                public navCtrl: NavController,
                private loadCtrl: LoadingController,
                private actionSheetCtrl: ActionSheetController,
                private storage: Storage,
                private datePipe: DatePipe,
                private modalCtrl: ModalController,
                private photoLibrary: PhotoLibrary,
                public commonSer: CommonService) {
    }

    swiper: any;
    vm: any = {
        canEdit: false,
        selectedIndex: 0,
        images: [],
        selectedCount: 0
    };

    isShow = false;

    ionViewDidLoad() {
        this.navbar.backButtonClick = () => {
            if (this.initVideo) {
                this.initVideo.dispose();
            }
            this.navCtrl.pop();
        };
    }

    ionViewDidEnter() {
        this.storage.set('sgmwType', null);
        this.lidata = this.navParams.get('data');
        let nowDate = Date.now();
        if (new Date('2020-11-02 00:00').getTime() < nowDate && nowDate < new Date('2022-11-04 23:59').getTime()) {
            this.isShow = true;
        } else {
            this.isShow = false;
        }


        this.storage.get("PostData").then((value: any) => {
            if (value && value.length > 0) {
                const index = value.findIndex(e => e.Id === this.lidata.Id);
                if (index > -1) {
                    const data = value[index];
                    if ((Date.now() - data.time) < (1 * 24 * 60 * 60 * 1000)) {  //超过一天 重新加载
                        this.initPostInfo(data.detail);
                        this.silentSearch();
                    } else {
                        this.forum_post_publish();
                    }
                } else { //没有 重新查询
                    this.forum_post_publish();
                }
            } else {  //没有 重新查询
                this.forum_post_publish();
            }
        })

    }

    textareaclick() {
        this.textareaBlur = true;
    }

    inputshow_on() {
        this.textareaBlur = false;
    }

    // 前往回复列表
    showViewReply(data) {
        this.navCtrl.push(ViewReplyComponent, {data: data, lidata: this.lidata});
    }

    loading;

    silentSearch() {
        this.serve.forum_post_get({postId: this.lidata.Id}).subscribe((res: any) => {
            this.dismissLoading();
            if (res.code != 200) {
                this.serve.presentToast(res.message);
            } else {
                this.savePostInfo(res.data);
            }
            this.initVideoEle();
            this.initPostInfo(res.data);
        });
    }

    //查询动态数据
    async forum_post_publish() {
        this.showLoading();
        this.serve.forum_post_get({postId: this.lidata.Id}).subscribe((res: any) => {
            this.dismissLoading();
            if (res.code != 200) {
                this.serve.presentToast(res.message);
            } else {
                this.savePostInfo(res.data);
            }
            this.initVideoEle();
            this.initPostInfo(res.data);
        });
    }

    //初始化页面信息
    initPostInfo(data) {
        let element = data;
        //过滤时间
        element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime);

        if (data.Replys) {
            data.Replys.forEach(element => {
                if (element.PosterBadges && element.PosterBadges > 1) {
                    if (element['PosterUserName'].length > 5) {
                        element['PosterUserName'] = element.PosterUserName.slice(0, 6) + '...';
                    }
                }

                if (element.PosterBadges) {
                    element.PosterBadges.forEach(e => {
                        if (element.PosterBadges.length > 1) {
                            if (e['BadgeName'].length > 4) {
                                e['BadgeName'] = e['BadgeName'].slice(0, 4) + '...';
                            }
                        }
                    });
                }

                element['_ReplyTimeFormatted'] = element.ReplyTimeFormatted.slice(0, -3);
            });
            data.Replys.reverse();
        }

        //pt字体单位导致的 文字放大
        data.Content = data.Content.replace(/pt/g, 'px');

        this.dataCon = data;

        this.dataCon['is_like'] = false;
        this.dataCon['is_guanzhu'] = false;
        this.dataCon['is_collect'] = false;
        this.initVideoEle();
        this.dataCon.PostTimeFormatted = this.dataCon.PostTimeFormatted.replace(/-/g, "/")
        setTimeout(() => {
            this.openImg();
        }, 200);


        //查询我是否关注收/收藏/点赞动态
        this.serve.GetForumPostOtherStatus(this.dataCon.Id).subscribe((resp: any) => {
            this.dataCon['is_like'] = resp.data.is_like;
            this.dataCon['is_guanzhu'] = resp.data.is_guanzhu;
            this.dataCon['is_collect'] = resp.data.is_collect;
            this.dismissLoading();
        }, err => {
            this.dismissLoading();
        });
    }

    initVideoEle() {
        if (this.initVideo) {
            return;
        }
        const videoEle = document.getElementById("videoPoster");
        if (this.dataCon.Pvideo && videoEle && !this.initVideo) {
            setTimeout(() => {
                this.initVideo = amp(`videoPoster`, {
                    controls: true,
                    "sources": [{
                        //android 的用视频流地址播放 会出现视频画面模糊的问题 暂未解决只能根据视频地址播放
                        src: this.dataCon.Pvideo.files.AttachmentUrl,
                        type: 'application/x-mpegURL'
                    }],
                })
            }, 100)
        }
        if (this.dataCon.Pvideo && !videoEle) {
            setTimeout(() => {
                this.initVideoEle();
            }, 100);
        }
    }

    /**
     * 存储动态信息
     * @param detail=动态信息  this.lidata.Id=当前动态ID
     */
    savePostInfo(detail) {
        const info = {
            "Id": this.lidata.Id,
            "detail": detail,
            "time": Date.now()
        }
        this.storage.get("PostData").then((value: any) => {
            if (value && value.length > 0) {
                const index = value.findIndex(e => e.Id === this.lidata.Id);
                if (index > -1) {  //已存在当前动态
                    value[index] = info;
                } else if (index === -1 && value.length < 5) {  //不存在动态 且当前动态存储长度有空余
                    value.push(info);
                } else {  //不存在动态 且当前动态存储长度无空余
                    value.splice(4, 1);
                    value.unshift(info);
                }
                this.storage.set('PostData', value);
            } else {
                const arr = [];
                arr.push(info);
                this.storage.set('PostData', arr);
            }
        })
    }

    showImgSrc = '';
    showImg = false;
    CloseImgTime = new Date().getTime(); // 关闭 图片时间
    openImg() {
        let Dom = document.querySelectorAll('.inner-html');
        let imgs = Dom[0].querySelectorAll('img');
        // imgs.
        this.vm.images = [];
        for (let n = 0; n < imgs.length; n++) {
            imgs[n].addEventListener('click', (e: any) => {
                if (this.showImg || new Date().getTime() - this.CloseImgTime < 200) {
                    return
                }
                this.swiper = null;
                this.vm.selectedIndex = n;
                this.showImgSrc = e.srcElement.src;
                setTimeout(() => {
                    this.initImg();
                }, 40);
                this.isenlarge = false;
                this.showImg = true;
            })
            this.vm.images.push(imgs[n].src);
        }
    }


    reasizeData() {
        this.showLoading()
        this.serve.forum_post_get({postId: this.lidata.Id}).subscribe((res: any) => {
            this.dataCon['ReplyCount'] = res.data.ReplyCount;
            this.dataCon['Replys'] = this.dataCon['Replys'] ? this.dataCon['Replys'] : [];
            if (res.data.Replys) {
                res.data.Replys.forEach((element, i) => {
                    if (!this.dataCon['Replys'][i]) {
                        element['_ReplyTimeFormatted'] = element.ReplyTimeFormatted.slice(0, -3)
                        this.dataCon['Replys'].unshift(element);
                    }
                });
            }
            // GetForumInfoGetMyInfo
            this.dataCon['Replys'].forEach(time => {

            });


            this.dataCon['is_like'] = false;
            this.dataCon['is_guanzhu'] = false;
            this.dataCon['is_collect'] = false;
            this.dataCon.PostTimeFormatted = this.dataCon.PostTimeFormatted.replace(/-/g, "/")

            this.serve.GetForumPostOtherStatus(this.dataCon.Id).subscribe((res: any) => {
                this.dataCon['is_like'] = res.data.is_like;
                this.dataCon['is_guanzhu'] = res.data.is_guanzhu;
                this.dataCon['is_collect'] = res.data.is_collect;
                this.dismissLoading()
            }, err => {
                this.dismissLoading();
            });


        });
    }

    // 关注
    follow(data) {
        console.log(data['is_guanzhu']);
        if (data.isFollowClick) return;
        data.isFollowClick = true;

        if (data['is_guanzhu']) {
            if (parseInt(this.dataCon['FollowCount']) == 0) {
                return;
            }
            data['is_guanzhu'] = false;
            this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount']) - 1 + '';
            this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount']) < 0 ? '0' : this.dataCon['FollowCount'];
            this.serve.cancelfollow(data.Id).subscribe((res: any) => {
                if (res.code == 200) {
                    data.isFollowClick = false;
                } else {
                    this.commonSer.alert(res.message);
                }
            });
        } else {
            data['is_guanzhu'] = true;
            this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount']) + 1 + '';
            this.serve.follow(data.Id).subscribe((res: any) => {
                if (res.code == 200) {
                    data.isFollowClick = false;
                } else {
                    this.commonSer.alert(res.message);
                }
            });
        }
    }

    // 收藏
    favorites(data) {
        if (data.isFavoritesClick) return;
        data.isFavoritesClick = true;

        if (data['is_collect']) {
            data['is_collect'] = false;
            this.dataCon['FavoritesCount'] = parseInt(this.dataCon['FavoritesCount']) - 1 + '';
            this.serve.cancelfavorites(data.Id).subscribe((res: any) => {
                if (res.code == 200) {
                    data.isFavoritesClick = false;
                } else {
                    this.commonSer.alert(res.message);
                }
            });
        } else {
            data['is_collect'] = true;
            this.dataCon['FavoritesCount'] = parseInt(this.dataCon['FavoritesCount']) + 1 + '';
            this.serve.favorites(data.Id).subscribe((res: any) => {
                if (res.code == 200) {
                    data.isFavoritesClick = false;
                } else {
                    this.commonSer.alert(res.message);
                }
            });
        }
    }

    // 点赞
    forum_post_like(data) {
        if (data.isLikeClick) return;
        data.isLikeClick = true;

        if (data['is_like']) {
            data['is_like'] = false;
            this.dataCon['LikeCount'] = parseInt(this.dataCon['LikeCount']) - 1 + '';
            this.serve.forum_post_cancellike(data.Id).subscribe((res: any) => {
                if (res.code == 200) {
                    data.isLikeClick = false;
                } else {
                    this.commonSer.alert(res.message);
                }
            });
        } else {
            data['is_like'] = true;
            this.dataCon['LikeCount'] = parseInt(this.dataCon['LikeCount']) + 1 + '';
            this.serve.forum_post_like(data.Id).subscribe((res: any) => {
                if (res.code == 200) {
                    data.isLikeClick = false;
                } else {
                    this.commonSer.alert(res.message);
                }
            });
        }
    }


    // 评论动态
    reply_add_click = false;

    reply_add() {
        if (!this.inputText) {
            return this.serve.presentToast('请输入评论内容');
        }
        let data = {
            "PostId": this.dataCon.Id,//动态编号
            "Content": this.inputText,//回帖内容
        }
        this.showLoading();
        this.reply_add_click = true
        this.serve.reply_add(data).subscribe((res: any) => {
            this.inputText = "";
            if (res.code == 200) {
                this.textareaBlur = false;
                this.reply_add_click = false;
                this.reasizeData();
            }
            this.dismissLoading();
        });
    }

    // 微信分享
    wxShare(data) {
        let description = data.Content.replace(/\&nbsp;/g, '');
        let thumb = '';

        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        if (data.Images && data.Images.length > 0) {
            thumb = data.Images[0].Src;
        }
        const obj = {
            title: data.Title,
            description: description,
            thumb: thumb,
            paramsUrl: `/#/bbsdetails/${data.Id}`
        }
        let modal = this.modalCtrl.create(ShareWxComponent, {data: obj});
        modal.present();
        // this.commonSer.weChatShare(obj)
    }

    //我要投诉
    handleReport() {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '我要投诉',
                    role: 'report',
                    handler: () => {
                        this.navCtrl.push(ReportPage, {data: this.dataCon});
                    }
                },
                {
                    text: '拉黑',
                    role: 'report',
                    handler: () => {
                        this.commonSer.alert('是否拉黑该用户?', () => {
                            this.storage.get('Blacklist').then((value: any) => {
                                if (value) {
                                    value.push(this.dataCon.Id);
                                    this.storage.set('Blacklist', value);
                                } else {
                                    this.storage.set('Blacklist', [this.dataCon.Id]);
                                }
                            })
                        })
                    }
                },
                {
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

    isenlarge = false;
    mousedownTime = new Date().getTime();

    photoLibraryDown() {
        this.photoLibrary.requestAuthorization({read: true, write: true}).then(() => {
            this.photoLibrary.saveImage(this.showImgSrc, 'SGMW').then(() => {
                this.commonSer.alert('保存成功');
            })
        }, (err) => {
            this.commonSer.alert(`没有相册权限，请手动设置权限`);
        })
    }

    CloseImg() {
        this.showImg = false;
        this.showImgSrc = '';
    }

    initImg() {
        this.swiper = new Swiper(this.panel.nativeElement, {
            direction: 'horizontal',
            initialSlide: this.vm.selectedIndex,//初始化显示第几个
            zoom: true,//双击,手势缩放
            loop: false,//循环切换
            // loopAdditionalSlides :3,
            lazyLoading: true,//延迟加载
            lazyLoadingOnTransitionStart: true,//    lazyLoadingInPrevNext : true,
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction'
            },
            on: {
                // tap:(e) =>{
                click: (e) => {
                    setTimeout(() => {
                        this.CloseImgTime = new Date().getTime();
                        this.showImg = false;
                    }, 10);
                },
                slideChange: () => {
                    if (this.swiper) {
                        let activeIndex = this.swiper.activeIndex;
                        if (activeIndex < this.vm.images.length && activeIndex >= 0) {
                            this.vm.selectedIndex = activeIndex;
                            this.showImgSrc = this.vm.images[activeIndex];
                        }
                    }
                }
            }
        })
    }

    //下拉刷新
    doRefresh(e) {
    }


    showLoading() {
        console.log("showLoading");
        this.refresher._top = this.content.contentTop + 'px';
        this.refresher.state = 'ready';
        this.refresher._onEnd();
    }

    dismissLoading() {
        console.log("dismissLoading");
        this.refresher.complete();
    }

    toPerson(item) {
        this.storage.get('user').then(value => {
            if (item.Poster !== value.MainUserID) {
                this.navCtrl.push(PersonalCenterPage, {Poster: item.Poster})
            }
        });
    }

}
