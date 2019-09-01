import {Component, ViewChild} from '@angular/core';

import {HomePage} from '../home/home';
import {Events, NavController, Platform, Tabs} from "ionic-angular";
import {MinePage} from "../mine/mine";
import {LearningPage} from "../learning/learning";
import {CoursePage} from "../course/course";
import {BackButtonService} from "../../core/backButton.service";
import {LoginPage} from "../login/login";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('myTabs') myTabs: Tabs;

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
            root: CoursePage,
            tabTitle: '我的学习',
            tabIconOn: 'custom-serve-on',
            tabIconOff: 'custom-serve-off',
            index: 2
        },
        {
            root: MinePage,
            tabTitle: '个人中心',
            tabIconOn: 'custom-mine-on',
            tabIconOff: 'custom-mine-off',
            index: 3
        },
    ];

    tabsIndex;

    constructor(private platform: Platform, private backButtonService: BackButtonService,
                private events: Events,private nav: NavController) {
        this.platform.ready().then(() => {
            this.backButtonService.registerBackButtonAction(this.myTabs);
        });
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
