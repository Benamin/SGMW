import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';


@Component({
    selector: 'check-code',
    templateUrl: 'check-code.html'
})
export class CheckCodeComponent {
    @ViewChild('canvas') canvas: ElementRef;
    @Output() done = new EventEmitter();
    text: string;

    constructor() {
        this.text = 'Hello World';
    }

    //生成随机数
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    //生成随机颜色RGB分量
    randomColor(min, max) {
        const _r = this.randomNum(min, max);
        const _g = this.randomNum(min, max);
        const _b = this.randomNum(min, max);
        return "rgb(" + _r + "," + _g + "," + _b + ")";
    }

    drawPic() {
        //获取到元素canvas
        let $canvas = this.canvas.nativeElement;
        let _str = "0123456789";//设置随机数库
        let _picTxt = "";//随机数
        let _num = 4;//4个随机数字
        let _width = $canvas.width;
        let _height = $canvas.height;
        console.log(_width, _height);
        let ctx = $canvas.getContext("2d");//获取 context 对象
        ctx.textBaseline = "bottom";//文字上下对齐方式--底部对齐
        ctx.fillStyle = this.randomColor(180, 240);//填充画布颜色
        ctx.fillRect(0, 0, _width, _height);//填充矩形--画画
        for (let i = 0; i < _num; i++) {
            let x = (_width - 10) / _num * i + 10;
            let y = this.randomNum(_height / 2, _height);
            console.log("x,y", x, y);
            let deg = this.randomNum(-45, 45);
            let txt = _str[this.randomNum(0, _str.length)];
            _picTxt += txt;//获取一个随机数
            ctx.fillStyle = this.randomColor(10, 100);//填充随机颜色
            ctx.font = this.randomNum(16, 40) + "px SimHei";//设置随机数大小，字体为SimHei
            ctx.translate(x, y);//将当前xy坐标作为原始坐标
            ctx.rotate(deg * Math.PI / 180);//旋转随机角度
            ctx.fillText(txt, 0, 0);//绘制填色的文本
            ctx.rotate(-deg * Math.PI / 180);
            ctx.translate(-x, -y);
        }
        for (let i = 0; i < _num; i++) {
            //定义笔触颜色
            ctx.strokeStyle = this.randomColor(90, 180);
            ctx.beginPath();
            //随机划线--4条路径
            ctx.moveTo(this.randomNum(0, _width), this.randomNum(0, _height));
            ctx.lineTo(this.randomNum(0, _width), this.randomNum(0, _height));
            ctx.stroke();
        }
        for (let i = 0; i < _num * 10; i++) {
            ctx.fillStyle = this.randomColor(0, 255);
            ctx.beginPath();
            //随机画原，填充颜色
            ctx.arc(this.randomNum(0, _width), this.randomNum(0, _height), 1, 0, 2 * Math.PI);
            ctx.fill();
        }
        this.done.emit(_picTxt);
        return _picTxt;//返回随机数字符串
    }
}
