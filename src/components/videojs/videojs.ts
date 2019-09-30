import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";

declare let videojs: any;

@Component({
    selector: 'videojs',
    templateUrl: 'videojs.html'
})
export class VideojsComponent {
    @ViewChild('example_video') example_video:ElementRef;

    videoPoster: string;
    videoSrc: string = "http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8";
    video;

    constructor() {
        timer(100).subscribe(() => {
            console.log(this.example_video.nativeElement);
            this.video = videojs("example_video", {
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
        if (this.video) {
            console.log(this.video);
            this.video.src({type: 'application/x-mpegURL', src: src});
            this.poster = src;
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
