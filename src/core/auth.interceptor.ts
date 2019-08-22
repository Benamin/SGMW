import {AlertController} from 'ionic-angular';import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';import {Injectable} from '@angular/core';import {Storage} from '@ionic/storage';import {Observable} from 'rxjs';import {_throw} from 'rxjs/observable/throw';import {catchError, mergeMap} from 'rxjs/operators';import {errorHandler} from "@angular/platform-browser/src/browser";import {CommonService} from "./common.service";@Injectable()export class InterceptorProvider implements HttpInterceptor {    constructor(private storage: Storage, private alertCtrl: AlertController,                private commonSer: CommonService) {    }    // Intercepts all HTTP requests!    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        let promise = this.storage.get('Authorization');        return Observable.fromPromise(promise)            .mergeMap(token => {                let clonedReq = this.addToken(request, token);                return next.handle(clonedReq).do(res => {                    if (res instanceof HttpResponse) {                        this.message(res);                    }                }, (error) => {                    let msg = error.message;                    let alert = this.alertCtrl.create({                        title: error.name,                        message: msg,                        buttons: ['OK']                    });                    alert.present();                    // Pass the error to the caller of the function                    return _throw(error);                }, () => {                })            });    }    // Adds the token to your headers if it exists    private addToken(request: HttpRequest<any>, Authorization: any) {        if (Authorization) {            let clone: HttpRequest<any>;            clone = request.clone({                setHeaders: {                    "Access-Control-Allow-Origin": "*",                    "Accept": `application/json`,                    'Content-Type': `application/json`,                    "Authorization": `${Authorization}`                }            });            return clone;        }        return request;    }    message(data) {        let code = data.body.code;        if (code == 200) {        } else {            this.commonSer.toast(data.body.message);        }    }}