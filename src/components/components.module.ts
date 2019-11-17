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
import {ImgPreviewComponent} from './img-preview/img-preview';


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
        VideojsComponent,
        SelectTeacherComponent,
        SearchSidebarComponent,
        ImgPreviewComponent,
    ],
    imports: [
        IonicPageModule
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
        VideojsComponent,
        SelectTeacherComponent,
        SearchSidebarComponent,
        ImgPreviewComponent,
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
        ImgPreviewComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ComponentsModule {
}
