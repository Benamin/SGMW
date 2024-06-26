import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NavbarComponent} from './navbar/navbar';
import {IonicPageModule} from "ionic-angular";
import {ScrollTabsComponent} from './scroll-tabs/scroll-tabs';
import {CommentComponent} from './comment/comment';
import {CourseListComponent} from './course-list/course-list';
import {TreeListComponent} from './tree-list/tree-list';
import {QIndexComponent} from './q-index/q-index';
import {CheckCodeComponent} from './check-code/check-code';
import {UpdateAppComponent} from './update-app/update-app';
import {VideojsComponent} from "./videojs/videojs";
import {SelectTeacherComponent} from './select-teacher/select-teacher';
import {SearchSidebarComponent} from './search-sidebar/search-sidebar';
import {ForumListTimeComponent} from './forum-list-time/forum-list-time.component';
import {ImgPreviewComponent} from './img-preview/img-preview';
import {IframeFileComponent} from './iframe-file/iframe-file';
import {PipesModule} from "../pipes/pipes.module";
import {TodayRemindComponent} from './today-remind/today-remind.component';
import {TodayRemindMissionComponent} from './today-remind-mission/today-remind-mission.component';

import {PrivacyComponent} from './privacy/privacy';
import {CommentByCourseComponent} from './comment-by-course/comment-by-course';
import {EidtModalComponent} from './eidt-modal/eidt-modal.component';
import {UserAgreementComponent} from './user-agreement/user-agreement';
import {FloatVideoBoxComponent} from './float-video-box/float-video-box';
import {DayilySchoolComponent} from './dayily-school/dayily-school';
import {SubjectTreeComponent} from './subject-tree/subject-tree';
import {ClassmateComponent} from './classmate/classmate';
import {ShareWxComponent} from './share-wx/share-wx';
import {ThemeActivityComponent} from './theme-activity/theme-activity';
import {CommentStarComponent} from './comment-star/comment-star';


@NgModule({
    declarations: [
        CommentComponent,
        CommentComponent,
        NavbarComponent,
        ScrollTabsComponent,
        CourseListComponent,
        TreeListComponent,
        QIndexComponent,
        CheckCodeComponent,
        UpdateAppComponent,
        TodayRemindComponent,
        TodayRemindMissionComponent,
        VideojsComponent,
        SelectTeacherComponent,
        SearchSidebarComponent,
        ForumListTimeComponent,
        ImgPreviewComponent,
        IframeFileComponent,
        PrivacyComponent,
        CommentByCourseComponent,
        EidtModalComponent,
        UserAgreementComponent,
        FloatVideoBoxComponent,
        DayilySchoolComponent,
        SubjectTreeComponent,
        ClassmateComponent,
        ShareWxComponent,
        ThemeActivityComponent,
        CommentStarComponent,
    ],
    imports: [
        IonicPageModule,
        PipesModule
    ],
    exports: [
        CommentComponent,
        CommentComponent,
        NavbarComponent,
        ScrollTabsComponent,
        CourseListComponent,
        TreeListComponent,
        QIndexComponent,
        CheckCodeComponent,
        UpdateAppComponent,
        TodayRemindComponent,
        TodayRemindMissionComponent,
        VideojsComponent,
        SelectTeacherComponent,
        SearchSidebarComponent,
        ForumListTimeComponent,
        ImgPreviewComponent,
        IframeFileComponent,
        PrivacyComponent,
        CommentByCourseComponent,
        EidtModalComponent,
        UserAgreementComponent,
        FloatVideoBoxComponent,
        DayilySchoolComponent,
        SubjectTreeComponent,
        ClassmateComponent,
        ShareWxComponent,
        ThemeActivityComponent,
        CommentStarComponent,
    ],
    providers: [
        CommentComponent,
    ],
    entryComponents: [
        CommentComponent,
        NavbarComponent,
        ScrollTabsComponent,
        CourseListComponent,
        TreeListComponent,
        QIndexComponent,
        CheckCodeComponent,
        UpdateAppComponent,
        VideojsComponent,
        SelectTeacherComponent,
        SearchSidebarComponent,
        ForumListTimeComponent,
        ImgPreviewComponent,
        IframeFileComponent,
        PrivacyComponent,
        CommentByCourseComponent,
        EidtModalComponent,
        UserAgreementComponent,
        FloatVideoBoxComponent,
        DayilySchoolComponent,
        SubjectTreeComponent,
        ClassmateComponent,
        ShareWxComponent,
        CommentStarComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ComponentsModule {
}
