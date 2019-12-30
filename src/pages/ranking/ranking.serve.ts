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
}