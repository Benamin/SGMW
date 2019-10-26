import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import {IonicPageModule} from 'ionic-angular';
import {RankingService} from './ranking.serve';

@NgModule({
  imports: [
    IonicPageModule.forChild(RankingComponent),
    CommonModule
  ],
  declarations: [RankingComponent],
  providers:[RankingService],
})
export class RankingModule { }
