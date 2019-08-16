import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {MinePage} from "../pages/mine/mine";
import {LearningPage} from "../pages/learning/learning";
import {CoursePage} from "../pages/course/course";
import {MineModule} from "../pages/mine/mine.module";
import {ComponentsModule} from "../components/components.module";
import {LearningPageModule} from "../pages/learning/learning.module";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        TabsPage,
        CoursePage,
    ],
    imports: [
        BrowserModule,
        MineModule,
        LearningPageModule,
        IonicModule.forRoot(MyApp, {
            tabsHideOnSubPages: 'true',
            backButtonText: '',   //返回按钮显示中文
            statusbarPadding: false,
            iconModel: 'ios',   //icon显示图标为IOS版
            mode: 'ios',   //安卓和IOS的样式以IOS样式为准
            modalEnter: 'modal-slide-in',
            modalLeave: 'modal-slide-out',
            swipeBackEnabled: false
        }),
        ComponentsModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        CoursePage,
        TabsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
