import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";


@Pipe({
    name: 'lineFeed',
})
export class LineFeedPipe implements PipeTransform {
    constructor(public sanitizer: DomSanitizer) {
    }

    /**
     * 内容换行
     */
    transform(value: string,) {
        let str;
        str = value ? value.replace(/\r?\n/g, "<br />") : "";
        str = this.sanitizer.bypassSecurityTrustHtml(str);
        return str;
    }
}
