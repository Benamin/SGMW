import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-medal',
  templateUrl: './medal.component.html'
})
export class MedalComponent implements OnInit {

  medalListDivShow=false;
  actionSheet=false;
  constructor() { }
  ngOnInit() {
  }
  setCurrentMedal(){
    this.actionSheet=true;
    setTimeout(() => {
      this.medalListDivShow = true;
    }, 20);
  }

  setCurrentMedalHide(){
    this.medalListDivShow = false;
    setTimeout(() => {
      this.actionSheet=false;
    }, 200);
  }
}
