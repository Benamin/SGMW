import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";






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
 * */ 

@Injectable()
export class ForumService {

    constructor(private http: HttpClient,private nativeHttp:HTTP) {
    }

    // 获取 板块列表
    forum_topicplate_list(){
        return this.http.post(SERVER_API_URL + '/forum/topicplate/list',{});
    }

    // 获取指定编号的帖子信息
    forum_post_get(postId){
        return this.http.post(SERVER_API_URL + '/forum/post/get',{postId});
    }

    // 获取 板块列表
    forum_topicplate_search(data){
        return this.http.post(SERVER_API_URL + '/forum/topicplate/search',data);
    }

    // 获取 帖子列表
    forum_post_search(data){
        return this.http.post(SERVER_API_URL + '/forum/post/search',data);
    }
  
    // 发布指定的帖子信息
    forum_post_publish(data){
        return this.http.post(SERVER_API_URL + '/forum/post/publish',data);
    }

    // 新增帖子
    forum_post_add(data){
        // "Id": "00000000-0000-0000-0000-000000000000",//帖子编号,可忽略
        // "Title": "string",//帖子标题
        // "TopicPlateId": "00000000-0000-0000-0000-000000000000",//帖子所属板块编号
        // "Content": "string",//帖子内容
        // "Creater": "string",//帖子创建人,可忽略
        // "Modifyer": "string",//修改人,可忽略
        // "IsSaveAndPublish": true//是否保存并提交
        return this.http.post(SERVER_API_URL + '/forum/post/add',data);
    }






}