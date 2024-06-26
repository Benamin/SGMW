import {Component, ViewChild} from '@angular/core';

import {HomePage} from '../home/home';
import {Events, LoadingController, ModalController, NavController, NavParams, Platform, Tabs} from "ionic-angular";
import {MinePage} from "../mine/mine";
import {LoginPage} from "../login/login";
import {TabService} from "../../core/tab.service";
import {ForumPage} from '../forum/forum.component';
import {TestCenterPage} from "../home/test/test-center/test-center";
import {StudyPlanPage} from "../home/study-plan/study-plan";
import {GlobalData} from "../../core/GlobleData";
import {LoginService} from "../login/login.service";
import {CommonService} from "../../core/common.service";
import {MineService} from "../mine/mine.service";
import {Storage} from "@ionic/storage";
import {PrivacyComponent} from "../../components/privacy/privacy";
import {VideoListsPage} from "../home/short-video/video-lists/video-lists";
import {CourseTypePage} from "../learning/course-type/course-type";
import {PostsContentComponent} from "../forum/posts-content/posts-content.component";
import {ThemeActivityPage} from "../home/theme-activity/theme-activity";
import {CourseDetailPage} from "../learning/course-detail/course-detail";
import {NotificationPage} from "../mine/notification/notification";
import {EditPage} from "../home/competition/edit/edit";
import {InformationDownloadPage} from "../home/information-download/information-download";

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
    tabBadgeNum = 0

    tabRoots = [
        {
            root: HomePage,
            tabTitle: '首页',
            tabIconOn: 'custom-tab1-on',
            tabIconOff: 'custom-tab1-off',
            index: 0
        },
        {
            root: CourseTypePage,
            tabTitle: '课程',
            tabIconOn: 'custom-tab2-on',
            tabIconOff: 'custom-tab2-off',
            index: 1
        },
        {
            root: ForumPage,
            tabTitle: '动态',
            tabIconOn: 'custom-tab3-on',
            tabIconOff: 'custom-tab3-off',
            index: 3
        },
        {
            root: NotificationPage,
            tabTitle: '消息',
            tabIconOn: 'custom-tab4-on',
            tabIconOff: 'custom-tab4-off',
            index: 4
        },
        {
            root: MinePage,
            tabTitle: '我的',
            tabIconOn: 'custom-tab5-on',
            tabIconOff: 'custom-tab5-off',
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

    loading;
    disBtn = true;


    constructor(private platform: Platform, private params: NavParams,
                private global: GlobalData,
                private loginSer: LoginService,
                private storage: Storage,
                private modalCtrl: ModalController,
                private loadCtrl: LoadingController,
                private commonSer: CommonService,
                private mineSer: MineService,
                private events: Events, private nav: NavController, private tabSer: TabService) {

        this.storage.get('user').then(value => {
            if (value && value.MainUserID) {
                this.getUserInfo();
                return
            }
            if ((value && value.MainUserID && value.MainUserID === '00000000-0000-0000-0000-000000000000')) {
                this.getUserInfo();
            }
        });

        //继续播放时间m
        this.storage.get("currentTime").then((value: any) => {
            if (!value) {
                const arr = new Array(10);
                this.storage.set('currentTime', arr);
            }
        })

        this.tabSer.tabChange.subscribe((value) => {
            this.tabParams = value;
            this.myTabs.select(value.index);

        });
        this.listenEvents();
    }

    getUserInfo() {
        this.loginSer.GetUserInfoByUPN().subscribe(
            (res) => {
                if (res.data) {
                    if (!res.data.LoginUserId || res.data.LoginUserId === '00000000-0000-0000-0000-000000000000') {
                        res.data.LoginUserId = res.data.UserId;
                    }
                    this.loginSer.GetUserByLoginId({loginUserId: res.data.LoginUserId}).subscribe(
                        (res) => {
                            this.storage.set('user', res.data);
                            if ((res.data && res.data.MainUserID && res.data.MainUserID === '00000000-0000-0000-0000-000000000000')) {
                                this.userInfo = res.data;
                                if (res.data.CardNo) this.CardNo = res.data.CardNo;
                                this.inputType = 'submit';
                            }
                        }
                    );
                }
            })
    }

    onChange(e) {
        this.tabsIndex = e;
        this.myTabs.select(e);
    }

    /**
     * 推送跳转
     */
    listenEvents() {
        // 消息订阅
        this.events.subscribe('messageTabBadge:change', (tabBadgeNum) => {
            // console.log(66666, tabBadgeNum)
            this.getNew();
        });
        // 推出订阅
        this.events.subscribe('toLogin', () => {
            this.nav.setRoot(LoginPage);
        });
        //推送订阅
        this.events.subscribe('jPush', (type) => {
            if (!this.global.JpushType) return;
            this.global.JpushType = null;
            switch (type.sgmwType) {
                case "2":  //系统通知
                    break;
                case "3":  //培训通知
                    this.nav.push(StudyPlanPage)
                    break;
                case "4":  //考试通知
                    this.nav.push(TestCenterPage)
                    break;
                case "5":  //课程通知
                    this.nav.push(CourseDetailPage, {id: type.Id, StructureType: "1"});
                    break;
                case "6":  //主题活动
                    this.nav.push(ThemeActivityPage, {Id: type.Id});
                    break;
                case "22":
                    this.nav.push(PostsContentComponent, {data: {Id: type.Id, TopicPlateId: "", Name: ""}});
                    break;
                case "30":
                    this.nav.push(PostsContentComponent, {data: {Id: type.Id, TopicPlateId: "", Name: ""}});
                    break;
                case "31":
                    this.nav.push(CourseDetailPage, {id: type.Id, StructureType: 2});
                    break;
                case "32":
                    this.nav.push(CourseDetailPage, {id: type.Id, StructureType: 2});
                    break;
                case "33":
                    this.nav.push(PostsContentComponent, {data: {Id: type.Id, TopicPlateId: "", Name: ""}});
                    break;
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
        const loading = this.loadCtrl.create({
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
        if (!this.disBtn) {
            return
        }
        this.loading = this.loadCtrl.create({
            content: '绑定中...'
        });
        this.loading.present();
        const data = {
            LoginUserId: this.userInfo.LoginUserID,
            MobilePhone: this.MobilePhone,
            CardNo: this.CardNo
        };
        this.disBtn = false;
        this.loginSer.UpdateUserByCardNo(data).subscribe(
            (res) => {
                if (res.data) {
                    this.storage.set('user', res.data);
                    this.getMyInfo();
                } else {
                    this.loading.dismiss();
                    this.commonSer.toast(res.message);
                }
            }
        )
    }

    getMyInfo() {
        this.loginSer.GetMyInfo().subscribe(res2 => {
            this.disBtn = true;
            if (res2.data) {
                this.commonSer.toast('保存身份信息成功');
                this.inputType = null;
                this.storage.set('CurrentRole', {
                    CurrentRoleID: res2.data.CurrentRoleID,
                    CurrentRoleName: res2.data.CurrentRoleNames
                });
                this.storage.set('RoleID', res2.data.CurrentRoleID);
                this.events.publish('RoleID');
            } else {
                this.commonSer.toast(res2.message);
            }
            this.loading.dismiss();
        })
    }

    //重新登录
    resetLogin() {
        this.storage.clear();
        this.nav.setRoot(LoginPage);
    }

    //查询消息
    getNew() {
        const data = {
            "Type": 0,
            "Page": 1,
            "PageSize": 99,
        };
        this.mineSer.GetUnReadUserNewsList(data).subscribe(
            (res) => {
                if (res.data.NewsList) {
                    res.data.NewsList.length > 99 ? this.tabBadgeNum = 99 : this.tabBadgeNum = res.data.NewsList.length;
                }
            }
        )
    }
}
