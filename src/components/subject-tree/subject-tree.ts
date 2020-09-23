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

    //过滤树
    filterData(data) {
        let arr = [];
        arr.push({label: data.label, value: data.value});  //1
        if (data.children && data.children.length > 0) {
            data.children.forEach(e1 => {
                arr.push({label: e1.label, value: e1.value});  //2
                if (e1.children && e1.children.length > 0) {
                    e1.children.forEach(e2 => {
                        arr.push({label: e2.label, value: e2.value});  //3
                        if (e2.children && e2.children.length > 0) {
                            e2.children.forEach(e3 => {
                                arr.push({label: e3.label, value: e3.value});  //4
                            })
                        }
                    })
                }
            })
        }
        return arr;
    }

    close() {
        this.viewCtrl.dismiss(this.choice);
    }

}
