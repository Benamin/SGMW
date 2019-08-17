import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MinePage} from "./mine";
import {MycollectionPage} from "./mycollection/mycollection";
import {MyCoursePage} from "./my-course/my-course";
import {NotificationPage} from "./notification/notification";
import {NavbarComponent} from "../../components/navbar/navbar";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        MinePage,
        MycollectionPage,
        MyCoursePage,
        NotificationPage,
    ],
    imports: [
        IonicPageModule.forChild(MinePage),
        ComponentsModule,
    ],
    entryComponents: [
        MycollectionPage,
        MyCoursePage,
        NotificationPage,
        NavbarComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class MineModule {
}
