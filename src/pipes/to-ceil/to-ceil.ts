import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toCeil',
})
export class ToCeilPipe implements PipeTransform {
  /**
   * 向上取整
   */
  transform(value: any, ...args) {
    return Math.ceil(Number(value));
  }
}
