import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CoursePage} from './course';
import {NavbarComponent} from "../../components/navbar/navbar";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        CoursePage,
    ],
    imports: [
        IonicPageModule.forChild(CoursePage),
        ComponentsModule,
    ],
    entryComponents: [
    ],
    schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class CoursePageModule {
}
