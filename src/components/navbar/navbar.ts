import {Component} from '@angular/core';

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.html'
})
export class NavbarComponent {

    list = [];
    bar = {
        type: null,
    };

    constructor() {
        console.log('Hello NavbarComponent Component');
    }

    changeType() {

    }

}
