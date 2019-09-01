import {Component, EventEmitter, Input, Output} from '@angular/core';
import {defaultImg} from "../../app/app.constants";


@Component({
  selector: 'course-list',
  templateUrl: 'course-list.html'
})
export class CourseListComponent {
  @Input() list;
  @Output() done =new EventEmitter();
  defaultImg = defaultImg;


  constructor() {
    console.log('Hello CourseListComponent Component');
  }

  getItem(item){
    this.done.emit(item);
  }

}
