import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicPageModule} from 'ionic-angular';

import { ForumPage } from './forum.component';
import { PostlistComponent } from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ForumService} from './forum.service';
import {ViewReplyComponent} from './view-reply/view-reply.component';

@NgModule({
  imports: [
    IonicPageModule.forChild(ForumPage),
    CommonModule
  ],
  entryComponents: [
    ForumPage,
    PostlistComponent,
    PostsContentComponent,
    ViewReplyComponent
  ],
  providers:[ForumService],
  declarations: [ForumPage,PostlistComponent,PostsContentComponent,ViewReplyComponent]
})
export class ForumModule { }
