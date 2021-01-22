import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {IntegralPage} from './integral';
import {IntegralListPage} from "./integral-list/integral-list";
import {IntegralVerifyPage} from "./integral-verify/integral-verify";

@NgModule({
    declarations: [
        IntegralPage,
        IntegralListPage,
        IntegralVerifyPage
    ],
    imports: [
        IonicPageModule.forChild(IntegralPage),
    ],
    entryComponents: [
        IntegralListPage,
        IntegralVerifyPage
    ]
})
export class IntegralPageModule {
}
