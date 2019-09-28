import {HttpClient} from "@angular/common/http";import {Injectable} from "@angular/core";import {Observable} from "rxjs/Observable";import {SERVER_API_URL} from "../../app/app.constants";import {HTTP} from "@ionic-native/http";import {DataFormatService} from "../../core/dataFormat.service";@Injectable()export class HomeService {    constructor(private http: HttpClient, private nativeHttp: HTTP,                private dataFormat: DataFormatService) {    }    //获取banner    getBannerList(): Observable<any> {        return this.http.get(SERVER_API_URL + '/ENews/GetBannerList')    }    //优秀教师，关注教师    GetGoodTeacherList(): Observable<any> {        return this.http.get(SERVER_API_URL + '/user/GetGoodTeacherList')    }    //课程分类    GetDictionaryByPCode(params): Observable<any> {        return this.http.get(SERVER_API_URL + '/EProduct/GetEproductCountByCode?code=' + params);    }    //答题超时检测--检查学生的所有考试是否有已超时的，如果有则系统自动提交    checkTimeOutByStu(): Observable<any> {        return this.http.get(SERVER_API_URL + '/exam/checkTimeOutByStu');    }    //获取服务器系统时间    getSysDateTime(): Observable<any> {        return this.http.get(SERVER_API_URL + '/common/getSysDateTime');    }    //获取学生考试剩余时间（分钟）    getStuSurplu(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/study/getStuSurplu' + this.dataFormat.toQuery(data));    }    //获取学生个人所有考试信息    getMyScoreList(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/study/getMyScoreList', data);    }}