import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {PCURL} from "../../app/app.constants";
import {CommonService} from "../../core/common.service";
import {ModalController} from "ionic-angular";
import {ShareWxComponent} from "../share-wx/share-wx";

declare var Wechat;

@Component({
    selector: 'app-forum-list-time',
    templateUrl: './forum-list-time.component.html'
})


export class ForumListTimeComponent implements OnInit {

    @Input() item;
    @Input() itemIndex;
    @Output() share = new EventEmitter();

    constructor(public commonSer: CommonService, private modalCtrl: ModalController) {
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

        this.share.emit(obj);

        // this.commonSer.weChatShare(obj)
    }
}
