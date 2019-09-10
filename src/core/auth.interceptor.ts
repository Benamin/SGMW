import {AlertController, App, Events} from 'ionic-angular';import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';import {Injectable} from '@angular/core';import {Storage} from '@ionic/storage';import {Observable} from 'rxjs';import {_throw} from 'rxjs/observable/throw';import {catchError, mergeMap} from 'rxjs/operators';import {errorHandler} from "@angular/platform-browser/src/browser";import {CommonService} from "./common.service";import {LoginPage} from "../pages/login/login";@Injectable()export class InterceptorProvider implements HttpInterceptor {    constructor(private storage: Storage, private alertCtrl: AlertController, private events: Events,                private commonSer: CommonService, private app: App) {    }    // Intercepts all HTTP requests!    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        let promise = this.storage.get('Authorization');        return Observable.fromPromise(promise)            .mergeMap(token => {                let clonedReq = this.addToken(request, token);                return next.handle(clonedReq).do(res => {                    if (res instanceof HttpResponse) {                        this.message(res);                    }                }, (error) => {                    let msg = error.message;                    console.log(error);                    let alert = this.alertCtrl.create({                        title: '网络加载失败',                        message: '刷新页面再试一次吧',                        buttons: ['确定']                    });                    alert.present();                    // Pass the error to the caller of the function                    return _throw(error);                }, () => {                })            });    }    // Adds the token to your headers if it exists    private addToken(request: HttpRequest<any>, Authorization: any) {        if (Authorization) {            let clone: HttpRequest<any>;            clone = request.clone({                setHeaders: {                    // "Accept": `application/json`,                    'Content-Type': `application/json`,                    "Authorization": `${Authorization}`                }            });            return clone;        }        return request;    }    message(data) {        if (data.body && data.body.code) {            let code = data.body.code;            switch (code) {                case 500:                    this.commonSer.toast(data.body.message);                    break                case 401:                    this.storage.clear();                    this.commonSer.toast(data.body.message);                    this.events.publish('toLogin');                    break            }        }    }}