import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppService} from "../../app/app.service";

@Component({
  selector: 'tree-list',
  templateUrl: 'tree-list.html'
})
export class TreeListComponent {
  @Input() treeList = [];
  @Output() fileData = new EventEmitter<any>();

  constructor(private appSer:AppService) {
  }

  handle(e){
    this.fileData.emit(e);
    this.appSer.setFile(e);
  }

}
