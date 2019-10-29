import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {GlobalData} from "../../core/GlobleData";

declare let videojs: any;

@Component({
    selector: 'videojs',
    templateUrl: 'videojs.html'
})
export class VideojsComponent implements OnDestroy {
    @ViewChild('example_video') example_video: ElementRef;

    videoPoster: string;
    videoSrc: string;
    video;
    videoEle;

    constructor(private globleData: GlobalData) {
        const videoNum = this.globleData.videoNumber;
        this.videoEle = `video${videoNum}`;
        timer(100).subscribe(() => {
            this.video = videojs(this.videoEle, {
                muted: false,
                controls: true,
                autoplay: true
            }, (e) => {
                this.globleData.videoNumber++;
                console.log('videojs播放器初始化成功')
            })
        });
    }

    pageLeave() {
        if(this.video['player_']){
            this.video.pause();
        }
    }

    ngOnDestroy(): void {

    }

    destroy(){
        this.video.dispose();
    }

    get src() {
        return this.videoSrc;
    }

    @Input() set src(src) {
        if (this.video && src) {
            this.video.src({type: 'application/x-mpegURL', src: src});
            this.videoSrc = src;
        }
    }

    get poster() {
        return this.videoPoster;
    }

    @Input() set poster(poster) {
        this.videoPoster = poster;
    }

}
