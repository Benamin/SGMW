import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'img-preview',
    templateUrl: 'img-preview.html'
})
export class ImgPreviewComponent {
    @Output() close = new EventEmitter();
    preImgSrc;

    constructor() {

    }

    get src() {
        return this.preImgSrc;
    }

    @Input() set src(preImgSrc) {
        console.log(preImgSrc);
        this.preImgSrc = preImgSrc;
    }

    closePreview() {
        this.close.emit();
    }

}
