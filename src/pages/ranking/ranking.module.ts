import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import {IonicPageModule} from 'ionic-angular';

@NgModule({
  imports: [
    IonicPageModule.forChild(RankingComponent),
    CommonModule
  ],
  declarations: [RankingComponent]
})
export class RankingModule { }
