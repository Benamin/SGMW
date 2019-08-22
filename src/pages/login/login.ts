import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {LoginService} from "./login.service";
import {Storage} from "@ionic/storage";
import {AppService} from "../../app/app.service";


@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    user = {
        LoginName: 'sgmwadmin',
        Password: 'P@ssw0rd'
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController,
                private loginSer: LoginService, private storage: Storage, private appSer: AppService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    login() {
        const loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        console.log(this.user);
        this.loginSer.loginpost(this.user).subscribe(
            (res) => {
                this.storage.set('Authorization', res.data.Token);
                this.appSer.setMine(res.data.User);
            }
        );
        this.navCtrl.setRoot(TabsPage);
        loading.dismiss();
    }

}
