import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {
    env,
    SERVER_API_URL,
    SERVER_API_URL_DEV,
    SERVER_API_URL_PROD,
    SERVER_API_URL_UAT
} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";
import {DataFormatService} from "../../core/dataFormat.service";
import {ToastController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";

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
        return this.http.post(SERVER_API_URL + '/forum/post/get?postId=' + postId.postId, {postId});
    }

    // searchnewbkandht
    // 获取 板块列表
    forum_topicplate_search(data) {
        return this.http.post(SERVER_API_URL + '/forum/topicplate/search', data);
    }

    //获取 板块列表
    newsearchforumtopicplate(data) {
        return this.http.post(SERVER_API_URL + '/forum/topicplate/newsearchforumtopicplate', data);
    }

    // 获取 话题列表
    topicplateSearchtopictag(data) {
        return this.http.post(SERVER_API_URL + '/forum/topicplate/searchtopictag', data);
    }

    // 新增帖子 可选择 板块 、话题
    addnewforumtagpost(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/addnewforumtagpost', data);
    }

    // 修改帖子 可选择 板块 、话题
    editforumtagpost(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/editforumtagpost', data);
    }

    // 获取 帖子列表
    forum_post_search_old(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/search', data);
    }

    // 获取 帖子列表
    forum_post_search(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/searchnewbkandht', data);
    }

    // 发布指定的帖子信息
    forum_post_publish(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/publish', data);
    }

    // 新增帖子
    forum_post_add(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/add', data);
    }

    // 修改 帖子
    forum_post_edit(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/edit', data);
    }

    // 关注帖子
    follow(postId) {
        return this.http.post(SERVER_API_URL + '/forum/post/follow?postId=' + postId, {postId: postId});
    }

    // 取消关注帖子
    cancelfollow(postId) {
        return this.http.post(SERVER_API_URL + '/forum/post/cancelfollow?postId=' + postId, {postId: postId});
    }

    // 我关注的帖子列表
    myfollows(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/myfollows', data);
    }


    // 收藏帖子
    favorites(postId) {
        return this.http.post(SERVER_API_URL + '/forum/post/favorites?postId=' + postId, {postId: postId});
    }

    // 取消收藏帖子
    cancelfavorites(postId) {
        return this.http.post(SERVER_API_URL + '/forum/post/cancelfavorites?postId=' + postId, {postId: postId});
    }

    // 我收藏的帖子列表
    myfavorites(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/myfavorites', data);
    }

    //  帖子点赞,参数:postId,帖子编号
    forum_post_like(postId) {
        return this.http.post(SERVER_API_URL + '/forum/post/like?postId=' + postId, {postId: postId});
    }

    // 取消点赞帖子,参数:postId,帖子编号
    forum_post_cancellike(postId) {
        return this.http.post(SERVER_API_URL + '/forum/post/cancellike?postId=' + postId, {postId: postId});
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
        return this.http.post(SERVER_API_URL + '/forum/post/delete?postId=' + postId, {postId: postId});
    }

    // 关注的讲师列表
    GetSubscribeList(data) {
        return this.http.post(SERVER_API_URL + '/EStudentSubscribe/GetSubscribeList', data);
    }

    // 首页 热门帖子
    GetPostSearchnewret(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/searchhotpostbytimedesc', data);
    }


    // 论坛 热门帖子
    GetPostSearchhotpost(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/searchnewret', data);

    }

    // 我我发布的 帖子
    GetMypost(data) {
        return this.http.post(SERVER_API_URL + '/forum/post/MyPostsEdit', data);

    }

    // 我是否关注收/收藏/点赞帖子
    GetForumPostOtherStatus(postId) {
        return this.http.post(SERVER_API_URL + '/forum/post/GetForumPostOtherStatus?postId=' + postId, {postId: postId});
    }

    //查询所有话题
    searchtopictag(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/forum/topicplate/searchtopictag', data);
    }

    //查询最近使用的话题
    LatelyTopic(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/LatelyTopic', data);
    }

    //新增话题
    addtopictag(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/forum/topicplate/addtopictag', data);
    }

    //查询关注的人的贴子
    SearchNewRetFollower(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/SearchNewRetFollower', data);
    }

    // 上传图片
    Upload_UploadFiles(formData) {
        return new Promise((resolve, reject) => {
            var oReq = new XMLHttpRequest();

            const UploadFilesSERVER_API_URL = (env === 'localhost' ? SERVER_API_URL_DEV : (env == 'dev' ? SERVER_API_URL_DEV : (env == 'uat' ?
                SERVER_API_URL_UAT : (env == 'prod' ? SERVER_API_URL_PROD : ''))));

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
            position: 'middle',
            closeButtonText: "关闭"
        });
        toast.onDidDismiss(() => {
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

    //判断是否ios13、14
    isIOS14() {
        const str = navigator.userAgent.toLowerCase();
        const ver = str.match(/cpu iphone os (.*?) like mac os/);
        const v = ver[1].replace(/_/g, ".");
        if (v.includes('13') || v.includes('14')) {
            return true
        } else {
            return false;
        }
    }

}
