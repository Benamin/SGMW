import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA }     from '@angular/core';

import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../components/components.module";
import { NumberOne } from './number-one.component';
import { NumberOneDetailsComponent } from './numberOneDetails/numberOneDetails.component';

@NgModule({
    declarations: [
        NumberOne,
        NumberOneDetailsComponent
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(NumberOne),
    ],
    entryComponents: [
        NumberOneDetailsComponent
    ],
    schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class NumberOneModule {

}
