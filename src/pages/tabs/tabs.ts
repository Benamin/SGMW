import {Component, ViewChild} from '@angular/core';

import {HomePage} from '../home/home';
import {Events, LoadingController, ModalController, NavController, NavParams, Platform, Tabs} from "ionic-angular";
import {MinePage} from "../mine/mine";
import {LearningPage} from "../learning/learning";
import {CoursePage} from "../course/course";
import {LoginPage} from "../login/login";
import {TabService} from "../../core/tab.service";
import {ForumPage} from '../forum/forum.component';
import {NoDevPage} from "../home/no-dev/no-dev";
import {Gesture} from "ionic-angular";
import {TestCenterPage} from "../home/test/test-center/test-center";
import {StudyPlanPage} from "../home/study-plan/study-plan";
import {GlobalData} from "../../core/GlobleData";
import {LoginService} from "../login/login.service";
import {CommonService} from "../../core/common.service";
import {Storage} from "@ionic/storage";
import {PrivacyComponent} from "../../components/privacy/privacy";
import {VideoListsPage} from "../home/short-video/video-lists/video-lists";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('myTabs') myTabs: Tabs;

    tabParams = {
        test: 'test'
    };

    userInfo;
    userInfoByCardNo;

    tabRoots = [
        {
            root: HomePage,
            tabTitle: '首页',
            tabIconOn: 'custom-home-on',
            tabIconOff: 'custom-home-off',
            index: 0
        },
        {
            root: LearningPage,
            tabTitle: '在线课程',
            tabIconOn: 'custom-discover-on',
            tabIconOff: 'custom-discover-off',
            index: 1
        },
        {
            root: ForumPage,
            tabTitle: '论坛',
            tabIconOn: 'custom-forum-on',
            tabIconOff: 'custom-forum-off',
            index: 3
        },
        // {
        //     root: CoursePage,
        //     tabTitle: '我的学习',
        //     tabIconOn: 'custom-serve-on',
        //     tabIconOff: 'custom-serve-off',
        //     index: 4
        // },
        {
            root: VideoListsPage,
            tabTitle: '视频',
            tabIconOn: 'custom-video-on',
            tabIconOff: 'custom-video-off',
            index: 4
        },
        {
            root: MinePage,
            tabTitle: '个人中心',
            tabIconOn: 'custom-mine-on',
            tabIconOff: 'custom-mine-off',
            index: 5
        },
    ];

    regCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
    MobilePhone;
    CardNo;
    checkBox;
    tabsIndex;

    inputType;

    constructor(private platform: Platform, private params: NavParams,
                private global: GlobalData,
                private loginSer: LoginService,
                private storage: Storage,
                private modalCtrl: ModalController,
                private loading: LoadingController,
                private commonSer: CommonService,
                private events: Events, private nav: NavController, private tabSer: TabService) {
        this.storage.get('user').then(value => {
            console.log(value);
            if (value && !value.MainUserID) {
                this.getUserInfo();
                return
            }
            if (value && value.MainUserID && value.MainUserID === '00000000-0000-0000-0000-000000000000') {
                this.userInfo = value;
                this.inputType = 'submit';
            }
        });
        this.tabSer.tabChange.subscribe((value) => {
            this.tabParams = value;
            this.myTabs.select(value.index)
        })
        this.listenEvents();
    }

    getUserInfo() {
        this.loginSer.GetUserInfoByUPN().subscribe(
            (res) => {
                if (res.data) {
                    this.storage.set('user', res.data);
                    if (res.data.MainUserID && res.data.MainUserID === '00000000-0000-0000-0000-000000000000') {
                        this.userInfo = res.data;
                        this.inputType = 'submit';
                    }
                }
            })
    }

    onChange(e) {
        this.tabsIndex = e;
        this.myTabs.select(e);
    }

    // this.navCtrl.push(NoDevPage, {title: title});
    listenEvents() {
        this.events.subscribe('toLogin', () => {
            this.nav.setRoot(LoginPage);
        });
        this.events.subscribe('jPush', (type) => {
            if (!this.global.JpushType) return;
            this.global.JpushType = null;
            if (type == 3) {
                this.nav.push(StudyPlanPage)
            } else if (type == 4) {
                this.nav.push(TestCenterPage)
            }
        })
    }

    //打开隐私协议
    openPrivacy() {
        let modal = this.modalCtrl.create(PrivacyComponent);
        modal.present();
    }

    //下一步
    next() {
        if (!this.checkBox) {
            this.commonSer.toast('请阅读并同意隐私协议');
            return;
        }
        if (!this.CardNo || !this.MobilePhone) {
            this.commonSer.toast('请输入完整信息');
            return;
        }
        if (!this.regCard.test(this.CardNo)) {
            this.commonSer.toast('身份证不合法!');
            return
        }
        if (!this.regPhone.test(this.MobilePhone)) {
            this.commonSer.toast('手机号码有误!');
            return
        }
        const data = {
            cardNo: this.CardNo
        };
        const loading = this.loading.create({
            content: '查询身份证号中...'
        });
        loading.present();
        this.loginSer.GetUserByCardNo(data).subscribe(
            (res) => {
                this.userInfoByCardNo = res.data;
                this.inputType = 'confirm';
                loading.dismiss();
            }
        )
    }

    //提交信息
    submitInfo() {
        const data = {
            LoginUserId: this.userInfo.LoginUserId,
            MobilePhone: this.MobilePhone,
            CardNo: this.CardNo
        };
        this.loginSer.UpdateUserByCardNo(data).subscribe(
            (res) => {
                if (res.data) {
                    this.storage.set('user', res.data);
                    this.getMyInfo();
                }
            }
        )
    }

    getMyInfo() {
        this.loginSer.GetMyInfo().subscribe(res2 => {
            if (res2.data) {
                this.commonSer.toast('保存身份信息成功');
                this.inputType = null;
                this.storage.set('CurrentRole', {
                    CurrentRoleID: res2.data.CurrentRoleID,
                    CurrentRoleName: res2.data.CurrentRoleNames
                });
                this.storage.set('RoleID', res2.data.CurrentRoleID);
                this.events.publish('RoleID');
            }
        })
    }
}
