import {Component} from '@angular/core';
import {
    AlertController,
    App,
    Events,
    IonicPage,
    NavController,
    NavParams,
    Platform,
    ModalController
} from 'ionic-angular';
import {MyCoursePage} from "./my-course/my-course";
import {MycollectionPage} from "./mycollection/mycollection";
import {NotificationPage} from "./notification/notification";
import {AppService} from "../../app/app.service";
import {ExamPage} from "./exam/exam";
import {Storage} from "@ionic/storage";
import {MineService} from "./mine.service";
import {timer} from "rxjs/observable/timer";
import {LoginService} from "../login/login.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {UpdateAppPage} from "./update-app/update-app";
import {AppVersion} from "@ionic-native/app-version";
import {LogoutService} from "../../secret/logout.service";
import {CommonService} from "../../core/common.service";
import {MyForumComponent} from "./my-forum/my-forum.component";
import {MyFollowsComponent} from './my-follows/my-follows.component';
import {MyThumbsUpComponent} from './my-thumbs-up/my-thumbs-up.component';
import {MedalComponent} from './medal/medal.component';
import {MyFilePage} from "./my-file/my-file";
import {ForumService} from "../forum/forum.service";
import {LogService} from "../../service/log.service";
import {IntegralComponent} from "./Integral/Integral.component";
import {MyShortVideoPage} from "./my-short-video/my-short-video";

import {HomeService} from "../home/home.service";
import {RuleModalPage} from "../home/advanced/rule-modal/rule-modal";
import {IntegralPage} from "../integral/integral";

import {ChooseImageProvider} from "../../providers/choose-image/choose-image";

@Component({
    selector: 'page-mine',
    templateUrl: 'mine.html',
})
export class MinePage {
    mineInfo;
    userInfo;
    number = <any>{};
    version;
    CurrentRole;
    appVersionInfo = {
        UpdateTips: false,
        AppUrl: '',
        UpdateText: '',
    };

    RoleName;  //角色名称
    LoginType: '-';
    isLabel;  //岗位认证等级

    constructor(public navCtrl: NavController, public navParams: NavParams, private logoutSer: LogoutService,
                private mineSer: MineService, private events: Events, private appVersion: AppVersion,
                private loginSer: LoginService, private inAppBrowser: InAppBrowser,
                private platform: Platform, private alertCtrl: AlertController,
                private logSer: LogService,
                private forumServe: ForumService,
                private homeSer: HomeService,
                private commonSer: CommonService,
                private modalCtrl: ModalController,
                private appSer: AppService, private app: App,
                public chooseImage: ChooseImageProvider,
                private storage: Storage) {
        //获取个人信息
        this.storage.get('user').then(value => {
            console.log(value);
            this.mineInfo = value;
        });
        this.storage.get('LoginType').then(value => {
            this.LoginType = value || "-";
        });

        this.storage.get('CurrentRole').then(val => {
            this.CurrentRole = val;
            this.RoleName = val.CurrentRoleName;
        });
    }

    getDataNum (){
        this.mineSer.GetCourseCount().subscribe(
            (res) => {
                Object.assign(this.number, { CourseCount: res.data });
            }
        );
        this.mineSer.GetNowMonthIntegralData().subscribe(
            (res) => {
                Object.assign(this.number, { NowMonthIntegralData: res.data });
            }
        );
        this.mineSer.GetPostTalkData().subscribe(
            (res) => {
                Object.assign(this.number, { PostTalkData: res.data });
            }
        );
    }

    changeHeadPhoto() {
        // 模拟上传返回测试 start
        // console.log(this.mineInfo)
        // let photo = 'https://devstorgec.blob.core.chinacloudapi.cn/picture/下载2019100910085720200224112628.jpeg'
        // let obj = this.mineInfo
        // obj.HeadPhoto = photo;
        // this.mineSer.updateUser(obj).subscribe(
        //     (res2) => {
        //         this.mineInfo.HeadPhoto = photo;
        //         this.commonSer.toast('头像更换成功！');
        //     }
        // )
        // 模拟上传返回测试 end

        this.chooseImage.takePic((data) => {

            // 上传成功后 把图片传给后台存储更换 头像（等接口）
            if (!this.mineInfo) return;
            let photo = data[data.length-1]
            let obj = this.mineInfo
            obj.HeadPhoto = photo;
            this.mineSer.updateUser(obj).subscribe(
                (res2) => {
                    this.mineInfo.HeadPhoto = photo;
                    this.commonSer.toast('头像更换成功！');
                })
        })

    }

    ionViewDidEnter() {
        // 发布 自定义事件
        this.events.publish('messageTabBadge:change', {});
        this.logSer.visitLog('grzx');
        this.getVersion();
        this.getUserInfo();

        this.getDataNum();
        // this.forumServe.myfavorites({"PageIndex": 1, "PageSize": 10}).subscribe((res1: any) => {
            // this.mineSer.GetMyProductCountInfo().subscribe(
            //     (res2) => {
            //         res2.data.CollectionCount = res1.data.TotalItems + res2.data.CollectionCount;
            //         Object.assign(this.number, res2.data);
            //     }
            // )
        // });
        const data = {
            "GetMyList": 1,//是否获取我的短视频列表1代表我得，0代表所有
            "Page": 1,
            EncodeState: 0,
            "PageSize": 1,
            Title: "",
        }
        this.homeSer.GetVideoLists(data).subscribe(
            (res) => {
                if (res.data) {
                    const videoNum = res.data.TotalCount;
                    Object.assign(this.number, {videoNum: videoNum});
                }
            }
        )

        this.mineSer.GetApproveMessage().subscribe(
            (res) => {
                if (res.data) {
                    this.isLabel = res.data.Lable;
                }
            }
        )
    }

    //获取用户积分和勋章
    getUserInfo() {
        this.mineSer.GetMyInfo().subscribe(
            (res) => {
                this.userInfo = res.data ? res.data : {};
                let flag = false;
                this.RoleNames = this.userInfo['Roles'] ? this.userInfo['Roles'] : [];
                this.RoleNames.forEach(e => {
                    if (e.RoleName == this.CurrentRole.CurrentRoleName) {
                        flag = true;
                    }
                })
                if (!flag) {
                    this.RoleNames.push({
                        RoleName: this.CurrentRole.CurrentRoleName,
                        RoleID: this.CurrentRole.CurrentRoleID,
                    });
                }
            }
        )
    }

    //检测当前版本
    getVersion() {
        //检测是否需要更新
        this.appVersion.getVersionNumber().then((version: string) => {
            this.version = version;
        }).catch(err => {
            console.log(err);
        });
    }

    doRefresh(e) {
        this.getDataNum();
        this.getUserInfo();
        timer(1000).subscribe((res) => {
            e.complete()
        });
    }

    //我的课程
    goToCourse() {
        this.navCtrl.push(MyCoursePage);
    }

    //我的收藏
    goToCollection() {
        this.navCtrl.push(MycollectionPage);
    }

    //我的作业
    goExam() {
        this.navCtrl.push(ExamPage);
    }

    //通知中心
    goToNoti() {
        this.navCtrl.push(NotificationPage);
    }

    // 设置勋章
    goMedal() {
        this.navCtrl.push(MedalComponent);
    }

    //下载管理
    goToFile() {
        this.navCtrl.push(MyFilePage);
    }

    //意见反馈
    openUrl() {
        this.inAppBrowser.create('https://jinshuju.net/f/WVrljv', '_system');
    }

    //后台退出
    logoutApp() {
        this.logoutSer.logout();
    }

    // 我的动态
    goMyForum() {
        this.navCtrl.push(MyForumComponent);
    }

    // 我的关注
    goMyFollowsComponent() {
        this.navCtrl.push(MyFollowsComponent);
    }

    //我的积分
    goMyIntegral() {
        this.navCtrl.push(IntegralPage);
    }

    // 我的点赞
    goMyThumbsUpComponent() {
        this.navCtrl.push(MyThumbsUpComponent);
    }

    // 积分章程
    goIntegral() {
        this.navCtrl.push(IntegralComponent);
    }

    // 我的视频
    goMyshortVideo() {
        this.navCtrl.push(MyShortVideoPage);
    }

    //检测版本
    checkVersion() {
        let versionCode;
        let platform;
        if (this.platform.is('ios')) platform = 'IOS';
        if (this.platform.is('android')) platform = 'android';
        this.appVersion.getVersionNumber().then((version: string) => {
            versionCode = version.split('.').join('');
            const data = {
                code: platform
            };
            this.loginSer.GetAppVersionByCode(data).subscribe(
                (res) => {
                    const onlineVersion = res.data.AppVersion.split('.').join('');
                    if (versionCode < onlineVersion) {
                        this.appVersionInfo.UpdateTips = true;
                        this.appVersionInfo.AppUrl = res.data.AppUrl;
                        this.appVersionInfo.UpdateText = res.data.UpdateText;
                    } else {
                        this.navCtrl.push(UpdateAppPage);
                    }
                }
            )
        }).catch(err => {
            console.log(err);
        });
    }

    checkVersion1() {
        const data = {
            code: "android"
        };
        this.loginSer.GetAppVersionByCode(data).subscribe(
            (res) => {
                const onlineVersion = res.data.AppVersion.split('.').join('');
                this.appVersionInfo.UpdateTips = true;
                this.appVersionInfo.AppUrl = res.data.AppUrl;
                this.appVersionInfo.UpdateText = res.data.UpdateText;
            }
        )
    }

    RoleNames = [];
    RoleID = '';

    // 切换角色
    switchUser() {
        this.RoleNames.forEach(e => {
            if (e.RoleName == this.RoleName) {
                this.storage.set('RoleID', e.RoleID);
            }
        })
        this.storage.set('RoleName', this.RoleName);
        this.events.publish('RoleID');  //广播切换角色事件
    }

    showAlert() {
        const msg = `
            根据菱菱助手备案的岗位，匹配骏菱学社中相应的岗位认证路径并显示最高级别的岗位名称。例如，在菱菱助手中备案为销售顾问，则显示销售顾问、资深销售顾问等；备案岗位为店长，则显示店长、资深店长等。<br> 
            如果没有岗位认证等级的显示，则可能是以下情况：<br>
            1、菱菱助手中备案岗位字段为空，请查看菱菱助手中的备案岗位；<br>
            2、备案岗位在骏菱学社无对应的认证路径`;

        let modalData = {
            leveltype: '岗位认证等级显示规则',
            title: '',
            content: msg
        }
        let modal = this.modalCtrl.create(RuleModalPage, {ruleData: modalData});
        modal.onDidDismiss((data) => {
            if (data) {
                console.log('关闭modal：', data)
            }
        })
        modal.present();
    }

}
