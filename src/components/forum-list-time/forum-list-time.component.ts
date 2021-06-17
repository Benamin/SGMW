import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {defaultHeadPhoto, PCURL} from "../../app/app.constants";
import {CommonService} from "../../core/common.service";
import {ModalController, NavController} from "ionic-angular";
import {ForumService} from "../../pages/forum/forum.service";
import {PersonalCenterPage} from "../../pages/home/personal-center/personal-center";
import {Storage} from "@ionic/storage";
import {PostsContentComponent} from "../../pages/forum/posts-content/posts-content.component";
import {ShareWxComponent} from "../share-wx/share-wx";
import {PostlistComponent} from "../../pages/forum/postlist/postlist.component";

declare var Wechat;

@Component({
    selector: 'app-forum-list-time',
    templateUrl: './forum-list-time.component.html'
})


export class ForumListTimeComponent implements OnInit {

    @Input() itemIndex;
    @Output() share = new EventEmitter();

    defaultImg = './assets/imgs/competition/fengmian@2x.png'
    defaultHeadPhoto = defaultHeadPhoto;
    PosterList = [];

    constructor(public commonSer: CommonService, public navCtrl: NavController, private modalCtrl: ModalController, private storage: Storage, private serve: ForumService,) {
    }

    @Input() set followList(event) {
        this.PosterList = event.map(e => {
            e.PostTimeFormatted = e.PostTimeFormatted.replace(/-/g, '/');
            return e;
        })
    }

    ngOnInit() {

    }

    //详情
    goToDetail(item) {
        this.navCtrl.push(PostsContentComponent, {data: item});
    }


    //点赞
    handleLike(item, e) {
        e.stopPropagation();
        if (item.isClick) return;

        item.isClick = true;
        if (item.IsGiveLike) {
            item.isClick = false;
            item['IsGiveLike'] = false;
            if (item.LikeCount > 0) item.LikeCount--;
            this.serve.forum_post_cancellike(item.Id).subscribe((res: any) => {
                item.isClick = false;
            });
        } else {
            item['IsGiveLike'] = true;
            item.LikeCount++;
            this.serve.forum_post_like(item.Id).subscribe((res: any) => {
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
        const obj = {
            title: data.Title,
            description: description,
            thumb: thumb,
            paramsUrl: `/#/bbsdetails/${data.Id}`
        }
        let modal = this.modalCtrl.create(ShareWxComponent, {data: obj});
        modal.present();
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
    toPostList(item) {
        const data = {
            Id: item.TopicId,
            CoverImage: item.TopicImageUrl,
            Name: item.TopicName,
            navli: "话题"
        }
        this.navCtrl.push(PostlistComponent, {data: data});
    }

    playVide(event) {
        console.log(event);
        event.stopPropagation();
        event.play();
    }

    getDuration(ev, item) {
        let value = Math.ceil(ev.target.duration);
        console.log(ev.target);
        item.duration = value;
        console.log(item.duration);
    }
}
