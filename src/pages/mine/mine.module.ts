import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MinePage} from "./mine";
import {MycollectionPage} from "./mycollection/mycollection";
import {MyCoursePage} from "./my-course/my-course";
import {NotificationPage} from "./notification/notification";

@NgModule({
    declarations: [
        MinePage,
        MycollectionPage,
        MyCoursePage,
        NotificationPage
    ],
    imports: [
        IonicPageModule.forChild(MinePage),
    ],
    entryComponents: [
        MycollectionPage,
        MyCoursePage,
        NotificationPage
    ]
})
export class MineModule {
}
