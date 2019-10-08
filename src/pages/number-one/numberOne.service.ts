import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";
import { DatePipe } from '@angular/common';

@Injectable()
export class numberOneService {

    constructor(private http: HttpClient,private nativeHttp:HTTP,private datePipe: DatePipe) {
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


    // 格式化时间
    formatDate(date, flag?: Number) {
        if (date) {
          switch (flag) {
            case 0:
              return this.datePipe.transform(date, 'yyyy');
            case 1:
              return this.datePipe.transform(date, 'yyyy-MM');
            case 2:
              return this.datePipe.transform(date, 'yyyy-MM-dd');
            case 3:
              return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
            case 4:
                return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm');
          }
        } else {
          return null;
        }
      }

}