import { Injectable } from '@angular/core';@Injectable()export class GlobalData {    private _videoNum: number = 1; // 播放器状态    get videoNum(): number {        return this._videoNum;    }    set videoNum(value: number) {        this._videoNum = value;    }}