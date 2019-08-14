import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from "./home";
import {SearchPage} from "./search/search";

@NgModule({
  declarations: [
    HomePage,
    SearchPage,

  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    SearchPage
  ]
})
export class HomeModule {
}
