import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LearningPage} from './learning';
import {ScrollTabsComponent} from "../../components/scroll-tabs/scroll-tabs";

@NgModule({
    declarations: [
        LearningPage,
        ScrollTabsComponent,
    ],
    imports: [
        IonicPageModule.forChild(LearningPage),
    ],
    entryComponents: [
        ScrollTabsComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearningPageModule {
}
