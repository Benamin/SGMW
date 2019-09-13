import { Injectable} from '@angular/core';
import {Platform, ToastController, App, NavController, Tabs} from 'ionic-angular';
import {EmitService} from "./emit.service";
import {LogoutService} from "../secret/logout.service";

@Injectable()
export class BackButtonService {

    //控制硬件返回按钮是否触发，默认false
    backButtonPressed: boolean = false;

    //  1.false  正常返回上一层，2.true，禁止返回上一层，3.result,返回列表页面
    isDo = 'false';

    constructor(public platform: Platform,private logoutSer:LogoutService,
                public appCtrl: App, public eventEmitSer: EmitService,
                public toastCtrl: ToastController) {
        this.eventEmitSer.eventEmit.subscribe((value: any) => {
            if(isNaN(value)){   //value为数字 代表消息
                this.isDo = value;
            }
        });
    }

    //注册方法
    registerBackButtonAction(tabRef: Tabs): void {

        this.platform.registerBackButtonAction(() => {

            // let activePortal = this.ionicApp._modalPortal.getActive() ||this.ionicApp._overlayPortal.getActive();
            // let loadingPortal = this.ionicApp._loadingPortal.getActive();
            // if (activePortal) {
            //     //其他的关闭
            //     activePortal.dismiss().catch(() => {
            //     });
            //     activePortal.onDidDismiss(() => {
            //     });
            //     return;
            // }
            // if (loadingPortal) {
            //     //loading的话，返回键无效
            //     activePortal.dismiss(()=>{})
            //     return;
            // }

            let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
            //如果可以返回上一页，则执行pop
            if (activeNav.canGoBack()) {
                if (this.isDo === 'false') {  //正常返回
                    activeNav.pop();
                }
                if (this.isDo === 'result') {
                    let index = activeNav.length() - 2;
                    activeNav.remove(2, index)
                }
            } else {
                if (tabRef == null || tabRef._selectHistory[tabRef._selectHistory.length - 1] === tabRef.getByIndex(0).id) {
                    //执行退出
                    this.showExit();
                } else {
                    //选择首页第一个的标签
                    tabRef.select(0);
                }
            }
        });
    }

    //退出应用方法
    private showExit(): void {
        //如果为true，退出
        if (this.backButtonPressed) {
            this.logoutSer.logout();
            this.platform.exitApp();
        } else {
            //第一次按，弹出Toast
            this.toastCtrl.create({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'middle'
            }).present();
            //标记为true
            this.backButtonPressed = true;
            //两秒后标记为false，如果退出的话，就不会执行了
            setTimeout(() => this.backButtonPressed = false, 2000);
        }
    }
}
