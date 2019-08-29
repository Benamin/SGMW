import {Injectable} from '@angular/core';import {BehaviorSubject, Subscription} from 'rxjs';@Injectable()export class AppService {    private mineSource:BehaviorSubject<any> = new BehaviorSubject({});    public mineInfo = this.mineSource.asObservable();    private fileSource:BehaviorSubject<any> = new BehaviorSubject(null);    public fileInfo = this.fileSource.asObservable();    //个人信息    public setMine(value: any){        this.mineSource.next(value);    }    //文件信息    public setFile(value: any){        this.fileSource.next(value);    }}