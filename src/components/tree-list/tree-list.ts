import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppService} from "../../app/app.service";

@Component({
    selector: 'tree-list',
    templateUrl: 'tree-list.html'
})
export class TreeListComponent {
    @Input() treeList = [];
    @Output() fileData = new EventEmitter<any>();

    constructor(private appSer: AppService) {
    }

    handle(item, event) {
        event.stopPropagation();
        this.fileData.emit(item);
        this.appSer.setFile(item);
    }

    getMore(e) {
        e.show = !e.show;
    }

}
