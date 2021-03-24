import { Component, Input } from '@angular/core';
import { LearnService } from '../../pages/learning/learn.service';

@Component({
  selector: 'comment-star',
  templateUrl: 'comment-star.html'
})
export class CommentStarComponent {
  starList = new Array(5);
  item =<any> {};

  constructor(private learnSer:LearnService) {
    
  }

  //课程的平均评价
  getCommentList(PrId) {
    const data2 = {
        topicID: PrId
    }
    this.learnSer.GetQCommentNum(data2).subscribe(  //课程评价
        (res) => {
            if (res.data) {
                this.item = res.data;
            }
        }
    );
}

}
