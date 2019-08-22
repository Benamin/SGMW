import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'tree-list',
  templateUrl: 'tree-list.html'
})
export class TreeListComponent {
  @Input() treeList;
  @Output() fileData = new EventEmitter<any>();

  constructor() {
    console.log(this.treeList);
  }

  handle(e){
    console.log(`treeData${JSON.stringify(e)}`)
    this.fileData.emit(e);
  }

}
