import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'course-list',
  templateUrl: 'course-list.html'
})
export class CourseListComponent {
  @Input() list;
  @Output() done =new EventEmitter();

  constructor() {
    console.log('Hello CourseListComponent Component');
  }

  getItem(item){
    this.done.emit(item);
  }

}
