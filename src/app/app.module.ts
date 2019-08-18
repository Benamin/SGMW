import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {CoursePage} from "../pages/course/course";
import {MineModule} from "../pages/mine/mine.module";
import {ComponentsModule} from "../components/components.module";
import {LearningPageModule} from "../pages/learning/learning.module";
import {Keyboard} from "@ionic-native/keyboard";
import {CoursePageModule} from "../pages/course/course.module";
import {LoginPageModule} from "../pages/login/login.module";
import {HomeModule} from "../pages/home/home.module";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {InterceptorProvider} from "../core/auth.interceptor";
import {LoginService} from "../pages/login/login.service";
import {HomeService} from "../pages/home/home.service";
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
    declarations: [
        MyApp,
        TabsPage,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        LoginPageModule,
        MineModule,
        LearningPageModule,
        CoursePageModule,
        HomeModule,
        IonicStorageModule.forRoot(),
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
        Keyboard,
        LoginService,
        HomeService,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true},
    ]
})
export class AppModule {
}
