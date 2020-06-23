import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'stringSlice',
})
export class StringSlicePipe implements PipeTransform {

    /**
     *根据长度截取字符串 如果大于{len} 则截取前{index}
     * @param value 字符串
     * @param len
     * @param index
     */

    transform(value: string, len: number, index: number) {
        let str = "";
        if (value && value.length > 0) {
            str = value.length > len ? value.slice(0, index) + "..." : value;
        }
        return str;
    }
}
