import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LearnService} from '../../pages/learning/learn.service';
import {CommentByCourseComponent} from "../comment-by-course/comment-by-course";
import {ModalController} from "ionic-angular";

@Component({
    selector: 'comment-star',
    templateUrl: 'comment-star.html'
})
export class CommentStarComponent {
    starList = new Array(5);
    @Input() IsComment;
    @Output() flashData = new EventEmitter<any>();
    item = <any>{};
    PrId;
    noData = false;
    isLoad = false;

    constructor(private learnSer: LearnService, private modalCtrl: ModalController) {

    }

    //课程的平均评价
    getCommentList(PrId) {
        this.PrId = PrId;
        const data2 = {
            CsId: PrId
        }
        this.learnSer.GetQCommentNum(data2).subscribe(  //课程评价
            (res) => {
                this.isLoad = true;
                if (res.data) {
                    this.noData = false;
                    this.item = res.data;
                    this.item.Text = this.item.Score;
                    this.item.Score = this.item.Score / 2;
                } else {
                    this.noData = true;
                }
            }
        );
    }

    //打开课程评论弹窗
    openComment() {
        let modal = this.modalCtrl.create(CommentByCourseComponent, {
            placeholder: '请理性发言，文明用语...',
            type: 'course',
            TopicID: this.PrId,
        });
        modal.onDidDismiss(res => {
            if (res) {
                this.flashData.emit();
            }
        });
        modal.present();
    }

}
