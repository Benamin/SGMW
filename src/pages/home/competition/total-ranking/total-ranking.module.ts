import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TotalRankingPage } from './total-ranking';

@NgModule({
  declarations: [
    TotalRankingPage,
  ],
  imports: [
    IonicPageModule.forChild(TotalRankingPage),
  ],
})
export class TotalRankingPageModule {}
