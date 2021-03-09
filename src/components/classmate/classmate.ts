import {Component, Input} from '@angular/core';
import {defaultHeadPhoto} from "../../app/app.constants";
import {NavController} from "ionic-angular";
import {PersonalCenterPage} from "../../pages/home/personal-center/personal-center";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'classmate',
    templateUrl: 'classmate.html'
})
export class ClassmateComponent {
    @Input() List;
    @Input() AnswerUserTotal;
    @Input() ThenUserTotal;
    defaultHeadPhoto = defaultHeadPhoto;   //默认头像；

    constructor(private storage: Storage,public navCtrl:NavController) {
        console.log(this.List);
    }

    //他人详情
    toPersonInfo(item){
			this.storage.get('user').then(value => {
					console.log('itemPoster--', item.UserID, 'MainUserID--',value.MainUserID);
					if (item.UserID === value.MainUserID) {
						return
					} else {
						this.navCtrl.push(PersonalCenterPage, {Poster: item.UserID})
					}
			});
    }
}
