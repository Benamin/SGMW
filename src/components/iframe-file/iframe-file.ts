import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'iframe-file',
    templateUrl: 'iframe-file.html'
})
export class IframeFileComponent {
    @Output() closeMask = new EventEmitter();
    @ViewChild('iframeMask') iframeMask: ElementRef;

    iframeObj;
    iframeUrl;
    show = true;

    constructor(private sanitizer: DomSanitizer) {
        console.log(document.body.clientWidth)
        setTimeout(() => {
            this.iframeMask.nativeElement.style.width = document.body.clientWidth + "px";
            this.iframeMask.nativeElement.style.height = document.body.clientHeight + "px";
        }, 500);
    }

    get iframe() {
        return this.iframeObj;
    }

    @Input() set iframe(iframeObj) {
        console.log(iframeObj);
        if (iframeObj) {
            this.show = true;
            this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(iframeObj.fileUrl);
            this.iframeObj = iframeObj;
        }
    }

    //关闭
    close() {
        this.closeMask.emit();
        this.iframeUrl = null;
        this.show = false;
    }
}
