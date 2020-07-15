import {Component, OnInit, Input} from '@angular/core';
import {PCURL} from "../../app/app.constants";
import {CommonService} from "../../core/common.service";

declare var Wechat;

@Component({
    selector: 'app-forum-list-time',
    templateUrl: './forum-list-time.component.html'
})


export class ForumListTimeComponent implements OnInit {

    @Input() item;
    @Input() itemIndex;

    constructor(public commonSer: CommonService) {
    }

    ngOnInit() {
    }

    // 微信分享
    wxShare(data) {
        let description = data.ContentWithoutHtml.replace(/\&nbsp;/g, '');
        let thumb = '';

        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        if (data.Images.length > 0) {
            thumb = data.Images[0].Src;
        }
        const pcUrl = PCURL;
        const obj = {
            Title: data.Title,
            description: description,
            thumb: thumb,
            webpageUrl: `${pcUrl}bbsdetails/${data.Id}`
        }

        this.commonSer.weChatShare(obj)
    }
}
