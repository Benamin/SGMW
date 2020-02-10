import {Injectable} from '@angular/core';
import {JPush} from '@jiguang-ionic/jpush';

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class JpushUtil {
    constructor(private jpush: JPush) {

    }

    initPush() {
        /**接收消息触发 */
        document.addEventListener('jpush.receiveNotification', (event: any) => {
            console.log('Receive notification: ' + JSON.stringify(event));
        }, false);
        /**打开消息触发 */
        document.addEventListener('jpush.openNotification', (event: any) => {
            console.log('openNotification: ' + JSON.stringify(event));
        }, false);
        /**接收本地消息 */
        document.addEventListener('jpush.', (event: any) => {
            console.log('receiveLocalNotification: ' + JSON.stringify(event));
        }, false);
    }

}
