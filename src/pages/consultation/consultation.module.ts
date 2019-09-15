import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ConsultationPage} from './consultation';
import {NavbarComponent} from "../../components/navbar/navbar";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        ConsultationPage,
    ],
    imports: [
        IonicPageModule.forChild(ConsultationPage),
        ComponentsModule,
    ],
    entryComponents: [
    ],
    schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultationPageModule {
}
