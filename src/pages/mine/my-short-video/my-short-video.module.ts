import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyShortVideoPage } from './my-short-video';

@NgModule({
  declarations: [
    MyShortVideoPage,
  ],
  imports: [
    IonicPageModule.forChild(MyShortVideoPage),
  ],
})
export class MyShortVideoPageModule {}
