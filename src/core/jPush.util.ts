import {Injectable} from '@angular/core';
import {JPush} from '@jiguang-ionic/jpush';
import {CommonService} from "./common.service";
import {GlobalData} from "./GlobleData";

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class JpushUtil {
    constructor(private jpush: JPush,
                private globalData: GlobalData,
                private commonSer: CommonService) {

    }

    initPush() {
        /**设备成功注册后，返回registrationId*/
        document.addEventListener('jpush.receiveRegistrationId', (event: any) => {
            this.globalData.RegiID = event.registrationId;
            this.commonSer.alert(`receiveRegistrationId:${this.globalData.RegiID}`)
        }, false);
        /**接收消息触发 */
        document.addEventListener('jpush.receiveNotification', (event: any) => {
            this.commonSer.alert('Receive notification: ' + JSON.stringify(event));
        }, false);
        /**打开消息触发 */
        document.addEventListener('jpush.openNotification', (event: any) => {
            this.commonSer.alert('openNotification: ' + JSON.stringify(event));
        }, false);
        /**接收本地消息 */
        document.addEventListener('jpush.', (event: any) => {
            this.commonSer.alert('receiveLocalNotification: ' + JSON.stringify(event));
        }, false);
    }

}
