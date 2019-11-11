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

@NgModule({
    declarations: [
        LearningPage,
        CourseDetailPage,
        CourseCommentPage,
        TeacherPage,
        ViewFilePage,
        RecordPage,
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
        RecordPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearningPageModule {
}
