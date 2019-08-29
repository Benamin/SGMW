import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MinePage} from "./mine";
import {MycollectionPage} from "./mycollection/mycollection";
import {MyCoursePage} from "./my-course/my-course";
import {NotificationPage} from "./notification/notification";
import {NavbarComponent} from "../../components/navbar/navbar";
import {ComponentsModule} from "../../components/components.module";
import {NotificationDetailPage} from "./notification-detail/notification-detail";

@NgModule({
    declarations: [
        MinePage,
        MycollectionPage,
        MyCoursePage,
        NotificationPage,
        NotificationDetailPage
    ],
    imports: [
        IonicPageModule.forChild(MinePage),
        ComponentsModule,
    ],
    entryComponents: [
        MycollectionPage,
        MyCoursePage,
        NotificationPage,
        NotificationDetailPage,
        NavbarComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class MineModule {
}
