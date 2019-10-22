import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../../app/app.constants";
import {HTTP} from "@ionic-native/http";
import {DataFormatService} from "../../../core/dataFormat.service";

@Injectable()
export class MineService {
    constructor(private http: HttpClient, private nativeHttp: HTTP, private dataForm: DataFormatService) {
    }

    // 获取勋章列表
    GetUserbadgeSearch(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/search',data)
    }
    // 设置勋章
    SetUserbadgeAssign(data){
        return this.http.post(SERVER_API_URL + '/forum/userbadge/assign',data)
    }
    
}