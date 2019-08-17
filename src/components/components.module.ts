import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NavbarComponent} from './navbar/navbar';
import {IonicPageModule} from "ionic-angular";
import {ScrollTabsComponent} from './scroll-tabs/scroll-tabs';
import {CommentComponent} from './comment/comment';
import { CourseListComponent } from './course-list/course-list';

@NgModule({
    declarations: [
        CommentComponent,
        CommentComponent,
        NavbarComponent,
        ScrollTabsComponent,
    CourseListComponent,
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
    ],
    providers: [
        CommentComponent,
    ],
    entryComponents: [
        CommentComponent,
        NavbarComponent,
        ScrollTabsComponent,
        CourseListComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ComponentsModule {
}
