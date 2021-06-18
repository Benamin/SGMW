import {Component, OnInit, NgZone} from '@angular/core';
import {LoadingController, NavController, Slides, ToastController} from 'ionic-angular';
import {PostsContentComponent} from '../../forum/posts-content/posts-content.component';
import {ForumService} from '../../forum/forum.service';
import {PostAddComponent} from '../../forum/post-add/post-add.component';
import {PostlistComponent} from "../../forum/postlist/postlist.component";
import {CommonService} from "../../../core/common.service";


@Component({
    selector: 'page-my-forum',
    templateUrl: './my-forum.component.html',
})
export class MyForumComponent implements OnInit {
    navli: '已发布' | '草稿箱' = '已发布';
    isdoInfinite = true;
    no_list = false;
    forumList = [];
    pageDate = {
        creater: "丁林玲",
        pageIndex: 1,
        pageSize: 10,
        status: 2,
        title: "",
        total: 0,
        OrderBy: 'PostTimeFormatted',
        OrderByDirection: 'desc'
    }

    isLoad = false;
    draftList = [];

    constructor(public navCtrl: NavController,
                private serve: ForumService,
                private loadCtrl: LoadingController,
                private zone: NgZone, private commonSer: CommonService,
                private toastCtrl: ToastController) {
    }

    ionViewDidEnter() {
        this.pageDate.pageIndex = 1;
        this.forumList = [];
        this.getData();
    }

    ngOnInit() {
    }

    // 切换已发布/草稿箱
    switchInformation(text, number) {
        this.navli = text;
        this.pageDate.pageIndex = 1;
        this.pageDate.status = number;
        this.getData();
    }

    // 前往动态详情
    goPostsContent(data) {
        this.navCtrl.push(PostsContentComponent, {data: data});
    }

    // 编辑动态
    editITem(time) {
        this.navCtrl.push(PostAddComponent, {data: time});
    }

    // 删除动态
    delITem(data, index) {
        this.commonSer.alert(`确定删除吗?`, () => {
            this.serve.post_delete(data.Id).subscribe((res: any) => {
                if (res.code == 200) {
                    this.commonSer.toast("删除成功");
                    if (this.navli === "草稿箱") {
                        this.draftList.splice(index, 1);
                    } else {
                        this.forumList.splice(index, 1);
                    }
                } else {
                    this.commonSer.toast(res.message);
                }
            });
        })
    }

    // 获取数据
    getData() {
        this.isLoad = false;
        let loading = null;
        if (this.pageDate.pageIndex == 1) {
            loading = this.loadCtrl.create({
                content: ''
            });
            loading.present();
        }
        let data = {
            pageIndex: this.pageDate.pageIndex,
            pageSize: this.pageDate.pageSize,
            status: this.pageDate.status,
        }
        // GetMypost
        this.serve.GetMypost(data).subscribe((res: any) => {
            this.isLoad = true;
            if (loading) {
                loading.dismiss();
            }
            if (!res.data) {
                this.isdoInfinite = false;
                return
            }
            let arr = res.data.Posts.Items;
            arr.forEach(element => {
                element.PostTimeForm = element.PostTimeForm.replace(/-/g, '/');
            });
            if (arr.length == 0) {
                this.isdoInfinite = false;
            }
            if (this.navli === "已发布") {
                if (this.pageDate.pageIndex > 1) {
                    this.forumList = this.forumList.concat(arr);
                } else {
                    this.forumList = arr;
                }
                this.serve.listSplice(this.forumList);
            }
            if (this.navli === "草稿箱") {
                if (this.pageDate.pageIndex > 1) {
                    this.draftList = this.draftList.concat(arr);
                } else {
                    this.draftList = arr;
                }
                this.serve.listSplice(this.forumList);
            }

        });
    }

    // 下拉加载更多
    doInfinite(e) {
        this.pageDate.pageIndex++;
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
    }

    doRefresh(e) {
        this.pageDate.pageIndex = 1;
        this.getData();
        setTimeout(() => {
            e.complete();
        }, 1000);
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

}
