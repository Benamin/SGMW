import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ListsRankingPage} from "../lists-ranking/lists-ranking";
import {TotalRankingPage} from "../total-ranking/total-ranking";
import {EditPage} from "../edit/edit";
import {VideoBoxPage} from "../../short-video/video-box/video-box";

/**
 * 销售大赛 列表
 * 考试（第几轮考试列表）
 *    |-某一轮考试的列表
 * 帖子
 *    |-所有帖子
 *      |-最新
 *      |-最热
 *    |-帖子排行榜
 * 短视频
 *    |-所有视频
 *    |-大赛排行榜
 */

@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html',
})
export class CompetitionListsPage {
  userDefaultImg = './assets/imgs/userDefault.jpg';
  page = {
    checkType: 'exam',
    navliArr: [{
      lable: 'exam',
      text: '考试',
      secNav: null
    }, {
      lable: 'topic',
      text: '帖子',
      secNav: [
        {
          navBtnText: '所有帖子',
          navBtnEn: 'allTopic',
          isActived: true,
          thrNav: [
            {
              navBtnText: '最新',
              navBtnEn: 'new',
              isActived: true
            },
            {
              navBtnText: '最热',
              navBtnEn: 'hot',
              isActived: false
            }
          ]
        },
        {
          navBtnText: '帖子排行榜',
          navBtnEn: 'topicCompetition',
          isActived: false,
          thrNav: null
        }
      ]
    }, {
      lable: 'short-video',
      text: '短视频',
      secNav: [
        {
          navBtnText: '我的视频',
          navBtnEn: 'myVideo',
          isActived: true,
          thrNav: null
        },
        {
          navBtnText: '大赛排行榜',
          navBtnEn: 'ranking',
          isActived: false,
          thrNav: [
            {
              navBtnText: '最新',
              navBtnEn: 'new',
              isActived: true
            },
            {
              navBtnText: '最热',
              navBtnEn: 'hot',
              isActived: false
            }
          ]
        }
      ]
    }]
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListsPage');
  }

  // 一级导航切换 （注：考试不会有）
  changeCheckType(checkType) {
    if (this.page.checkType === checkType) return;
    this.page.checkType = checkType;
    console.log(888, this.page.checkType)
    // if (checkType === 'recommend') this.page.Type = 1;
    // if (checkType === 'all') this.page.Type = 2;
    // if (checkType === 'mine') this.page.Type = 3;
    // this.page.Page = 1;
    // this.getList();
  }

  // 二级导航切换 （注：考试不会有）
  changeSecNav(typeIndex, secNavIndex, bool) {
    if (bool) return;
    var otherIndex = 1
    if (secNavIndex === 1) otherIndex = 0;
    this.page.navliArr[typeIndex].secNav[otherIndex].isActived = false;
    this.page.navliArr[typeIndex].secNav[secNavIndex].isActived = true;
  }

  // 三级导航切换
  changeThrNav (typeIndex, secNavIndex, thrNavIndex, bool) {
    if (bool === true) return;
    var otherIndex = 1
    if (thrNavIndex === 1) otherIndex = 0;
    this.page.navliArr[typeIndex].secNav[secNavIndex].thrNav[otherIndex].isActived = false;
    this.page.navliArr[typeIndex].secNav[secNavIndex].thrNav[thrNavIndex].isActived = true;
  }

  // 点击更多进入总排名列表
  goTotalRanking() {
    this.navCtrl.push(TotalRankingPage);
  }

  // 进入考试排名列表
  goListsRanking(tid) {
    this.navCtrl.push(ListsRankingPage, {tid: tid});
  }

  // 进入图片/视频 编辑页面
  goToEdit() {
    this.navCtrl.push(EditPage, {editType: 'topic'});
  }

  // 进入视频播放页
  goVideoBox(vid) {
    this.navCtrl.push(VideoBoxPage, {vid: vid});
  }
}
