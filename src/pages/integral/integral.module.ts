import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {IntegralPage} from './integral';
import {IntegralListPage} from "./integral-list/integral-list";
import {LeagueTablePage} from "./league-table/league-table";
import {IntegralVerifyPage} from "./integral-verify/integral-verify";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
    declarations: [
        IntegralPage,
        IntegralListPage,
        LeagueTablePage,
        IntegralVerifyPage
    ],
    imports: [
        IonicPageModule.forChild(IntegralPage),
        PipesModule,
    ],
    entryComponents: [
        IntegralListPage,
        LeagueTablePage,
        IntegralVerifyPage
    ]
})
export class IntegralPageModule {
}
