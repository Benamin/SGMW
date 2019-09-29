import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";

@Injectable()
export class ConsultationService {

    constructor(private http: HttpClient,private nativeHttp:HTTP) {
    }

    // 获取新闻列表
    GetNewsList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/news/GetNewsList',data);
    }

    // 获取新闻类别信息
    GetDictionaryByPCode(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/Dictionary/GetDictionaryByPCode?code=zxzx');
    }
    // 获取新闻详情
    GetNewsByID(id){
        return this.http.get(SERVER_API_URL + '/ENews/GetNewsByID?id='+id);
    }
    // 获取相关新闻
    GetRelationNewsByID(id): Observable<any> {
        return this.http.get(SERVER_API_URL + '/ENews/GetRelationNewsByID?id='+id);
    }

  

}