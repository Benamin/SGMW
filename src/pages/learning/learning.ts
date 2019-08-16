import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-learning',
    templateUrl: 'learning.html',
})
export class LearningPage {

    tabsList = [];
    learnList = [];

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.tabsList = [
            {name: "不限", type: '0'},
            {name: "新宝骏", type: '1'},
            {name: "经典宝骏", type: '2'},
            {name: "五菱", type: '3'},
            {name: "新能源", type: '4'},
            {name: "专家团队", type: '5'},
            {name: "用户体验", type: '6'},
        ];
        this.learnList = [
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
            { img:'',title:'',brand:'新宝骏',comment:'123',collection:'123' },
        ]
    }

    getTabs(e){
        console.log(e);
    }

}
