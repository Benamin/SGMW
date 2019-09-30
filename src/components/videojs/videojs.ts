import {Component, Input} from '@angular/core';
import {timer} from "rxjs/observable/timer";

declare let videojs: any;

@Component({
    selector: 'videojs',
    templateUrl: 'videojs.html'
})
export class VideojsComponent {

    videoPoster: string;
    videoSrc: string;
    videojs;

    constructor() {
        timer(100).subscribe(() => {
            console.log('初始化');
            this.videojs = videojs('example_video', {
                muted: false,
                controls: true,
                autoplay: true
            })
        });
    }

    get src() {
        return this.videoSrc;
    }

    @Input() set src(src) {
        console.log("src:" + src);
        if (this.videojs) {
            console.log(this.videojs);
            this.videojs.src({type: 'application/x-mpegURL', src: src});
        }
    }

    get poster() {
        return this.videoPoster;
    }

    @Input() set poster(poster) {
        console.log("poster:" + poster);
        this.videoPoster = poster;
    }

}
