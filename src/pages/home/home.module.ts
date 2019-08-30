import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from "./home";
import {SearchPage} from "./search/search";
import {GoodTeacherPage} from "./good-teacher/good-teacher";

@NgModule({
    declarations: [
        HomePage,
        SearchPage,
        GoodTeacherPage
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
    ],
    entryComponents: [
        SearchPage,
        GoodTeacherPage
    ]
})
export class HomeModule {
}
