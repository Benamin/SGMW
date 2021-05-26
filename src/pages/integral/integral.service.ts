import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {FWZS_HTTP_URL, JunKe_HTTP_URL, NXSZS_HTTP_URL, SERVER_API_URL, XSZS_HTTP_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";
import {DataFormatService} from "../../core/dataFormat.service";

@Injectable()
export class IntegralService {

    constructor(private http: HttpClient, private nativeHttp: HTTP,
                private dataForm: DataFormatService) {
    }

    //每日签到
    DailyCheck(): Observable<any> {
        return this.http.post(SERVER_API_URL + '/IntegralOperation/DailyCheck', {})
    }

    //历史积分明细
    GetIntegralDetail(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/IntegralOperation/GetIntegralDetail', data)
    }

    //当日积分获取情况
    GetNowDayStatusIntegralDetail(): Observable<any> {
        return this.http.post(SERVER_API_URL + '/IntegralOperation/GetNowDayStatusIntegralDetail', {})
    }

    //当日积分获取情况
    NowDateGetIntegral(): Observable<any> {
        return this.http.post(SERVER_API_URL + '/IntegralOperation/NowDateGetIntegral', {})
    }
    //积分排行榜
    IntergralTable(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/IntegralOperation/IntergralTable', data)
    }
    //当日积分获取情况
    selectMyApplyEssence(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/forum/post/selectMyApplyEssence', data)
    }

    //启动图
    GetAppPic(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/ENews/GetAppPic');
    }

}
