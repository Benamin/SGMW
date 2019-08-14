import {Component, ViewChild} from '@angular/core';

import {HomePage} from '../home/home';
import {Tabs} from "ionic-angular";
import {MinePage} from "../mine/mine";
import {LearningPage} from "../learning/learning";
import {CoursePage} from "../course/course";

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
      tabTitle: '在线学习',
      tabIconOn: 'custom-discover-on',
      tabIconOff: 'custom-discover-off',
      index: 1
    },
    {
      root: CoursePage,
      tabTitle: '我的课程',
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

  constructor() {

  }

  onChange(e) {
    this.tabsIndex = e;
    this.myTabs.select(e);
  }
}
