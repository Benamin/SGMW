import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CommentComponent} from "../../../components/comment/comment";
import {LearnService} from "../learn.service";
import {CommonService} from "../../../core/common.service";

@Component({
    selector: 'page-course-comment',
    templateUrl: 'course-comment.html',
})
export class CourseCommentPage {
    title;
    list = [];
    starList = new Array(5);

    page = {
        pageSize: 100,
        page: 1,
        total: null
    };
    topicID;
    TopicType;


    constructor(public navCtrl: NavController, public navParams: NavParams, private commonSer: CommonService,
                private modalCtrl: ModalController, private learnSer: LearnService) {
    }

    ionViewDidLoad() {
        this.topicID = this.navParams.get("TopicID");
        this.TopicType = this.navParams.get("TopicType");
        this.title = this.navParams.get("title");
        this.getList();
    }

    getList() {
        const data = {
            pageSize: this.page.pageSize,
            page: this.page.page,
            TopicType: this.TopicType,   //teacher  course
            topicID: this.topicID
        }
        this.learnSer.GetComment(data).subscribe(
            (res) => {
                this.list = res.data.CommentItems;
                this.page.total = res.data.TotalCount;
            }
        );

        // this.learnSer.GetCommentByNative(data).then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.list = res1.data.CommentItems;
        //         this.page.total = res.data.data.TotalCount;
        //     }
        // )
    }

    openComment() {
        let modal = this.modalCtrl.create(CommentComponent, {placeholder: '请输入评价'});
        modal.onDidDismiss(res => {
            if (res) {
                this.replyHandle(res);
            }
        });
        modal.present();
    }

    replyHandle(res) {
        const data = {
            TopicID: this.topicID,
            Score: res.score,
            Contents: res.replyContent,
            TopicType: this.TopicType
        }
        this.learnSer.SaveComment(data).subscribe(
            (res) => {
                this.commonSer.toast('评价成功');
                this.getList();
            }
        )

        // this.learnSer.SaveCommentByNative(data).then(
        //     (res) => {
        //         this.commonSer.toast('评价成功');
        //         this.getList();
        //     }
        // )
    }

}
