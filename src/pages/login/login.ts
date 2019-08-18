import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private loginSer:LoginService,private storage:Storage) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    login() {
        this.loginSer.loginpost(this.user).subscribe(
            (res)=>{
                console.log(res);
                this.storage.set('Authorization',res.data.Token);
                this.navCtrl.setRoot(TabsPage);
            }
        );
    }

}
