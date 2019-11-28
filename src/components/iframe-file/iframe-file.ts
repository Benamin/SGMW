import {Component, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'iframe-file',
    templateUrl: 'iframe-file.html'
})
export class IframeFileComponent {

    iframeObj;

    constructor(private sanitizer: DomSanitizer) {
        console.log('Hello IframeComponent Component');
    }

    get iframe() {
        return this.iframeObj;
    }

    @Input() set iframe(iframeObj) {
        if (iframeObj) {
            iframeObj.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(iframeObj.fileUrl);
            this.iframeObj = iframeObj;
        }
    }

}
