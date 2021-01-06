import {Component, Input} from '@angular/core';
import {defaultHeadPhoto} from "../../app/app.constants";

@Component({
    selector: 'classmate',
    templateUrl: 'classmate.html'
})
export class ClassmateComponent {
    @Input() List;
    @Input() AnswerUserTotal;
    @Input() ThenUserTotal;
    defaultHeadPhoto = defaultHeadPhoto;   //默认头像；

    constructor() {
        console.log(this.List);
    }

}
