import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from "./home";
import {SearchPage} from "./search/search";
import {GoodTeacherPage} from "./good-teacher/good-teacher";
import {ComponentsModule} from "../../components/components.module";
import {NoDevPage} from "./no-dev/no-dev";
import {TestCenterPage} from "./test/test-center/test-center";
import {DoTestPage} from "./test/do-test/do-test";
import {LookTestPage} from "./test/look-test/look-test";
import {LivePage} from "./live/live";
import {DoQuestionPage} from "./question/do-question/do-question";
import {LookQuestion} from "./question/look-question/look-question";
import {MyQuestion} from "./question/my-question/my-question";
import {InnerTrainPage} from "./inner-train/inner-train";
import {FocusTrainPage} from "./focus-train/focus-train";

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
        DoQuestionPage,
        LookQuestion,
        MyQuestion,
        InnerTrainPage,
        FocusTrainPage
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
        DoQuestionPage,
        LookQuestion,
        MyQuestion,
        InnerTrainPage,
        FocusTrainPage
    ]
})
export class HomeModule {
}
