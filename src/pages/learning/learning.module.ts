import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LearningPage} from './learning';
import {CourseCommentPage} from "./course-comment/course-comment";
import {CourseDetailPage} from "./course-detail/course-detail";
import {ComponentsModule} from "../../components/components.module";
import {TeacherPage} from "./teacher/teacher";
import {ViewFilePage} from "./view-file/view-file";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {PipesModule} from "../../pipes/pipes.module";
import {RecordPage} from "./record/record";
import {ChapterPage} from "./chapter/chapter";
import {CommentListPage} from "./comment-list/comment-list";
import {FocusCoursePage} from "./focus-course/focus-course";
import {InnerCoursePage} from "./inner-course/inner-course";
import {CourseFilePage} from "./course-file/course-file";

@NgModule({
    declarations: [
        LearningPage,
        CourseDetailPage,
        CourseCommentPage,
        TeacherPage,
        ViewFilePage,
        RecordPage,
        ChapterPage,
        CommentListPage,
        FocusCoursePage,
        InnerCoursePage,
        CourseFilePage,
    ],
    imports: [
        PdfViewerModule,
        PipesModule,
        IonicPageModule.forChild(LearningPage),
        ComponentsModule,
    ],
    entryComponents: [
        CourseCommentPage,
        CourseDetailPage,
        TeacherPage,
        ViewFilePage,
        RecordPage,
        ChapterPage,
        CommentListPage,
        FocusCoursePage,
        InnerCoursePage,
        CourseFilePage,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearningPageModule {
}
