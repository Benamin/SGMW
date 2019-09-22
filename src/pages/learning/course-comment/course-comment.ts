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

    teacherList = [
        {img: null, name: '全部讲师'},
        {img: "./assets/imgs/home/goodTeacher.png", name: '秋国烟'},
        {img: "./assets/imgs/home/goodTeacher.png", name: '秋国烟'},
        {img: "./assets/imgs/home/goodTeacher.png", name: '秋国烟'},
        {img: "./assets/imgs/home/goodTeacher.png", name: '秋国烟'},
        {img: "./assets/imgs/home/goodTeacher.png", name: '秋国烟'},
        {img: "./assets/imgs/home/goodTeacher.png", name: '秋国烟'},
    ];
    selectTeacher;

    page = {
        pageSize: 1000,
        page: 1,
        total: null
    };
    topicID;
    TopicType;
    placeholder;


    constructor(public navCtrl: NavController, public navParams: NavParams, private commonSer: CommonService,
                private modalCtrl: ModalController, private learnSer: LearnService) {
    }

    ionViewDidLoad() {
        this.topicID = this.navParams.get("TopicID");
        this.TopicType = this.navParams.get("TopicType");
        this.title = this.navParams.get("title");
        this.placeholder = this.navParams.get("placeholder");
        if (this.TopicType != 'talk') this.getList();
        if (this.TopicType == 'talk') this.getTalkList();
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
    }

    getTalkList() {
        const data = {
            pageSize: this.page.pageSize,
            page: this.page.page,
            TopicType: this.TopicType,   //teacher  course
            topicID: this.topicID
        }
        this.learnSer.GetTalkList(data).subscribe(
            (res) => {
                this.list = res.data.CommentItems;
                this.page.total = res.data.TotalCount;
            }
        );
    }

    openComment() {
        let modal = this.modalCtrl.create(CommentComponent, {placeholder: '请输入评价', type: this.TopicType});
        modal.onDidDismiss(res => {
            if (res) {
                if (this.TopicType == 'talk') this.talkhandle(res);
                if (this.TopicType != 'talk') this.replyHandle(res);
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
        }
        this.learnSer.Savetalk(data).subscribe(
            (res) => {
                this.commonSer.toast('发表成功');
                this.getTalkList();
            }
        )
    }

    //课程评价||教师评价
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
    }

    //选择讲师
    setTeacher(item, i) {
        this.selectTeacher = i;
    }

}
