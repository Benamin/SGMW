import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicPageModule} from 'ionic-angular';

import { ForumPage } from './forum.component';
import { PostlistComponent } from './postlist/postlist.component';
import {PostsContentComponent} from './posts-content/posts-content.component';
import {ForumService} from './forum.service';
import {ViewReplyComponent} from './view-reply/view-reply.component';
import {PostAddComponent} from './post-add/post-add.component';


@NgModule({
  imports: [
    IonicPageModule.forChild(ForumPage),
    CommonModule
  ],
  entryComponents: [
    ForumPage,
    PostlistComponent,
    PostsContentComponent,
    ViewReplyComponent,
    PostAddComponent
  ],
  providers:[ForumService],
  declarations: [ForumPage,PostlistComponent,PostsContentComponent,ViewReplyComponent,PostAddComponent]
})
export class ForumModule { }
