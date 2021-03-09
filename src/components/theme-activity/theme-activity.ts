import {Component} from '@angular/core';
import {HomeService} from "../../pages/home/home.service";
import {NavController} from "ionic-angular";
import {ThemeActivityPage} from "../../pages/home/theme-activity/theme-activity";
import {defaultImg} from "../../app/app.constants";

@Component({
    selector: 'theme-activity',
    templateUrl: 'theme-activity.html'
})
export class ThemeActivityComponent {


    obj;
    defaultImg = "./assets/imgs/home/theme-bg.png";

    constructor(public homeSer: HomeService, public navCtrl: NavController) {
        this.homeSer.SelectThemeActivityInformation().subscribe(
            (res) => {
                this.obj = res.data;
            }
        );
    }


    toTheme() {
        this.navCtrl.push(ThemeActivityPage, {
            theme: {
                Id: this.obj.Id, coverUrl: this.obj.converUrl, name: this.obj.name
            }
        });
    }
}
