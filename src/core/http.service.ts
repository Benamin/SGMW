import {Inject} from "@angular/core";import {HttpClient} from "@angular/common/http";import {Http} from "@angular/http";import {Observable} from "rxjs";import {of} from "rxjs/observable/of";@Inject({    providedIn: 'root'})export class HttpServiceService {    constructor(private angularHttp: HttpClient,                private nativeHttp: Http) {    }//     post(url: string, param?: any): Promise<any> {//         // 判断是原生环境还是浏览器环境//         if ((window as any).cordova) {//             return this.nativeHttp.post(url, param);//         }//         return this.angularHttp.post(url, param).toPromise();//     }////     postObservable(url: string, param?: any): Observable<any> {// // 判断是原生环境还是浏览器环境//         if ((window as any).cordova) {//             return this.nativeHttp.post(url, param).then(//                 respons => {//                     return of(respons);//                 }, error => {//                     return throwError(error);//                 }//             );//         }//         return this.angularHttp.post(url, param);//     }}