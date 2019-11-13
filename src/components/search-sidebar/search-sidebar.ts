import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";


@Component({
    selector: 'search-sidebar',
    templateUrl: 'search-sidebar.html'
})
export class SearchSidebarComponent {

    obj = {
        startTime: null,
        endTime: null,
        address: "",
        teacher: ""
    };

    constructor(public viewCtrl: ViewController) {

    }

    confirm() {
        this.viewCtrl.dismiss(this.obj);
    }

}
