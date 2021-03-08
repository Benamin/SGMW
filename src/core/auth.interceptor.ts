import {Injectable} from '@angular/core';import {AlertController, App, Events, MenuController, NavController} from 'ionic-angular';import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';import {Storage} from '@ionic/storage';import {Observable, TimeoutError} from 'rxjs';import {_throw} from 'rxjs/observable/throw';import {CommonService} from "./common.service";const APP_XHR_TIMEOUT = 40 * 1000;@Injectable()export class InterceptorProvider implements HttpInterceptor {    constructor(private storage: Storage, private alertCtrl: AlertController, private events: Events,                private menuCtrl: MenuController,                private commonSer: CommonService, private app: App) {    }    // Intercepts all HTTP requests!    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        let promise = this.storage.get('Authorization');        return Observable.fromPromise(promise)            .mergeMap(token => {                let clonedReq = this.addToken(request, token);                return next.handle(clonedReq).timeout(APP_XHR_TIMEOUT).do(res => {                    if (res instanceof HttpResponse) {                    }                }, (error) => {                    this.handleErrorResponse(error);                }, () => {                    this.handleRequestCompleted();                })            });    }    private performRequest(req: HttpRequest<any>): HttpRequest<any> {        let headers: HttpHeaders = req.headers;        headers = headers.set('MyCustomHeaderKey', `MyCustomHeaderValue`);        // headers = headers.set('MyCustomHeaderKey', `MyCustomHeaderValue`);        // return req.clone({ url: `${environment.backend.host}/${req.url}`, headers });        return req.clone({url: `/${req.url}`, headers});    }    // Adds the token to your headers if it exists    private addToken(request: HttpRequest<any>, Authorization: any) {        if (Authorization) {            let clone: HttpRequest<any>;            clone = request.clone({                setHeaders: {                    // "Accept": `application/json`,                    'Content-Type': `application/json`,                    "Authorization": `Bearer ${Authorization}`                }            });            return clone;        }        return request;    }    private handleErrorResponse(errorResponse): Observable<HttpEvent<any>> {        this.closePopup();        // console.log('error at interceptor', errorResponse);        if (errorResponse instanceof TimeoutError) {            this.commonSer.alert('网络请求超时,请稍后重试');            return        }        switch (errorResponse.status) {            case 401: // Unauthorized                this.commonSer.toast("登录已过期");                this.storage.clear();                this.events.publish('toLogin');                break;            case 500: // Service Unavailable                this.commonSer.alertCenter(`ErrorCode:  ${errorResponse.status},<br>                 ErrorURL:  ${errorResponse.url},<br>                ErrorMsg:  ${JSON.stringify(errorResponse.error)}，<br>                 `);                break;            case 404: // Service Unavailable                this.commonSer.alertCenter(`ErrorCode:  ${errorResponse.status},<br> ErrorMsg:  ${errorResponse.message}`);                break;            case 503: // Service Unavailable                this.commonSer.alertCenter(`ErrorCode:  ${errorResponse.status},<br> ErrorMsg:  ${errorResponse.message}`);                break;            default: // Other Error        }        return _throw(errorResponse);    }    private handleRequestCompleted(): void {        // console.log(`Request finished`);    }    //关闭loading之类的弹窗    closePopup() {        let loadHtml = <any>document.querySelector('ion-loading');        if (loadHtml) {            loadHtml.style.display = "none";        }    }}