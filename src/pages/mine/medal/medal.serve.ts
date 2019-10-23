import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SERVER_API_URL} from "../../../app/app.constants";
import {HTTP} from "@ionic-native/http";

@Injectable()
export class MineService {
    constructor(private http: HttpClient, private nativeHttp: HTTP) {
    }

    // 获取勋章列表
    GetUserbadgeSearch(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/search',data)
    }
    // 设置勋章
    SetUserbadgeAssign(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/assign',data)
    }

    // 显示勋章
    showSserbadge(badgeId){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/show?badgeId='+badgeId,{badgeId})
    }
    // 不显示勋章
    hideSserbadge(badgeId){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/hide?badgeId='+badgeId,{badgeId})
    }
    
}