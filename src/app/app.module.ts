import {NgModule, ErrorHandler, ElementRef} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, Config, NavParams} from 'ionic-angular';
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
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {CommonService} from "../core/common.service";
import {HTTP} from "@ionic-native/http";
import {LearnService} from "../pages/learning/learn.service";
import {AppService} from "./app.service";
import {DataFormatService} from "../core/dataFormat.service";
import {EmitService} from "../core/emit.service";
import {FileOpener} from "@ionic-native/file-opener";
import {File} from "@ionic-native/file";
import {FileService} from "../core/file.service";
import {MineService} from "../pages/mine/mine.service";
import {ModalFromRightEnter, ModalFromRightLeave, ModalScaleEnter, ModalScaleLeave} from "./modal-transitions";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {TabService} from "../core/tab.service";
import {AppVersion} from "@ionic-native/app-version";
import {LogoutService} from "../secret/logout.service";
import {GetRequestService} from "../secret/getRequest.service";

import {ConsultationPageModule} from '../pages/consultation/consultation.module';
import {ConsultationPage} from '../pages/consultation/consultation';
import {NumberOne} from '../pages/number-one/number-one.component';
import {NumberOneModule} from '../pages/number-one/number-one.module';
import {AppUpdateService} from "../core/appUpdate.service";
import {ForumModule} from '../pages/forum/forum.module';
import {RankingModule} from '../pages/ranking/ranking.module';
import {RankingComponent} from '../pages/ranking/ranking.component';
import {ForumPage} from '../pages/forum/forum.component';
import {DatePipe} from "@angular/common";
import {RandomWordService} from "../secret/randomWord.service";
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {GlobalData} from "../core/GlobleData";
import {PhotoLibrary} from "@ionic-native/photo-library";
import {DownloadFileProvider} from '../providers/download-file/download-file';
import {LogService} from "../service/log.service";
import {Camera} from "@ionic-native/camera";
import {JPush} from "@jiguang-ionic/jpush";
import {JpushUtil} from "../core/jPush.util";
import {MediaCapture} from '@ionic-native/media-capture';
import {ShortVideoProvider} from '../providers/short-video/short-video';
import {ChooseImageProvider} from '../providers/choose-image/choose-image';
import {DocumentViewer} from '@ionic-native/document-viewer';
import {IntegralPageModule} from "../pages/integral/integral.module";
import {IntegralService} from "../pages/integral/integral.service";
import {Device} from "@ionic-native/device";
import {Badge} from "@ionic-native/badge";

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
        IntegralPageModule,
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
            },
        ),
        ComponentsModule,
        ConsultationPageModule,
        NumberOneModule,
        ForumModule,
        RankingModule,
    ],
    bootstrap: [IonicApp],
    entryComponents:
        [
            MyApp,
            HomePage,
            CoursePage,
            TabsPage,
            ConsultationPage,
            NumberOne,
            ForumPage,
            RankingComponent
        ],
    providers:
        [
            StatusBar,
            SplashScreen,
            Keyboard,
            FileOpener,
            InAppBrowser,
            AppVersion,
            File,
            Device,
            FileTransfer,
            MobileAccessibility,
            ScreenOrientation,
            DocumentViewer,
            PhotoLibrary,
            TabService,
            LoginService,
            HomeService,
            CommonService,
            LearnService,
            MineService,
            IntegralService,
            HTTP,
            Badge,
            AppService,
            DataFormatService,
            EmitService,
            FileService,
            LogoutService,
            GetRequestService,
            AppUpdateService,
            DatePipe,
            RandomWordService,
            GlobalData,
            LogService,
            Camera,
            JPush,
            JpushUtil,
            MediaCapture,
            AndroidPermissions,
            {provide: ErrorHandler, useClass: IonicErrorHandler},
            {
                provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true,
            },
            DownloadFileProvider,
            ShortVideoProvider,
            ChooseImageProvider],

})

export class AppModule {
    constructor(public config: Config) {
        this.setCustomTransitions();
    }

    private setCustomTransitions() {
        this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
        this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
        this.config.setTransition('modal-scale-enter', ModalScaleEnter);
        this.config.setTransition('modal-scale-leave', ModalScaleLeave);
    }
}
