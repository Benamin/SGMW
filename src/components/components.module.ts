import {NgModule} from '@angular/core';
import {NavbarComponent} from './navbar/navbar';
import {IonicPageModule} from "ionic-angular";
import {ScrollTabsComponent} from './scroll-tabs/scroll-tabs';
import {CommentComponent} from './comment/comment';

@NgModule({
    declarations: [
        NavbarComponent,
        CommentComponent,
        CommentComponent,
    ],
    imports: [
        IonicPageModule
    ],
    exports: [
        NavbarComponent,
        CommentComponent,
        CommentComponent,
    ],
    providers: [
        NavbarComponent,
        CommentComponent,
    ],
    entryComponents: [
        NavbarComponent,
        CommentComponent,
    ]
})
export class ComponentsModule {
}
