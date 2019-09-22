import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicPageModule} from 'ionic-angular';

import { ForumPage } from './forum.component';
import { PostlistComponent } from './postlist/postlist.component';

@NgModule({
  imports: [
    IonicPageModule.forChild(ForumPage),
    CommonModule
  ],
  entryComponents: [
    ForumPage,
    PostlistComponent
  ],
  declarations: [ForumPage,PostlistComponent]
})
export class ForumModule { }
