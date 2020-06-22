import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NavParams, NavController, LoadingController, ActionSheetController} from "ionic-angular";
import {PhotoLibrary} from "@ionic-native/photo-library";
import {ForumService} from '../forum.service';
import {CommonService} from "../../../core/common.service";
import {ViewReplyComponent} from '../view-reply/view-reply.component';
import {ReportPage} from "../report/report";
import {Storage} from "@ionic/storage";
import {DatePipe} from "@angular/common";

declare var Wechat;
declare let Swiper: any;

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
export class PostsContentComponent implements OnInit {
    @ViewChild('panel') panel: ElementRef;
    lidata = {Id: '', TopicPlateId: "", Name: ""};
    inputText = "";
    textareaBlur = false;
    dataCon = {
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
        "PostTimeFormatted": "2019-09-29 14:26:39",
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

    // 查看帖子详情
    constructor(private serve: ForumService,
                public navParams: NavParams,
                public navCtrl: NavController,
                private loadCtrl: LoadingController,
                private actionSheetCtrl: ActionSheetController,
                private storage: Storage,
                private datePipe: DatePipe,
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

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.lidata = this.navParams.get('data');
        this.forum_post_publish();
        let nowDate = Date.now();
        if (new Date('2020-05-23 00:00').getTime() < nowDate && nowDate < new Date('2020-05-25 23:59').getTime()) {
            this.isShow = true;
        } else {
            this.isShow = false;
        }
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

    async forum_post_publish() {
        this.loading = this.loadCtrl.create({
            content: ''
        });
        this.loading.present();
        this.serve.forum_post_get({postId: this.lidata.Id}).subscribe((res: any) => {

            if (res.code != 200) {
                this.serve.presentToast(res.message);
                return this.loading.dismiss();
            }
            let element = res.data;
            element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime);

            if (res.data.Replys && res.code == 200) {
                res.data.Replys.forEach(element => {

                    if (element.PosterBadges && element.PosterBadges > 1) {
                        if (element['PosterUserName'].length > 5) {
                            element['PosterUserName'] = element.PosterUserName.slice(0, 6) + '...';
                        }
                        if (!element['PosterUserForumTitle']) {
                            element['PosterUserForumTitle'] = {
                                ForumTitle: '',
                            };
                        }
                        if (element['PosterUserForumTitle'].ForumTitle.length > 5) {
                            element['PosterUserForumTitle'].ForumTitle = element['PosterUserForumTitle'].ForumTitle.slice(0, 6) + '...';
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
                res.data.Replys.reverse();
            }
            this.dataCon = res.data;

            this.dataCon['is_like'] = false;
            this.dataCon['is_guanzhu'] = false;
            this.dataCon['is_collect'] = false;
            setTimeout(() => {
                this.openImg();
            }, 200);
            this.serve.GetForumPostOtherStatus(this.dataCon.Id).subscribe((res: any) => {
                this.dataCon['is_like'] = res.data.is_like;
                this.dataCon['is_guanzhu'] = res.data.is_guanzhu;
                this.dataCon['is_collect'] = res.data.is_collect;
                this.loading.dismiss();
            }, err => {
                this.loading.dismiss();
            });

            // const p= Promise.all([this.is_like(this.dataCon),this.is_guanzhu(this.dataCon),this.is_collect(this.dataCon)]);
            // p.then(res => {
            //   this.loading.dismiss();
            // });

        });
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
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
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

            this.serve.GetForumPostOtherStatus(this.dataCon.Id).subscribe((res: any) => {
                this.dataCon['is_like'] = res.data.is_like;
                this.dataCon['is_guanzhu'] = res.data.is_guanzhu;
                this.dataCon['is_collect'] = res.data.is_collect;
                loading.dismiss();
            }, err => {
                loading.dismiss();
            });


            // const p= Promise.all([this.is_like(this.dataCon),this.is_guanzhu(this.dataCon),this.is_collect(this.dataCon)]);
            // p.then(res => {
            //   loading.dismiss();
            // });


        });
    }

    async is_like(data) {
        await this.serve.forum_post_like(data.Id).subscribe((res: any) => {
            if (res.code == 200) {
                this.serve.forum_post_cancellike(data.Id);
            } else if (res.code == 300) {
                data['is_like'] = true;
            }
        });
    }

    async is_guanzhu(data) {

        await this.serve.follow(data.Id).subscribe((res: any) => {
            if (res.code == 200) {
                this.serve.cancelfollow(data.Id).subscribe((res: any) => {
                });
            } else if (res.code == 300) {
                data['is_guanzhu'] = true;
            }
        });
    }

    async is_collect(data) {  // 收藏
        await this.serve.favorites(data.Id).subscribe((res: any) => {
            if (res.code == 200) {
                this.serve.cancelfavorites(data.Id).subscribe((res: any) => {
                });
            } else if (res.code == 300) {
                data['is_collect'] = true;
            }
        });
    }

    // 关注
    follow(data) {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.serve.follow(data.Id).subscribe((res: any) => {
            data['is_guanzhu'] = true;
            this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount']) + 1 + '';
            loading.dismiss();
        });
    }

    // 取消关注
    cancelfollow(data) {
        if (parseInt(this.dataCon['FollowCount']) == 0) {
            return;
        }
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.serve.cancelfollow(data.Id).subscribe((res: any) => {
            data['is_guanzhu'] = false;
            this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount']) - 1 + '';
            this.dataCon['FollowCount'] = parseInt(this.dataCon['FollowCount']) < 0 ? '0' : this.dataCon['FollowCount'];
            loading.dismiss();
            // this.reasizeData();
        });
    }

    // 收藏
    favorites(data) {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.serve.favorites(data.Id).subscribe((res: any) => {
            data['is_collect'] = true;
            this.dataCon['FavoritesCount'] = parseInt(this.dataCon['FavoritesCount']) + 1 + '';
            loading.dismiss();
            // this.reasizeData();
        });
    }

    // 取消收藏
    cancelfavorites(data) {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.serve.cancelfavorites(data.Id).subscribe((res: any) => {
            data['is_collect'] = false;
            this.dataCon['FavoritesCount'] = parseInt(this.dataCon['FavoritesCount']) - 1 + '';
            loading.dismiss();
            // this.reasizeData();
        });
    }

    // 点赞
    forum_post_like(data) {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.serve.forum_post_like(data.Id).subscribe((res: any) => {
            data['is_like'] = true;
            this.dataCon['LikeCount'] = parseInt(this.dataCon['LikeCount']) + 1 + '';
            loading.dismiss();
            // this.reasizeData();
        });
    }

    // 取消点赞
    forum_post_cancellike(data) {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.serve.forum_post_cancellike(data.Id).subscribe((res: any) => {
            data['is_like'] = false;
            this.dataCon['LikeCount'] = parseInt(this.dataCon['LikeCount']) - 1 + '';
            loading.dismiss();
            // this.reasizeData();
        });
    }


    // 评论帖子
    reply_add_click = false;

    reply_add() {
        if (!this.inputText) {
            return this.serve.presentToast('请输入评论内容');
        }
        let data = {
            "PostId": this.dataCon.Id,//帖子编号
            "Content": this.inputText,//回帖内容
        }
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
        this.reply_add_click = true
        this.serve.reply_add(data).subscribe((res: any) => {
            this.inputText = "";
            if (res.code == 200) {
                this.textareaBlur = false;
                this.reply_add_click = false;
                this.reasizeData();
            }
            loading.dismiss();
        });
    }

    // 微信分享
    wxShare(data) {
        let img = this.greetDiv.nativeElement.querySelector('img');
        let description = this.greetDiv.nativeElement.innerText.replace(/\&nbsp;/g, '');
        let thumb = '';

        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        if (img) {
            thumb = img.src;
        }

        Wechat.share({
            message: {
                title: data.Title, // 标题
                description: description, // 简介
                thumb: thumb, //帖子图片
                mediaTagName: "TEST-TAG-001",
                messageExt: "这是第三方带的测试字段",
                messageAction: "<action>dotalist</action>",
                // media: "YOUR_MEDIA_OBJECT_HERE",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: "http://a1.hellowbs.com/openApp.html?Id=" + data.Id
                }
            },
            scene: Wechat.Scene.SESSION
        }, function () {
            // alert("Success");
        }, function (reason) {
            // alert("Failed: " + reason);
        });
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

}
