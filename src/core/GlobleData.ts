import { Injectable } from '@angular/core';@Injectable()export class GlobalData {    private _videoStatus: number = 1; // 播放器状态    get videoStatus(): number {        return this._videoStatus;    }    set videoStatus(value: number) {        this._videoStatus = value;    }}