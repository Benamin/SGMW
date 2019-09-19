import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LearningPage} from './learning';
import {CourseCommentPage} from "./course-comment/course-comment";
import {CourseDetailPage} from "./course-detail/course-detail";
import {ComponentsModule} from "../../components/components.module";
import {TeacherPage} from "./teacher/teacher";
import {ViewFilePage} from "./view-file/view-file";
import {PdfViewerModule} from "ng2-pdf-viewer";

@NgModule({
    declarations: [
        LearningPage,
        CourseDetailPage,
        CourseCommentPage,
        TeacherPage,
        ViewFilePage,
    ],
    imports: [
        PdfViewerModule,
        IonicPageModule.forChild(LearningPage),
        ComponentsModule,
    ],
    entryComponents: [
        CourseCommentPage,
        CourseDetailPage,
        TeacherPage,
        ViewFilePage,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearningPageModule {
}
