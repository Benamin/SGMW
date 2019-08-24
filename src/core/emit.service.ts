import {Injectable, EventEmitter, OnInit} from "@angular/core";
@Injectable()
export class EmitService implements OnInit {
    public eventEmit: any;

    //全局的监听事件
    constructor() {
        // 定义发射事件
        this.eventEmit = new EventEmitter();
    }

    ngOnInit() {

    }
}