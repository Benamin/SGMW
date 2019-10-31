import {HttpClient} from "@angular/common/http";import {Injectable} from "@angular/core";import {Observable} from "rxjs/Observable";import {SERVER_API_URL} from "../../app/app.constants";import {CommonService} from "../../core/common.service";import {DataFormatService} from "../../core/dataFormat.service";import {HTTP} from "@ionic-native/http";@Injectable()export class LearnService {    constructor(private http: HttpClient, private commonSer: CommonService,                private dataFormatSer: DataFormatService, private nativeHttp: HTTP) {    }    //获取课程列表    GetProductList(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/EProduct/GetProductList', data)    }    //分类列表    GetDictionaryByPCode(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/Dictionary/GetDictionaryByPCode' + this.dataFormatSer.toQuery(data));    }    //课程详情    GetProductById(params): Observable<any> {        return this.http.get(SERVER_API_URL + '/EProduct/GetProductById?pid=' + params);    }    //章节信息    GetAdminChapterListByProductID(params): Observable<any> {        return this.http.get(SERVER_API_URL + '/CourseSeries/GetAdminChapterListByProductID?id=' + params);    }    //关注教师    SaveSubscribe(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EStudentSubscribe/SaveSubscribe' + this.dataFormatSer.toQuery(data));    }    //取消关注教师    CancelSubscribe(params): Observable<any> {        return this.http.get(SERVER_API_URL + '/EStudentSubscribe/CancelSubscribe' + this.dataFormatSer.toQuery(params));    }    //相关课程    GetRelationProductList(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EProduct/GetRelationProductList' + this.dataFormatSer.toQuery(data));    }    //获取评价信息    GetCommentSum(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EComment/GetCommentSum' + this.dataFormatSer.toQuery(data));    }    //报名课程    BuyProduct(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EProduct/BuyProduct' + this.dataFormatSer.toQuery(data));    }    //收藏课程    SaveCollectionByCSID(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EComment/SaveCollectionByCSID' + this.dataFormatSer.toQuery(data));    }    //取消收藏    CancelCollectionByCSID(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EComment/CancelCollectionByCSID' + this.dataFormatSer.toQuery(data));    }    //提交评价    SaveComment(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/EComment/SaveComment', data)    }    //查询评价    GetComment(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/EComment/GetComment', data)    }    //初始化作业    initStuHomework(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/exam/initStuHomework' + this.dataFormatSer.toQuery(data), null)    }    //提交讨论    Savetalk(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/ETalk/Savetalk', data)    }    //讨论列表    GetTalkList(data): Observable<any> {        return this.http.post(SERVER_API_URL + '/ETalk/GetTalkList', data)    }    //更新学习进度    SaveStudy(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/StudentStudy/SaveStudy' + this.dataFormatSer.toQuery(data))    }    //课程里的老师    GetTeacherListByPID(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/ECourseSeries/GetTeacherListByPID' + this.dataFormatSer.toQuery(data))    }    //点赞    SavePraise(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EComment/SavePraise' + this.dataFormatSer.toQuery(data));    }    //取消点赞    CancelPraise(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EComment/CancelPraise' + this.dataFormatSer.toQuery(data));    }    //扔鸡蛋    SaveHate(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EComment/SaveHate' + this.dataFormatSer.toQuery(data));    }    //取消扔鸡蛋    CancelHate(data): Observable<any> {        return this.http.get(SERVER_API_URL + '/EComment/CancelHate' + this.dataFormatSer.toQuery(data));    }}