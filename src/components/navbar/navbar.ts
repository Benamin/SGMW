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
    @Output() done = new EventEmitter();
    bar = {
        type: "1",
    };

    constructor() {
        console.log('Hello NavbarComponent Component');
    }

    changeType(item) {
        this.bar.type = item.type;
        this.done.emit(item);
    }

}
