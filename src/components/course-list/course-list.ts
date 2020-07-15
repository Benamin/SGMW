import {Component, EventEmitter, Input, Output} from '@angular/core';
import {defaultImg, PCURL} from "../../app/app.constants";
import {CommonService} from "../../core/common.service";

declare var Wechat;

@Component({
    selector: 'course-list',
    templateUrl: 'course-list.html'
})
export class CourseListComponent {
    @Input() list;
    @Output() done = new EventEmitter();
    defaultImg = defaultImg;


    constructor(private commonSer: CommonService) {
        console.log('Hello CourseListComponent Component');
    }

    getItem(item) {
        this.done.emit(item);
    }

    // 微信分享
    wxShare(data) {
        console.log('分享内容', data)
        let description = data.Description;
        let thumb = data.ImageUrl;

        if (description.length > 100) {
            description = description.slice(0, 100);
        }

        const obj = {
            Title: data.Title,
            description: description,
            thumb: thumb,
            webpageUrl: `http://a1.hellowbs.com/openApp.html?scheme_url=learning&Id=${data.Id}`
        }
        this.commonSer.weChatShare(obj);
    }

}
