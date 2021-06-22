import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicPageModule} from 'ionic-angular';

import {ForumPage} from './forum.component';
import {PostlistComponent} from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ForumService} from './forum.service';
import {ViewReplyComponent} from './view-reply/view-reply.component';
import {PostAddComponent} from './post-add/post-add.component';
// import {ForumListTimeComponent} from './forum-list-time/forum-list-time.component';
import {ComponentsModule} from "../../components/components.module";
import {ReportPage} from "./report/report";
import {PipesModule} from "../../pipes/pipes.module";
import {ChooseTopicPage} from "./choose-topic/choose-topic";


@NgModule({
    declarations: [
        ForumPage,
        PostlistComponent,
        PostsContentComponent,
        ViewReplyComponent,
        PostAddComponent,
        ReportPage,
        ChooseTopicPage,
    ],
    imports: [
        IonicPageModule.forChild(ForumPage),
        CommonModule,
        ComponentsModule,
        PipesModule
    ],
    entryComponents: [
        ForumPage,
        PostlistComponent,
        PostsContentComponent,
        ViewReplyComponent,
        PostAddComponent,
        ReportPage,
        ChooseTopicPage
    ],
    providers: [ForumService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ForumModule {
}
