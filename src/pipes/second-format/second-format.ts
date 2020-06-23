import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'secondFormat',
})
export class SecondFormatPipe implements PipeTransform {
    /**
     * 将秒转化为mm:ss 如78->01:18
     */
    transform(value: number, ...args) {
        let minute = <any>Math.floor(value / 60);
        let second = <any>(value % 60);
        minute = minute > 9 ? minute : '0' + minute;
        second = second > 9 ? second : '0' + second;
        return minute + ':' + second;
    }
}
