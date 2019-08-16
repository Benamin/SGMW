import {NgModule} from '@angular/core';
import {NavbarComponent} from './navbar/navbar';
import {IonicPageModule} from "ionic-angular";
import {ScrollTabsComponent} from './scroll-tabs/scroll-tabs';

@NgModule({
    declarations: [
        NavbarComponent,
    ],
    imports: [
        IonicPageModule
    ],
    exports: [
        NavbarComponent,
    ],
    providers:[
        NavbarComponent,
    ],
    entryComponents: [
        NavbarComponent,
    ]
})
export class ComponentsModule {
}
