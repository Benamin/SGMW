import {Component, EventEmitter, Input, Output} from '@angular/core';
import {defaultImg} from "../../app/app.constants";
declare var Wechat;

@Component({
  selector: 'course-list',
  templateUrl: 'course-list.html'
})
export class CourseListComponent {
  @Input() list;
  @Output() done =new EventEmitter();
  defaultImg = defaultImg;


  constructor() {
    console.log('Hello CourseListComponent Component');
  }

  getItem(item){
    this.done.emit(item);
  }
  // 微信分享
  wxShare(data){
      console.log('分享内容',data)
      let description=data.Description;
      let thumb=data.ImageUrl;
      
      if(description.length>100){
        description = description.slice(0,100);
       }
      
       console.log(description,data.TeachTypeCode);
       
        Wechat.share({
            message: {
            title: data.Title, // 标题
            description: description, // 简介
            thumb: thumb, //帖子图片
            mediaTagName: "TEST-TAG-001",
            messageExt: "这是第三方带的测试字段",
            messageAction: "<action>dotalist</action>",
            // media: "YOUR_MEDIA_OBJECT_HERE",
            media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: `http://a1.hellowbs.com/openApp.html?scheme_url=learning&TeachTypeCode=${data.TeachTypeCode}&Id=${data.Id}`
            }
            },
            scene: Wechat.Scene.SESSION
        }, function () {
           // alert("Success");
        }, function (reason) {
            // alert("Failed: " + reason);
        });
  }

}
