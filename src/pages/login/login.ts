import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {LoginService} from "./login.service";
import {Storage} from "@ionic/storage";


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
                private loginSer: LoginService, private storage: Storage) {
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
                loading.dismiss();
                this.storage.set('Authorization', res.data.Token);
                this.navCtrl.setRoot(TabsPage);
            }
        );
    }

}
