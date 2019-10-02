import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";

@Injectable()
export class numberOneService {

    constructor(private http: HttpClient,private nativeHttp:HTTP) {
    }

    
    // 获取DOM
    GetDictionaryByPCode(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/Dictionary/GetDictionaryByPCode?code=NewsType');
    }

    // 获取销售案例
    newsGetNewsList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/news/GetNewsList',data);
    }
    // 获取销冠风采
    GetNewsList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/winnerNews/GetNewsList',data);
    }
  

    GetNewsByID(id): Observable<any> {
        return this.http.get(SERVER_API_URL + '/winnerNews/GetNewsByID?id='+id);
    }
    GetRelationNewsByID(id): Observable<any> {
        return this.http.get(SERVER_API_URL + '/winnerNews/GetRelationNewsByID?id='+id);
    }


  

}