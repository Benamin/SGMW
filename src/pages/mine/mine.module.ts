import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MinePage} from "./mine";
import {MycollectionPage} from "./mycollection/mycollection";
import {MyCoursePage} from "./my-course/my-course";

@NgModule({
  declarations: [
    MinePage,
    MycollectionPage,
    MyCoursePage,
  ],
  imports: [
    IonicPageModule.forChild(MinePage),
  ],
  entryComponents:[
    MycollectionPage,
    MyCoursePage,
  ]
})
export class MineModule {}
