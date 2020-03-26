import {Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the SecondFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'secondFormat',
})
export class SecondFormatPipe implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(value: number, ...args) {
        let minute = <any>Math.floor(value / 60);
        let second = <any>(value % 60);
        minute = minute > 9 ? minute : '0' + minute;
        second = second > 9 ? second : '0' + second;
        return minute + ':' + second;
    }
}
