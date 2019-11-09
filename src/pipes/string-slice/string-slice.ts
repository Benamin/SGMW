import {Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the StringSlicePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'stringSlice',
})
export class StringSlicePipe implements PipeTransform {
    transform(value: string, len: number,index:number) {
        let str;
        str = value.length > len ? value.slice(0, index) + "..." : value;
        return str;
    }
}
