import {Component, Input, Output} from '@angular/core';

@Component({
  selector: 'tree-list',
  templateUrl: 'tree-list.html'
})
export class TreeListComponent {
  @Input() treeList;
  @Output() done;

  constructor() {
    console.log(this.treeList);
  }

}
