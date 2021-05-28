import {Component, EventEmitter, Input, Output} from '@angular/core';
import {defaultImg} from "../../app/app.constants";
import {CommonService} from "../../core/common.service";
import {ShareWxComponent} from "../share-wx/share-wx";
import {ModalController} from "ionic-angular";

declare var Wechat;

@Component({
    selector: 'course-list',
    templateUrl: 'course-list.html'
})
export class CourseListComponent {
    @Input() list;
    @Output() done = new EventEmitter();
    defaultImg = defaultImg;


    constructor(private commonSer: CommonService,
                private modalCtrl: ModalController) {
    }

    getItem(item) {
        this.done.emit(item);
    }

    // 微信分享
    wxShare(data) {
        let description = data.Description;
        let thumb = data.ImageUrl;
        if (description.length > 100) {
            description = description.slice(0, 100);
        }
        const obj = {
            title: data.Title,
            description: description,
            thumb: thumb,
            paramsUrl: `/static/openApp.html?scheme_url=learning&Id=${data.Id}`
        }
        let modal = this.modalCtrl.create(ShareWxComponent,
            {
                data: obj,
            });
        modal.present();
    }

}
