import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LearningPage} from './learning';
import {ScrollTabsComponent} from "../../components/scroll-tabs/scroll-tabs";
import {CourseCommentPage} from "./course-comment/course-comment";
import {CourseDetailPage} from "./course-detail/course-detail";
import {ComponentsModule} from "../../components/components.module";
import {TeacherPage} from "./teacher/teacher";

@NgModule({
    declarations: [
        LearningPage,
        ScrollTabsComponent,
        CourseDetailPage,
        CourseCommentPage,
        TeacherPage,
    ],
    imports: [
        IonicPageModule.forChild(LearningPage),
        ComponentsModule,
    ],
    entryComponents: [
        ScrollTabsComponent,
        CourseCommentPage,
        CourseDetailPage,
        TeacherPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearningPageModule {
}
