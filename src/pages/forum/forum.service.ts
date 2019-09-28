import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";

@Injectable()
export class ForumService {

    constructor(private http: HttpClient,private nativeHttp:HTTP) {
    }

    // 获取 板块列表
    forum_topicplate_list(){
        return this.http.post(SERVER_API_URL + '/forum/topicplate/list',{});
    }
    forum_post_get(postId){
        return this.http.post(SERVER_API_URL + '/forum/post/get',{postId});
    }
  
    // /api/forum/topicplate/list
}