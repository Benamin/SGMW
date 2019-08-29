import {HttpClient} from "@angular/common/http";import {Injectable} from "@angular/core";import {Observable} from "rxjs/Observable";import {SERVER_API_URL} from "../../app/app.constants";import {HTTP} from "@ionic-native/http";import {DataFormatService} from "../../core/dataFormat.service";@Injectable()export class MineService {    constructor(private http: HttpClient, private nativeHttp: HTTP, private dataForm: DataFormatService) {    }    //我的收藏    GetMyCollectionProductList(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/EProduct/GetMyCollectionProductList', data)    }    //我的课程的数量    GetMyProductCount(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/EProduct/GetMyProductCount', data)    }    //课程列表    GetMyProductList(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/EProduct/GetMyProductList', data)    }    //通知中心    GetUserNewsList(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/appnews/GetUserNewsList', data)    }    //通知信息详情    GetNewsById(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/appnews/GetNewsById' + this.dataForm.toQuery(data))    }    //作业列表    getMyScores(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/study/getMyScoresP', data)    }    //作业题目    homeworkInit(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/study/homeworkInit' + this.dataForm.toQuery(data), null);    }    //暂存作业    saveStuExams(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/study/saveStuExams', data);    }    //提交作业    submitStuExams(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/study/submitStuExams', data);    }    //获取成绩    getStuScore(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/study/getStuScore' + this.dataForm.toQuery(data), null);    }}