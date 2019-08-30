import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from "./home";
import {SearchPage} from "./search/search";
import {GoodTeacherPage} from "./good-teacher/good-teacher";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        HomePage,
        SearchPage,
        GoodTeacherPage
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        ComponentsModule,
    ],
    entryComponents: [
        SearchPage,
        GoodTeacherPage
    ]
})
export class HomeModule {
}
