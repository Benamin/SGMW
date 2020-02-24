import {Injectable, ViewChild} from '@angular/core';
import {JPush} from '@jiguang-ionic/jpush';
import {CommonService} from "./common.service";
import {GlobalData} from "./GlobleData";
import {App, Events, NavController} from "ionic-angular";
import {TestCenterPage} from "../pages/home/test/test-center/test-center";

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class JpushUtil {

    constructor(private jpush: JPush,
                private app: App,
                private events: Events,
                private globalData: GlobalData,
                private commonSer: CommonService) {
    }

    initPush() {
        /**设备成功注册后，返回registrationId*/
        console.log('jpush');
        document.addEventListener('jpush.receiveRegistrationId', (event: any) => {
            this.globalData.RegiID = event.registrationId;
            // this.commonSer.alert(`receiveRegistrationId:${this.globalData.RegiID}`)
        }, false);
        /**接收通知触发 */
        document.addEventListener('jpush.receiveNotification', (event: any) => {
            // this.commonSer.alert('Receive notification: ' + JSON.stringify(event));
        }, false);
        /**接受自定义消息*/
        document.addEventListener("jpush.receiveMessage", (event: any) => {
            // this.commonSer.alert("jpush.receiveMessage: " + JSON.stringify(event));
        }, false);
        /**打开消息触发 */
        document.addEventListener('jpush.openNotification', (event: any) => {
            const sgmwType = event.extras.sgmwType;   //3 培训通知  4  考试通知
            this.events.publish('jPush', sgmwType);
            this.globalData.JpushType = sgmwType;
            // this.commonSer.alert('openNotification: ' + JSON.stringify(event));
        }, false);
        /**接收本地消息 */
        document.addEventListener('jpush.', (event: any) => {
            // this.commonSer.alert('receiveLocalNotification: ' + JSON.stringify(event));
        }, false);
    }

}
