import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {defaultHeadPhoto, PCURL} from "../../app/app.constants";
import {CommonService} from "../../core/common.service";
import {ModalController, NavController} from "ionic-angular";
import {ForumService} from "../../pages/forum/forum.service";
import {PersonalCenterPage} from "../../pages/home/personal-center/personal-center";
import {Storage} from "@ionic/storage";

declare var Wechat;

@Component({
    selector: 'app-forum-list-time',
    templateUrl: './forum-list-time.component.html'
})


export class ForumListTimeComponent implements OnInit {

    @Input() item;
    @Input() itemIndex;
    @Output() share = new EventEmitter();
    @Output() toPostList = new EventEmitter();

    defaultHeadPhoto = defaultHeadPhoto;

    constructor(public commonSer: CommonService, public navCtrl: NavController, private modalCtrl: ModalController, private storage: Storage, private serve: ForumService,) {
    }

    ngOnInit() {

    }

    //点赞
    handleLike(item, e) {
        e.stopPropagation();
        if (item.isClick) return;

        item.isClick = true;
        if (item.IsGiveLike) {
            this.serve.forum_post_cancellike(item.Id).subscribe((res: any) => {
                item['IsGiveLike'] = false;
                if (item.LikeCount > 0) item.LikeCount--;
                item.isClick = false;
            });
        } else {
            this.serve.forum_post_like(item.Id).subscribe((res: any) => {
                item['IsGiveLike'] = true;
                item.LikeCount++;
                item.isClick = false;
            });
        }
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

    //他人详情
    toPersonInfo(item) {
			this.storage.get('user').then(value => {
					if (item.Poster !== value.MainUserID) {
						this.navCtrl.push(PersonalCenterPage, {Poster: item.Poster})
					}
			});
    }

    //话题列表
    goToPostList(item){
        this.toPostList.emit(item);
    }
}
