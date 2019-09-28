import {Component, ViewChild} from '@angular/core';

import {HomePage} from '../home/home';
import {Events, NavController, NavParams, Platform, Tabs} from "ionic-angular";
import {MinePage} from "../mine/mine";
import {LearningPage} from "../learning/learning";
import {CoursePage} from "../course/course";
import {BackButtonService} from "../../core/backButton.service";
import {LoginPage} from "../login/login";
import {TabService} from "../../core/tab.service";
import { ForumPage } from '../forum/forum.component';
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('myTabs') myTabs: Tabs;

    tabParams = {
        test:'test'
    };

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
        {
            root: CoursePage,
            tabTitle: '我的学习',
            tabIconOn: 'custom-serve-on',
            tabIconOff: 'custom-serve-off',
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

    tabsIndex;

    constructor(private platform: Platform, private backButtonService: BackButtonService,private params:NavParams,
                private events: Events,private nav: NavController,private tabSer:TabService) {
        this.platform.ready().then(() => {
            this.backButtonService.registerBackButtonAction(this.myTabs);
        });
        this.tabSer.tabChange.subscribe((value)=>{
            this.tabParams = value;
            console.log(this.tabParams);
            this.myTabs.select(value.index)
        })
        this.listenEvents();
    }

    onChange(e) {
        this.tabsIndex = e;
        this.myTabs.select(e);
    }

    listenEvents() {
        this.events.subscribe('toLogin', () => {
            this.nav.setRoot(LoginPage);
        });
    }
}
