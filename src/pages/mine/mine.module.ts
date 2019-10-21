import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MinePage} from "./mine";
import {MycollectionPage} from "./mycollection/mycollection";
import {MyCoursePage} from "./my-course/my-course";
import {NotificationPage} from "./notification/notification";
import {NavbarComponent} from "../../components/navbar/navbar";
import {ComponentsModule} from "../../components/components.module";
import {NotificationDetailPage} from "./notification-detail/notification-detail";
import {ExamPage} from "./exam/exam";
import {DoExamPage} from "./do-exam/do-exam";
import {LookExamPage} from "./look-exam/look-exam";
import {UpdateAppPage} from "./update-app/update-app";
import {MyForumComponent} from "./my-forum/my-forum.component";
import {MyThumbsUpComponent} from './my-thumbs-up/my-thumbs-up.component';
import {MyFollowsComponent} from './my-follows/my-follows.component';
import {ForumService} from '../forum/forum.service';
import {MedalComponent} from './medal/medal.component';


@NgModule({
    declarations: [
        MinePage,
        MycollectionPage,
        MyCoursePage,
        NotificationPage,
        NotificationDetailPage,
        ExamPage,
        DoExamPage,
        LookExamPage,
        UpdateAppPage,
        MyForumComponent,
        MyThumbsUpComponent,
        MyFollowsComponent,
        MedalComponent
    ],
    imports: [
        IonicPageModule.forChild(MinePage),
        ComponentsModule,
    ],
    providers:[ForumService],
    entryComponents: [
        MycollectionPage,
        MyCoursePage,
        NotificationPage,
        NotificationDetailPage,
        NavbarComponent,
        ExamPage,
        DoExamPage,
        LookExamPage,
        UpdateAppPage,
        MyForumComponent,
        MyThumbsUpComponent,
        MyFollowsComponent,
        MedalComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class MineModule {
}
