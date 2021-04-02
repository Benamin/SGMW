import {Injectable} from '@angular/core';
import {JPush} from '@jiguang-ionic/jpush';
import {CommonService} from "./common.service";
import {GlobalData} from "./GlobleData";
import {App, Events} from "ionic-angular";
import {Storage} from "@ionic/storage";

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class JpushUtil {

    constructor(private jpush: JPush,
                private app: App,
                private events: Events,
                private storage: Storage,
                private globalData: GlobalData,
                private commonSer: CommonService) {
    }

    initPush() {
        /**设备成功注册后，返回registrationId*/
        document.addEventListener('jpush.receiveRegistrationId', (event: any) => {
            // this.commonSer.alert(`receiveRegistrationId:+ ${JSON.stringify(event)}`)
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
            // this.commonSer.alert("jpush.openNotification: " + JSON.stringify(event));
            //2=系统通知  3=培训通知  4=考试通知  5=课程通知(课程ID=csid) 6=主题活动(主题活动ID=taid) 22=论坛回复通知(帖子ID=PostId)
            //30=帖子点赞通知(帖子ID=postID)  31=课程讨论点赞通知(讨论ID=TalkId, 课程ID=TopicID)  32=课程讨论回复通知(回贴ID=PostReplyId,课程ID=postid)
            const sgmwType = event.extras.sgmwType;
            const data = {
                sgmwType: event.extras.sgmwType,
                Id: event.extras.PostId || ''
            }
            switch (sgmwType) {
                case 2:  //系统通知
                    break;
                case 3:  //培训通知
                    break;
                case 4:  //考试通知
                    break;
                case 5:  //课程通知
                    data.Id = event.extras.csid || '';
                    break;
                case 6:  //主题活动
                    data.Id = event.extras.taid || '';
                    break;
                case 22:  //论坛帖子详情
                    data.Id = event.extras.PostId || '';
                    break;
            }

            this.globalData.JpushType = sgmwType;
            this.storage.set('sgmwType', data);
            this.events.publish('jPush', data);
        }, false);
        /**接收本地消息 */
        document.addEventListener('jpush.', (event: any) => {
            this.commonSer.alert('receiveLocalNotification: ' + JSON.stringify(event));
        }, false);
    }

}
