import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {ForumService} from '../../forum/forum.service';
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {LogService} from "../../../service/log.service";

@Component({
    selector: 'page-my-thumbs-up',
    templateUrl: './my-thumbs-up.component.html'
})
export class MyThumbsUpComponent implements OnInit {

    data = [];
    page = {"PageIndex": 1, "PageSize": 10};

    isdoInfinite = true;

    constructor(private serve: ForumService,
                public navCtrl: NavController,
                public logSer:LogService,
                private loadCtrl: LoadingController,
    ) {
    }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.data = [];
        this.page.PageIndex = 1;
        this.mylikes();
        this.logSer.visitLog('wddz');
    }

    mylikes() {
        let loading = null;
        if (this.page.PageIndex == 1) {
            loading = this.loadCtrl.create({
                content: ''
            });
            loading.present();
        }
        this.serve.mylikes(this.page).subscribe((res: any) => {
            if (!res.data) {
                return
            }
            let arr = res.data.Items;
            arr.forEach(element => {
                element.PostRelativeTime = this.serve.PostRelativeTimeForm(element.PostRelativeTime);
            });

            if (arr.length == 0) {
                this.isdoInfinite = false;
            }
            if (this.page.PageIndex == 1) {
                loading.dismiss();
            }
            this.data = this.data.concat(arr);
        });
    }

    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    lodaData(e) {
        this.page.PageIndex++;
        this.mylikes();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    forum_post_cancellike(data, index) {
        this.data.splice(index, 1);
        this.serve.forum_post_cancellike(data.Id).subscribe((res: any) => {
            if (res.code == 200) {
            }
        })
    }

    doRefresh(e) {
        this.page.PageIndex = 1;
        this.data = [];
        this.mylikes();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }
}
