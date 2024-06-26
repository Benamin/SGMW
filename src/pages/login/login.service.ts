import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {FWZS_HTTP_URL, JunKe_HTTP_URL, NXSZS_HTTP_URL, SERVER_API_URL, XSZS_HTTP_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";
import {DataFormatService} from "../../core/dataFormat.service";

@Injectable()
export class LoginService {

    constructor(private http: HttpClient, private nativeHttp: HTTP,
                private dataForm: DataFormatService) {
    }

    //员工&&供应商--弃用
    loginpost(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/eaccount/Login', data)
    }

    //启动图
    GetAppPic(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/ENews/GetAppPic');
    }

    /**新宝骏助手登录**/
    //新宝骏助手app鉴权接口
    JunkeTrainAuth(data): Observable<any> {
        return this.http.post(JunKe_HTTP_URL + '/dmscloud.interfaceServer.yunyang/external/trainSys/tranAuth', {},
            {
                headers: {"jwt": data}
            });
    }

    //调用新宝骏助手接口登录
    JunkeAppAuthCas(data): Observable<any> {
        return this.http.post(JunKe_HTTP_URL + '/dmscloud.interfaceServer.yunyang/external/trainSys/login/appAuthCas', data);
    }

    //新宝骏助手app跳转登录 ---弃用
    //JunkeLogin(data): Observable<any> {
    //    return this.http.post(SERVER_API_URL + '/eaccount/getUserInfoJK', data);
    //}

    //用户名密码登录新宝骏助手用户--弃用
    //sgmwLoginJK(data): Observable<any> {
    //    return this.http.post(SERVER_API_URL + '/eaccount/sgmwLoginJK', data);
    //}

    /**end**/

    /***销售助手***/
    //经销商
    sgmwLogin(data, header): Observable<any> {
        return this.http.post(XSZS_HTTP_URL + '/LoginAPIHandler.ashx?action=validLogin_JXS', data,
            {
                headers: header
            })
    }

    //销售助手app跳转登录 ---弃用
    //XSZSLogin(data): Observable<any> {
    //    return this.http.post(SERVER_API_URL + '/eaccount/getUserInfoXSZS', data);
    //}

    //退出登录
    sgmwLogout(params): Observable<any> {
        return this.http.post(SERVER_API_URL + '/user/ExitLogin?JpushID=' + params, null);
    }

    /***end***/

    //版本号
    GetAppVersionByCode(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/AppVersion/GetAppVersionByCode' + this.dataForm.toQuery(data));
    }

    //new 登录方法 /connect/token
    connectToken(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/connect/token', this.dataForm.xxxFormData(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    //获取用户信息
    GetUserInfoByUPN(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/User/GetUserInfoByUPN');
    }

    //查询MainUserID
    GetUserByLoginId(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/user/GetUserByLoginId' + this.dataForm.toQuery(data));
    }

    //根据cardno获取用户信息
    GetUserByCardNo(data): Observable<any> {
        return this.http.get(SERVER_API_URL + '/user/GetUserByCardNo' + this.dataForm.toQuery(data));
    }

    //用作更新用户的验证信息
    UpdateUserByCardNo(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/user/UpdateUserByCardNo', data);
    }

    /***服务助手***/
    fwzsLogin(data, header): Observable<any> {
        return this.http.post(FWZS_HTTP_URL + '/login/userlogin', data,
            {
                headers: header
            })
    }

    /***新销售助手跳转登录***/
    NXSZSLogin(data, header): Observable<any> {
        return this.http.post(NXSZS_HTTP_URL + '/user/api/checkUserByAccessToken', this.dataForm.toFormData(data),
            {
                headers: header
            })
    }

    //菱菱助手登录
    //获取菱菱助手unionId
    LLZSGetUnionId(header): Observable<any> {
        return this.http.get(NXSZS_HTTP_URL + "/auth/realms/sgmw/protocol/openid-connect/userinfo", {
            headers: header
        })
    }

    //获取菱菱助手token
    LLZSGetToken(data): Observable<any> {
        return this.http.post(NXSZS_HTTP_URL + "/auth/realms/sgmw/protocol/openid-connect/token", this.dataForm.xxxFormData(data), {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            }
        })
    }

    //获取手机验证码
    LLZSGeTCode(phone, header): Observable<any> {
        return this.http.get(NXSZS_HTTP_URL + `/user/api/smsCode/${phone}`, {
            headers: header
        })
    }

    //菱菱助手手机登录
    LLZSLoginByPhone(data): Observable<any> {
        return this.http.post(NXSZS_HTTP_URL + "/auth/realms/sgmw/protocol/openid-connect/token", this.dataForm.xxxFormData(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        })
    }

    //获取菱菱助手用户信息
    LLZSGetUserInfo(params): Observable<any> {
        return this.http.get(NXSZS_HTTP_URL + `/user/api/userInfo/${params}`);
    }

    //登录菱菱助手
    InsertEsysUserLL(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/account/InsertEsysUserLL', data);
    }

    //获取用户积分和头衔列表
    GetMyInfo(): Observable<any> {
        return this.http.post(SERVER_API_URL + '/forum/Info/GetMyInfo', {});
    }

    //jPush-提交regisiter
    UpdateUserRegID(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/account/UpdateUserRegID', data);
    }

}
