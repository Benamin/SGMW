import {Component, Input} from '@angular/core';

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.html'
})
/**
 * list = [ { type:"1",name:"类型" } ]
 */
export class NavbarComponent {
    @Input() list;
    bar = {
        type: "1",
    };

    constructor() {
        console.log('Hello NavbarComponent Component');
    }

    changeType(item) {
        this.bar.type = item.type;
    }

}
