import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.html'
})
/**
 * list = [ { type:"1",name:"类型" } ]
 */
export class NavbarComponent {
    @Input() list;
    @Input() select;
    @Output() done = new EventEmitter();

    constructor() {
    }

    changeType(item) {
        this.select = item.type;
        this.done.emit(item);
    }

}
