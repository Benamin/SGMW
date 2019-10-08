import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { SERVER_API_URL } from "../../app/app.constants";
import { HTTP } from "@ionic-native/http";
import { DataFormatService } from "../../core/dataFormat.service";
import { ToastController } from 'ionic-angular';

/**
 * 
 * 

/api/forum/post/status 获取论坛帖子状态列表,参数:无
/api/forum/topicplate/list 获取论坛版块列表,参数:无
/api/forum/post/add 新增论坛帖子信息,参数:
{
  "Id": "00000000-0000-0000-0000-000000000000",//帖子编号,可忽略
  "Title": "string",//帖子标题
  "TopicPlateId": "00000000-0000-0000-0000-000000000000",//帖子所属板块编号
  "Content": "string",//帖子内容
  "Creater": "string",//帖子创建人,可忽略
  "Modifyer": "string",//修改人,可忽略
  "IsSaveAndPublish": true//是否保存并提交
}
/api/forum/post/delete 删除论坛帖子信息,参数:postId,帖子编号
/api/forum/post/get 获取指定编号的帖子信息,参数:postId,帖子编号
/api/forum/post/search 搜索论坛帖子信息,参数:
{
  "Title": "string",//标题关键字
  "TopicPlateId": "00000000-0000-0000-0000-000000000000",//所属板块
  "Status": 0,//状态
  "Creater": "string",//发帖人
  "OrderBy": "string",//排序字段
  "OrderByDirection": "string",//排序方式
  "PageIndex": 0,//数据分页索引
  "PageSize": 0//每页显示的记录数
}
/api/forum/post/publish 发布指定的帖子信息,参数:postId,帖子编号
/api/forum/post/edit 修改指定的论坛帖子信息,参数:
{
  "Id": "00000000-0000-0000-0000-000000000000",//帖子编号
  "Title": "string",//帖子标题
  "TopicPlateId": "00000000-0000-0000-0000-000000000000",//帖子所属板块编号
  "Content": "string",//帖子内容
  "Creater": "string",//帖子创建人,可忽略
  "Modifyer": "string",//修改人,可忽略
  "IsSaveAndPublish": true,//是否保存并提交
}
/api/forum/reply/add 新增论坛回帖信息,参数:
{
  "Id": "00000000-0000-0000-0000-000000000000",//回帖编号,可忽略
  "PostId": "00000000-0000-0000-0000-000000000000",//帖子编号
  "Content": "string",//回帖内容
  "CurrentUser": "string"//当前用户,可忽略
}
/api/forum/reply/delete 删除回帖,参数:postReplyId,回帖编号
/api/forum/replycomment/add 新增论坛回帖评论信息,参数:
{
  "Id": "00000000-0000-0000-0000-000000000000",//回帖评论编号,可忽略
  "PostReplyId": "00000000-0000-0000-0000-000000000000",//评论的回帖编号
  "Content": "string",//评论内容
  "MentionUser": "string",//回复用户的loginName
  "CurrentUser": "string"//当前用户,可忽略
}
/api/forum/replycomment/delete 删除回帖评论,参数:postReplyCommentId,回帖评论编号


/api/forum/post/follow 关注帖子,参数:postId,帖子编号
/api/forum/post/cancelfollow 取消关注帖子,参数:postId,帖子编号
/api/forum/post/myfollows 我关注的帖子列表,参数:{"PageIndex": int,"PageSize": int},参数描述:PageIndex:数据分页索引,PageSize:每页显示的记录数
/api/forum/post/favorites 收藏帖子,参数:postId,帖子编号
/api/forum/post/cancelfavorites 取消收藏帖子,参数:postId,帖子编号
/api/forum/post/myfavorites 我收藏的帖子列表,参数:{"PageIndex": int,"PageSize": int},参数描述:PageIndex:数据分页索引,PageSize:每页显示的记录数
/api/forum/post/like 帖子点赞,参数:postId,帖子编号
/api/forum/post/cancellike 取消点赞帖子,参数:postId,帖子编号
/api/forum/post/mylikes 我点赞的帖子列表,参数:{"PageIndex": int,"PageSize": int},参数描述:PageIndex:数据分页索引,PageSize:每页显示的记录数
/api/forum/post/dislike 帖子点踩,参数:postId,帖子编号
/api/forum/post/canceldislike 取消点踩帖子,参数:postId,帖子编号
/api/forum/post/mydislikes 我点踩的帖子列表,参数:{"PageIndex": int,"PageSize": int},参数描述:PageIndex:数据分页索引,PageSize:每页显示的记录数
/api/forum/badge/mybadges 我的论坛勋章,参数:无




 * */
let aa = {
  "Result": 0, "data": {
    "SetTopTime": "0001-01-01T00:00:00",
    "LockTime": "0001-01-01T00:00:00",
    "PosterHeadPhoto": "https://devstoragec.blob.core.chinacloudapi.cn/picture/userdefault120190826174653.jpg",
    "Replys": [{
      "Id": "51da3402-9e08-4487-996f-016d7d896c9f", "PostId": "ff123bcf-1c4e-448d-8f12-016d7d6a9350",
      "Content": "测试回帖内容77b1627c2f4e4de8b4fee44f386b49fc", "PostTitle": null, "IsAdminDeleted": false,
      "ReplyTime": "2019-09-29T15:00:21.279517", "ReplyTimeFormatted": "2019-09-29 15:00:21", "PosterUserName": "ShuaiHua Du",
      "ReplyHeadPhoto": "https://devstoragec.blob.core.chinacloudapi.cn/picture/userdefault120190826174653.jpg", "CommentCount": 0, "Comments": []
    }],
    "Id": "ff123bcf-1c4e-448d-8f12-016d7d6a9350", "Title": "SGMW企业介绍@637053639995678171",
    "TopicPlateId": "8dd8410d-5828-6352-3b79-0405039d37dc",
    "TopicPlateName": "默认版块",
    "Content": "<div class='part text'>\r\n    <h4>SGMW企业介绍</h4>\r\n    <p>\r\n        2002年11月18日，上汽通用五菱汽车股份有限公司挂牌成立。<br>\r\n        <span>由上海汽车集团股份有限公司、通用汽车(中国)公司、</span><span>柳州五菱汽车有限责任公司三方共同组建的大型中中外合资汽车公司，</span><span>其前身可以追溯到1958年成立的柳州汽车动力机械厂。</span><span>公司目前拥有柳州河西总部、柳州宝骏基地、</span><span>青岛分公司和重庆分公司四大制造基地，</span><span>形成了南北联动、东西呼应的发展新格局，</span><span>为公司在“十二五”末实现200万产能规模及后续发展提供坚实保障。</span>\r\n    </p>\r\n    <p><span>上汽通用五菱全面实施产品“平台百万化、平台差异化、</span><span>平台乘用化以及国际化”的平台战略，</span><span>不断推进企业及产品的转型升级。</span></p>\r\n    <p><span>上汽通用五菱以“低成本、高价值”为企业经营理念，</span><span>充分集成股东各方的先进管理方法、</span><span>全面推进企业业务流程重组和内外资源整合，</span><span>逐步形成了具有核心竞争力的五菱价值链；</span><span>在巩固微车领域优势、成功开拓七座家用车市场、<i></i>稳步推进乘用车业务的同时，</span><span>加速推进海外事业核心业务，开启实践知识与产品输出、</span><span>人力资本与团队输出和业务运营与最佳实践输出的国际化战略，</span><span>海外业务实现了最有价值的知识输出。</span><span>同时，为进一步响应国家“一带一路”战略，进一步抢占海外市场，</span><span>上汽通用五菱在印尼设立了子公司上汽通用五菱印尼汽车有限公司</span><span>并于2015年8月20日奠基，开拓东南亚市场。</span><span>上汽通用五菱已经连续9年保持国内单一车企销量冠军，</span><span>积累了超过1300万用户。</span><span>上汽通用五菱已经从传统自我奋斗型企业脱变为一个</span><span>“多点制造、商乘并举、跨洋出海”的学习创新型现代化企业，</span><span>逐渐成长为国内领先、国际上有竞争力的汽车公司！</span></p>\r\n</div>\r\n<div class='cul_box intbox_1'>\r\n    <h2>青岛分公司</h2>\r\n    <div class='cul_txt1'>\r\n        <span>2002年11月18日，上汽通用五菱汽车股份有限公司挂牌成立。</span>\r\n        <span>上汽通用五菱已经连续9年保持国内单一车企销量冠军，<i></i>积累了超过1300万用户。</span>\r\n        <span>上汽通用五菱已经从传统自我奋斗型企业脱变为一个<i></i>“多点制造、商乘并举、跨洋出海”的学习创新型现代化企业，</span>\r\n        <span>逐渐成长为国内领先、国际上有竞争力的汽车公司！</span>\r\n    </div>\r\n</div>\r\n<img src='https://www.sgmw.com.cn/images/company/pic_intro_2_1920.jpg' alt=''>\r\n<div class='cul_box intbox_2'>\r\n    <h2>重庆分公司</h2>\r\n    <div class='cul_txt1'>\r\n        <span>2002年11月18日，上汽通用五菱汽车股份有限公司挂牌成立。</span>\r\n        <span>上汽通用五菱已经连续9年保持国内单一车企销量冠军，<i></i>积累了超过1300万用户。</span>\r\n        <span>上汽通用五菱已经从传统自我奋斗型企业脱变为一个<i></i>“多点制造、商乘并举、跨洋出海”的学习创新型现代化企业，</span>\r\n        <span>逐渐成长为国内领先、国际上有竞争力的汽车公司！</span>\r\n    </div>\r\n</div>\r\n<img src='https://www.sgmw.com.cn/images/company/pic_intro_3_1920.jpg' alt=''>\r\n<div class='cul_box intbox_2 intbox_x'>\r\n    <h2>柳州河西总部</h2>\r\n    <div class='cul_txt1'>\r\n        <span>2002年11月18日，上汽通用五菱汽车股份有限公司挂牌成立。</span>\r\n        <span>上汽通用五菱已经连续9年保持国内单一车企销量冠军，<i></i>积累了超过1300万用户。</span>\r\n        <span>上汽通用五菱已经从传统自我奋斗型企业脱变为一个<i></i>“多点制造、商乘并举、跨洋出海”的学习创新型现代化企业，</span>\r\n        <span>逐渐成长为国内领先、国际上有竞争力的汽车公司！</span>\r\n    </div>\r\n</div>\r\n<img src='https://www.sgmw.com.cn/images/company/pic_intro_4_1920.jpg' alt=''>\r\n<div class='cul_box intbox_1'>\r\n    <h2 style='top: 20%;'>\r\n        柳州宝骏基地\r\n    </h2>\r\n    <div class='cul_txt1' style='top: 28%;'>\r\n        <span>2002年11月18日，上汽通用五菱汽车股份有限公司挂牌成立。</span>\r\n        <span>上汽通用五菱已经连续9年保持国内单一车企销量冠军，<i></i>积累了超过1300万用户。</span>\r\n        <span>上汽通用五菱已经从传统自我奋斗型企业脱变为一个<i></i>“多点制造、商乘并举、跨洋出海”的学习创新型现代化企业，</span>\r\n        <span>逐渐成长为国内领先、国际上有竞争力的汽车公司！</span>\r\n    </div>\r\n</div>\r\n<img src='https://www.sgmw.com.cn/images/company/pic_intro_5_1920.jpg' alt=''>",
    "Status": 2,
    "StatusName": "发帖成功",
    "IsTop": false,
    "IsLocked": false,
    "Poster": "ShuaiHua Du", "PostTimeFormatted": "2019-09-29 14:26:39",
    "PostRelativeTime": "22 hours ago", "FollowCount": 1, "LikeCount": 0,
    "DislikeCount": 0, "FavoritesCount": 1, "ReplyCount": 1
  }, "message": "操作成功", "code": 200
}
@Injectable()
export class ForumService {

  constructor(private http: HttpClient,
    private nativeHttp: HTTP,
    private dataForm: DataFormatService,
    private toastCtrl: ToastController) {
  }

  // 获取 板块列表
  forum_topicplate_list() {
    return this.http.post(SERVER_API_URL + '/forum/topicplate/list', {});
  }

  // 获取指定编号的帖子信息
  // https://devapi.chinacloudsites.cn/api/forum/post/get?postId=C1F48775-C0EE-4A32-87BB-016D7D4C5F08
  forum_post_get(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/get?postId=' + postId.postId, { postId });

    // return this.http.post(SERVER_API_URL + '/forum/post/get',{postId});
  }

  // 获取 板块列表
  forum_topicplate_search(data) {
    return this.http.post(SERVER_API_URL + '/forum/topicplate/search', data);
  }

  // 获取 帖子列表
  forum_post_search(data) {
    return this.http.post(SERVER_API_URL + '/forum/post/search', data);
  }

  // 发布指定的帖子信息
  forum_post_publish(data) {
    return this.http.post(SERVER_API_URL + '/forum/post/publish', data);
  }

  // 新增帖子
  forum_post_add(data) {
    // "Id": "00000000-0000-0000-0000-000000000000",//帖子编号,可忽略
    // "Title": "string",//帖子标题
    // "TopicPlateId": "00000000-0000-0000-0000-000000000000",//帖子所属板块编号
    // "Content": "string",//帖子内容
    // "Creater": "string",//帖子创建人,可忽略
    // "Modifyer": "string",//修改人,可忽略
    // "IsSaveAndPublish": true//是否保存并提交
    return this.http.post(SERVER_API_URL + '/forum/post/add', data);
  }

  // 修改 帖子
  forum_post_edit(data){
    return this.http.post(SERVER_API_URL + '/forum/post/edit', data);
  }


  //   /api/forum/post/follow 关注帖子,参数:postId,帖子编号
  // /api/forum/post/cancelfollow 取消关注帖子,参数:postId,帖子编号
  // /api/forum/post/myfollows 我关注的帖子列表,参数:{"PageIndex": int,"PageSize": int},参数描述:PageIndex:数据分页索引,PageSize:每页显示的记录数

  // 关注帖子
  follow(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/follow?postId=' + postId, { postId: postId });
  }
  // 取消关注帖子
  cancelfollow(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/cancelfollow?postId=' + postId, { postId: postId });
  }

  // 我关注的帖子列表
  myfollows(data) {
    return this.http.post(SERVER_API_URL + '/forum/post/myfollows', data);
  }


  // 收藏帖子
  favorites(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/favorites?postId=' + postId, { postId: postId });
  }
  // 取消收藏帖子
  cancelfavorites(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/cancelfavorites?postId=' + postId, { postId: postId });
  }

  // 我收藏的帖子列表
  myfavorites(data) {
    return this.http.post(SERVER_API_URL + '/forum/post/myfavorites', data);
  }

  //  帖子点赞,参数:postId,帖子编号
  forum_post_like(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/like?postId=' + postId, { postId: postId });
  }

  // 取消点赞帖子,参数:postId,帖子编号
  forum_post_cancellike(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/cancellike?postId=' + postId, { postId: postId });
  }
  // 我点赞的帖子列表
  mylikes(data) {
    return this.http.post(SERVER_API_URL + '/forum/post/mylikes', data);
  }

  // 评论帖子
  reply_add(data) {
    return this.http.post(SERVER_API_URL + '/forum/reply/add', data);
  }

  // 回复评论
  replycomment_add(data) {
    return this.http.post(SERVER_API_URL + '/forum/replycomment/add', data);
  }

  // 删除帖子
  post_delete(postId) {
    return this.http.post(SERVER_API_URL + '/forum/post/delete?postId=' + postId, { postId: postId });
  }

  // 关注的讲师列表
  GetSubscribeList(data) {
    return this.http.post(SERVER_API_URL + '/EStudentSubscribe/GetSubscribeList', data);
  }



  // 上传图片
  Upload_UploadFiles(formData) {
    return new Promise((resolve, reject) => {
      var oReq = new XMLHttpRequest();

      // export const UploadFilesSERVER_API_URL = '/api';
      const UploadFilesSERVER_API_URL = 'http://devapi.chinacloudsites.cn/api';
      // export const UploadFilesSERVER_API_URL = 'https://elearningapi.sgmw.com.cn/api';

      oReq.open("POST", UploadFilesSERVER_API_URL + "/Upload/UploadFiles", true);
      oReq.onload = function (oEvent: any) {
        if (oReq.status == 200) {
          resolve(JSON.parse(oEvent.currentTarget.responseText));
        } else {
        }
      };
      oReq.send(formData);
    })

    // return this.http.post(SERVER_API_URL + '/Upload/UploadFiles', data);
  }

  // 过滤时间
  PostRelativeTimeForm(text) {
    let newText = "";
    newText = text.replace('second', '秒');
    newText = text.replace('minute', '分钟');
    newText = text.replace('hour', '小时');

    newText = text.replace('day', '天');
    newText = text.replace('week', '周');
    newText = text.replace('month', '个月');
    newText = text.replace('quarter', '个季度');
    newText = text.replace('year', '年');

    newText = text.replace(' ', "");
    newText = text.replace(' ', "");
    newText = text.replace('s', '');
    newText = text.replace('ago', "前");
    return newText;
  }

  // 去重
  listSplice(arr) {
    let arropt = {};
    for (let n = 0; n < arr.length; n++) {
      if (!arropt[arr[n].Id]) {
        arropt[arr[n].Id] = arr[n];
      } else {
        arr.splice(n, 1);
      }
    }
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  iosOrAndroid() {

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid == true) {
      return 'Android'
    }
    if (isiOS == true) {
      return 'Ios'
    }

  }
}