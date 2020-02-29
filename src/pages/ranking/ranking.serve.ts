import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";


@Injectable()
export class RankingService {
    constructor(private http: HttpClient, private nativeHttp: HTTP) {
    }

    // 排行榜列表
    GetRankList(){
        return this.http.get(SERVER_API_URL + '/forum/userbadge/rankList')
    }

    // 获取用户积分和头衔列表
    GetUsertitleSearch(data){
        return this.http.post(SERVER_API_URL + '/forum/usertitle/search',data);
    }
    
    // 获取考试榜
    getExamTopList(){
        return this.http.get(SERVER_API_URL + '/exam/getExamTopList');
    }

    // 加载更多讲师头衔
    badgeteachertitlelist(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/badgeteachertitlelist',data);
    }
    // 加载更多讲师活跃度
    teacherpostlist(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/teacherpostlist',data);
    }

    // 加载更多讲师评论榜单
    teachscorelist(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/teachscorelist',data);
    }
    
    // 加载更多学员榜
    studenttitlelist(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/studenttitlelist',data);
    }
    // 加载更多学员活跃度
    studentpostlist(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/studentpostlist',data);
    }

    // 加载更多学员完成课程数
    studentstudylist(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/studentstudylist',data);
    }
    
    
}