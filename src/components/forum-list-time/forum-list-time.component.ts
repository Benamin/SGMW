import { Component, OnInit ,Input } from '@angular/core';
declare var Wechat;

@Component({
  selector: 'app-forum-list-time',
  templateUrl: './forum-list-time.component.html'
})


export class ForumListTimeComponent implements OnInit {
  
  @Input()  item;
    @Input () itemIndex;
  constructor() { }
  
  ngOnInit() {}

  // 微信分享
  wxShare(data){
    document.getElementById('inner-html')
    let description=data.ContentWithoutHtml.replace(/\&nbsp;/g,'');
    let thumb='';
    
    if(description.length>100){
      description = description.slice(0,100);
     }
     if(data.Images.length>0){
      thumb=data.Images[0].Src;
     }
     console.log(description);
  
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
                  webpageUrl: "http://a1.hellowbs.com/openApp.html?Id="+data.Id
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
