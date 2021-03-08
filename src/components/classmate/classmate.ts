import {Component, Input} from '@angular/core';
import {defaultHeadPhoto} from "../../app/app.constants";
import {NavController} from "ionic-angular";
import {PersonalCenterPage} from "../../pages/home/personal-center/personal-center";

@Component({
    selector: 'classmate',
    templateUrl: 'classmate.html'
})
export class ClassmateComponent {
    @Input() List;
    @Input() AnswerUserTotal;
    @Input() ThenUserTotal;
    defaultHeadPhoto = defaultHeadPhoto;   //默认头像；

    constructor(public navCtrl:NavController) {
        console.log(this.List);
    }

    //他人详情
    toPersonInfo(item){
        this.navCtrl.push(PersonalCenterPage,{Poster:item.UserID})
    }
}
