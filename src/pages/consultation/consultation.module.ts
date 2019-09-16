import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ConsultationPage} from './consultation';
import {ComponentsModule} from "../../components/components.module";
import { Componentsdetails } from './componentsdetails/componentsdetails.component';

@NgModule({
    declarations: [
        ConsultationPage,
        Componentsdetails
    ],
    imports: [
        IonicPageModule.forChild(ConsultationPage),
        ComponentsModule,
    ],
    entryComponents: [
        Componentsdetails
    ],
    schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultationPageModule {
}
