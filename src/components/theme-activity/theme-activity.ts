import {Component} from '@angular/core';
import {HomeService} from "../../pages/home/home.service";
import {NavController} from "ionic-angular";
import {ThemeActivityPage} from "../../pages/home/theme-activity/theme-activity";
import {CommonService} from "../../core/common.service";

@Component({
    selector: 'theme-activity',
    templateUrl: 'theme-activity.html'
})
export class ThemeActivityComponent {


    obj;
    defaultImg = "./assets/imgs/home/theme-bg.png";

    constructor(public homeSer: HomeService, public navCtrl: NavController,
                private commonSer: CommonService) {
        this.homeSer.SelectThemeActivityInformation().subscribe(
            (res) => {
                this.obj = res.data;
            }
        );
    }


    toTheme() {
        if (!this.obj.name) {
            this.commonSer.toast('暂无主题活动');
            return
        }
        this.navCtrl.push(ThemeActivityPage, {
            theme: {
                Id: this.obj.Id, coverUrl: this.obj.converUrl, name: this.obj.name
            }
        });
    }
}