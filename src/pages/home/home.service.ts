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
        return this.http.get(SERVER_API_URL + '/ENews/GetBannerListByRole?RoleID=' + RoleID);
    }

    //热门课程
    GetHotProductList(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/EProduct/GetHotProductList');
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
        return this.http.post(SERVER_API_URL + '/area/getAreaCitys', data);
    }

    //今日提醒
    GetTodayRemind() {
        return this.http.post(SERVER_API_URL + '/appStudyPlan/GetTodayRemind', {});
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

    // 小视频总列表列表
    GetVideoLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/GetShortVideoList', data);
    }

    //短视频发布
    PublicShortVideo(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/PublicShortVideo', data);
    }

    //根据code获取话题ID
    GetTopicID(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/appTopic/GetTopicID' + this.dataFormat.toQuery(data));
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
        // searchrank
        return this.http.post(SERVER_API_URL + '/forum/post/GetPostLeaderboardByTopicTag', data);
    }

    // 所有帖子 最新最热 列表
    GetAllTopicLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/forum/post/searchrownum', data);
    }

    // 短视频排行榜-销售大赛
    GetShortVideoCompitLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/GetShortVideoLeaderboardListByTopic', data);
    }

    // 所有短视频 最新最热列表接口
    GetShortVideoLists(data): Observable<any> {
        let newData = Object.assign(data, {SortDir: 'desc'});
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

    //点赞/取消点赞接口
    shortVideoLike(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/AppShortVideo/Like' + this.dataFormat.toQuery(data));
    }

    //获取某个短视频的评论列表
    GetShortVideoReplyList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/GetShortVideoReplyList', data);
    }

    //新增评论
    ShortVideoReplyAdd(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/reply/add', data);
    }

    //回复短视频评论
    replyComment(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppShortVideo/replycomment/add', data);
    }

    //查询某个视频的详细信息
    GetShortVideoDetail(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/AppShortVideo/GetShortVideoDetail' + this.dataFormat.toQuery(data));
    }

    //查询视频的上一个和下一个
    GetTopDownShortVideoDetail(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/AppShortVideo/GetTopDownShortVideoDetail' + this.dataFormat.toQuery(data));
    }

    // 获取服务大赛 的区域和省份 数据
    GetServerCompArea(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/appGetUserArea/NewGetUserAreaQY' + this.dataFormat.toQuery(data));
    }

    // 获取服务大赛 的区域和省份 数据
    GetServerCompProvince(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/appGetUserArea/NewGetUserAreaSF' + this.dataFormat.toQuery(data));
    }

    //获取服务大赛 所有 列表
    GetServiceRankingList(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/forum/post/getservicecontestdatalist' + this.dataFormat.toQuery(data));
    }

    //获取服务大赛 所有 列表
    GetServiceRankingTJList(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/forum/post/getservicecontestdata' + this.dataFormat.toQuery(data));
    }

    //获取服务大赛 是否有 上传短视频 的 权限
    GetAddAuthority(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/appGetUserArea/NewGetUserAreaQX' + this.dataFormat.toQuery(data));
    }

    //每日一学
    GetMeiryx(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/news/GetMeiryx', data);
    }

    //获取subject tree
    getSubjectTree(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/common/getSubjectTree');
    }

    /***刷题***/
    //创建考试
    InsertExercise(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/InsertExercise', data);
    }

    //查询刷题的试题
    SelectExamByStu(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/SelectExamByStu', data);
    }


    //刷题考试回顾
    GetOldExamDetailByStu(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/exam/GetOldExamDetailByStu', data);
    }

    // 用户等级信息
    getAdvancedLevel(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/SelectApproeInformation', data);
    }

    // 用户等级对应学习情况
    getAdvancedLists(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/SelectCsExamDeatil', data);
    }

    // 进入页面时验证用户是否存在认证流程
    ValidationLevel(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/ValidationLevel', data);
    }
    // 未存在等级第一次进入时选择认证流程进行初始化
    InitializeLevel(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/InitializeLevel', data);
    }

    // 更改已选定的认证流程
    UpdateInitializeLevel(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/UpdateInitializeLevel', data);
    }

    // 获取所有认证进阶流程 角色类型
    GetRoleByPCode(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/Dictionary/GetDictionaryByPCode' + this.dataFormat.toQuery(data));
    }

    // 初始化课程考试
    // InitExamCourse(data): Observable<any> {
    //     return this.http.post(SERVER_API_URL + '/EApprove/InitExamCourse', data);
    // }

    // 根据条件查询课程
    QueryCourse(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/QueryCourse', data);
    }
    // 根据条件查询考试
    QueryExam(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/QueryExam', data);
    }
    // 查询实操评分
    QuerySpeakScore(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/QuerySpeakScore', data);
    }

    // 查询kpi信息
    QueryKpiInformation(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/QueryKpiInformation', data);
    }

    LevelRemake(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EApprove/LevelRemake', data);
    }

    /**学习任务**/
    //可选任务时间列表
    TaskPlanTime(): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppStudyTask/TaskPlanTime', null);
    }

    //根据月份查询学习任务
    StudyTaskList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppStudyTask/StudyTaskList', data);
    }

    //根据月份查询学习任务
    SaveStudyTaskList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppStudyTask/SaveStudyTaskList', data);
    }

    //根据课程查询我的同学
    StudyPlanList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/AppStudyTask/StudyPlanList', data);
    }

    //
    // 查询 “资料专区” 列表
    GetQueryMaterialFile(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EMaterialFile/QueryMaterialFile', data);
    }

    // 查询个人基本信息
    GetPosterInformation(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/EQuestionManagement/PosterInformation' + this.dataFormat.toQuery(data));
    }

    // 关注作者用户
    setFollower(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/Follower', data);
    }

    // 查询 人员发帖列表
    GetSearchNewRetFollower(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/SearchNewRetFollower', data);
    }

    // 查询 人员的回帖列表
    GetPostReply(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/PostReply', data);
    }

    // 查询 关注人的课程评价列表
    GetCourseReply(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/CourseReplyList', data);
    }

    // 查询 查询问题列表（猜你想问）
    GetQueryQuestionItems(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/QueryQuestionItems', data);
    }

    // 获取 问题类型（猜你想问）
    GetAskType(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/Dictionary/GetDictionaryByPCode' + this.dataFormat.toQuery(data));
    }

    // 提交问题（猜你想问）
    PutQuestion(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/PutQuestion', data);
    }

    // 添加或取消 “我也想问“ 成功后 数量+1（猜你想问）
    AddOrCancelFocus(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EQuestionManagement/AddOrCancelFocus', data);
    }

    /**主题活动**/
    //主页主题活动显示信息
    SelectThemeActivityInformation(): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EThemeActivity/SelectThemeActivityInformation', null);
    }

    //
    AppSelectThemeActivity(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/EThemeActivity/AppSelectThemeActivity', data);
    }
}
