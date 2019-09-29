import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA }     from '@angular/core';

import {IonicPageModule} from 'ionic-angular';
import {numberOneService} from './numberOne.service';
import {ComponentsModule} from "../../components/components.module";
import { NumberOne } from './number-one.component';
import { NumberOneDetailsComponent } from './numberOneDetails/numberOneDetails.component';
// import { Componentsdetails } from '../consultation/componentsdetails/componentsdetails.component';


@NgModule({
    declarations: [
        NumberOne,
        NumberOneDetailsComponent,
        // Componentsdetails
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(NumberOne),
    ],
    entryComponents: [
        NumberOneDetailsComponent
    ],
    providers: [numberOneService],
    schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class NumberOneModule {

}
