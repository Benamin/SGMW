import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";
import {DataFormatService} from "../../core/dataFormat.service";

@Injectable()
export class HomeService {

    constructor(private http: HttpClient, private nativeHttp: HTTP,
                private dataFormat: DataFormatService) {
    }

    //获取banner
    getBannerList(RoleID): Observable<any> {
        // return this.http.get(SERVER_API_URL + '/ENews/GetBannerList')
        return this.http.get(SERVER_API_URL + '/ENews/GetBannerListByRole?RoleID='+RoleID);
    }

    //优秀教师，关注教师
    GetGoodTeacherList(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/user/GetGoodTeacherList')
    }

    //课程分类
    GetDictionaryByPCode(params): Observable<any> {
        return this.http.get(SERVER_API_URL + '/EProduct/GetEproductCountByCode?code=' + params);
    }

    //答题超时检测--检查学生的所有考试是否有已超时的，如果有则系统自动提交
    checkTimeOutByStu(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/exam/checkTimeOutByStu');
    }

    //获取学生个人所有考试信息
    getMyScoreList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/study/getMyScoreList', data);
    }

    //搜索学生考试、作业、问卷列表
    searchExamByStu(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/searchExamByStu', data);
    }

    //获取试卷详情（基础信息+具体题目信息）
    getPaperDetailByStu(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/getPaperDetailByStu' + this.dataFormat.toQuery(data), null);
    }

    // 学生 考试/作业/问卷 及试卷视图-提交
    submitPaper(params, data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/submitPaper' + this.dataFormat.toQuery(params), data);
    }

    // 获取服务器系统时间
    getSysDateTime(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/common/getSysDateTime');
    }

    //获取学员答题剩余时间；单位-毫秒
    getStuSurplu(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/exam/getStuSurplu' + this.dataFormat.toQuery(data));
    }

    // 初始化学生作业
    initStuHomework(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/initStuHomework' + this.dataFormat.toQuery(data), null);
    }

    //获取区域+省份+城市
    getAreaCitys(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/area/getAreaCitys',data);
    }

    //今日提醒
    GetTodayRemind(){
        return this.http.post(SERVER_API_URL + '/appStudyPlan/GetTodayRemind',{});
    }

    // 岗位认证列表
    GetJobLevelList(data): Observable<any> {
        // return this.http.get(SERVER_API_URL + '/CourseSeries/GetPositionCourseSeriesList' + this.dataFormat.toQuery(data));
        return this.http.post(SERVER_API_URL + '/CourseSeries/GetPositionCourseSeriesList', data);
    }

    // 岗位认证详情
    GetJobLevelInfoById(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/CourseSeries/GetPostsCertificationDetail', data);
    }

    // 学习计划
    StydyPlan(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/appStudyPlan/GetStudyPlanListDayData', data);
    }

    // 获取学习计划日历 选中的那天的课程/考试
    getTodayCourse(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/appStudyPlan/GetStudyPlanListByDate', data);
    }

    // 线下 点击课程的 参加认证
    doUnlineSignIn(params): Observable<any> {
        return this.http.get(SERVER_API_URL + '/EProduct/BuyOfflineCourse?cspid=' + params.cspid + '&PostsCertificationpID=' + params.PostsCertificationpID);
    }
    // 岗位认证轮播的  点击报名按钮
    doJobLevelSignIn(params): Observable<any> {
        return this.http.get(SERVER_API_URL + '/EProduct/SignInPostCertification?pid=' + params);
    }

    // 小视频总列表
    GetVideoLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/GetShortVideoList', data);
    }

    // 考试项目列表
    GetExamProList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/examDetail', data);
    }

    // 获取当前登录人员考试排名
    GetSelfExamDetail(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/SelfExamDetail', data);
    }

    // 获取所有考试排行详情
    GetExamList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/ALLExamDetailRanking', data);
    }

    // 获取所在大区的当场考试排行详情(如 东区)
    GetDealerExamList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/DealerExamDetailRanking', data);
    }

    // 帖子排行榜 列表
    GetTopicCompetitionLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/forum/post/searchrank', data);
    }

    // 所有帖子 最新最热 列表
    GetAllTopicLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/forum/post/searchrownum', data);
    }

    // 短视频排行榜
    GetShortVideoCompitLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/GetShortVideoLeaderboardListByTopic', data);
    }

    // 所有短视频 最新最热列表接口
    GetShortVideoLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/GetAllShortVideoListByTopic', data);
    }

    // 获取话题ID接口
    GetCompetitionID(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/appTopic/GetTopicID' + this.dataFormat.toQuery(data));
    }

    // 获取当前人员所属的地区 列表加入地区
    GetCompetitionListUserArea(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/appGetUserArea/GetUserArea' + this.dataFormat.toQuery(data));
    }
}
