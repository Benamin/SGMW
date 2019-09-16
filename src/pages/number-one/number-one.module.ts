import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA }     from '@angular/core';

import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../components/components.module";
import { NumberOne } from './number-one.component';

@NgModule({
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(NumberOne),
    ],
    declarations: [
        NumberOne
    ],
    schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class NumberOneModule {

}
