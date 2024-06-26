import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {CommentComponent} from "../../../components/comment/comment";
import {LearnService} from "../learn.service";
import {CommonService} from "../../../core/common.service";
import {defaultHeadPhoto, defaultImg} from "../../../app/app.constants";
import {CommentByCourseComponent} from "../../../components/comment-by-course/comment-by-course";

@Component({
    selector: 'page-course-comment',
    templateUrl: 'course-comment.html',
})
export class CourseCommentPage {
    title;
    list = [];
    starList = new Array(5);

    teacherList = [];
    selectTeacher = null;

    page = {
        pageSize: 1000,
        page: 1,
        total: null,
        load: false
    };
    topicID;
    TopicType;
    placeholder;
    defalutPhoto = defaultHeadPhoto;   //默认头像；

    test;


    constructor(public navCtrl: NavController, public navParams: NavParams, private commonSer: CommonService,
                private modalCtrl: ModalController, private learnSer: LearnService,
                private loadCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        this.topicID = this.navParams.get("TopicID");
        this.TopicType = this.navParams.get("TopicType");
        this.title = this.navParams.get("title");
        this.placeholder = this.navParams.get("placeholder");
        if (this.TopicType != 'talk') this.getList();
        if (this.TopicType == 'talk') this.getTalkList();
        if (this.TopicType == 'teacher') {
            this.getTeacher();
            this.setTeacher("", null)
        }
    }

    //课程评价
    getList() {
        const load = this.loadCtrl.create();
        load.present();
        const data = {
            pageSize: this.page.pageSize,
            page: this.page.page,
            TopicType: this.TopicType,   //teacher  course
            topicID: this.topicID
        };
        this.learnSer.GetComment(data).subscribe(
            (res) => {
                load.dismiss();
                this.list = res.data.CommentItems;
                this.page.total = res.data.TotalCount;
                this.page.load = true;
            }
        );
    }

    //讲师评价下-讲师列表
    getTeacher() {
        const data = {
            id: this.navParams.get("PId")
        }
        this.learnSer.GetTeacherListByPID(data).subscribe(
            (res) => {
                if (res.data) {
                    this.teacherList = this.teacherList.concat(res.data);
                }
                this.page.load = true;
            }
        )
    }

    //讨论列表
    getTalkList() {
        const load = this.loadCtrl.create();
        load.present();
        const data = {
            pageSize: this.page.pageSize,
            page: this.page.page,
            TopicType: this.TopicType,   //teacher  course
            topicID: this.topicID
        }
        this.learnSer.GetTalkList(data).subscribe(
            (res) => {
                load.dismiss();
                this.list = res.data.CommentItems;
                this.page.total = res.data.TotalCount;
                this.page.load = true;
            }
        );
    }

    //前往评论
    openComment() {
        if (!this.page.load) {
            this.commonSer.toast("信息加载中...");
            return
        }
        let modal = this.modalCtrl.create(this.TopicType == 'talk' ? CommentComponent : CommentByCourseComponent, {
            placeholder: '请输入评价',
            type: this.TopicType,
            teacherList: this.teacherList
        });
        modal.onDidDismiss(res => {
            if (res) {
                if (this.TopicType == 'talk') this.talkhandle(res);
                if (this.TopicType == 'teacher') this.teacherHandle(res);
            }
        });
        modal.present();
    }

    //课程讨论
    talkhandle(res) {
        const data = {
            TopicID: this.topicID,
            Contents: res.replyContent,
            TopicType: 'talk'
        };
        this.learnSer.Savetalk(data).subscribe(
            (res) => {
                this.commonSer.toast('发表成功');
                this.getTalkList();
            }
        )
    }

    //课程评价
    teacherHandle(res) {
        const data = {
            TopicID: res.TopicID,
            Score: res.score,
            Contents: res.replyContent,
            TopicType: this.TopicType
        };
        this.learnSer.SaveAppComment(data).subscribe(
            (res) => {
                if (res.data) {
                    this.commonSer.toast('评价成功');
                    this.getList();
                } else {
                    this.commonSer.toast(`每人只能评价一次`);
                }
            }
        )
    }

    //选择讲师 --所有
    setTeacher(item, i) {
        this.selectTeacher = i;
        const data = {
            pageSize: this.page.pageSize,
            page: this.page.page,
            TopicType: 'teacher',   //teacher  course
            topicID: item.UserID ? item.UserID : "",
            PID: this.navParams.get("PId")
        };
        this.learnSer.GetComment(data).subscribe(
            (res) => {
                this.list = res.data.CommentItems;
                this.page.total = res.data.TotalCount;
            }
        );
    }

}
