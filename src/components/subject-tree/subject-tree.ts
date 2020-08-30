import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";

@Component({
    selector: 'subject-tree',
    templateUrl: 'subject-tree.html'
})
export class SubjectTreeComponent {

    list = [];
    choice = [];
    classSelect = [];

    constructor(private params: NavParams, private statusBar: StatusBar,
                private viewCtrl: ViewController) {
        this.list = this.params.get('list');
        this.choice = this.params.get('choice');
        this.classSelect = this.choice.map(e => e.value);
    }

    chooseItem(item, i) {
        const index = this.choice.findIndex(e => item.value == e.value);
        if (index > -1) {
            this.choice.splice(index, 1)
            this.classSelect.splice(index, 1)
        } else {
            this.choice.push({label: item.label, value: item.value});
            this.classSelect.push(item.value);
        }
    }

    close() {
        this.viewCtrl.dismiss(this.choice);
    }

}
