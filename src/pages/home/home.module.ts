import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from "./home";
import {SearchPage} from "./search/search";
import {GoodTeacherPage} from "./good-teacher/good-teacher";
import {ComponentsModule} from "../../components/components.module";
import {NoDevPage} from "./no-dev/no-dev";
import {TestCenterPage} from "./test-center/test-center";
import {DoTestPage} from "./do-test/do-test";
import {LookTestPage} from "./look-test/look-test";
import {LivePage} from "./live/live";

@NgModule({
    declarations: [
        HomePage,
        SearchPage,
        GoodTeacherPage,
        NoDevPage,
        TestCenterPage,
        DoTestPage,
        LookTestPage,
        LivePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        ComponentsModule,
    ],
    entryComponents: [
        SearchPage,
        GoodTeacherPage,
        NoDevPage,
        TestCenterPage,
        DoTestPage,
        LookTestPage,
        LivePage,
    ]
})
export class HomeModule {
}
