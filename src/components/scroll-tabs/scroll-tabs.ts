import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";


@Component({
    selector: 'scroll-tabs',
    templateUrl: 'scroll-tabs.html'
})
export class ScrollTabsComponent implements OnChanges {
    @ViewChild('tips') tips: ElementRef;
    @ViewChild('tabSpan') tabSpan: ElementRef;
    @Input() tabsList;
    @Output() done = new EventEmitter();

    selectIndex = 1;
    itemWidth;
    spanWidth;

    constructor() {
        timer(5000).subscribe((res) => {
            const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
            this.itemWidth = htmlFontSize.split("px")[0] * 8;
            this.spanWidth = this.tabSpan.nativeElement.offsetWidth;   //文字宽度
            this.changeParent(this.tabsList[0], 0);
            console.log(this.tabsList);
        })
    }

    ngOnChanges(change: SimpleChanges) {
        if (change['inputValue'] && change['inputValue'].currentValue.length > 0) {
            console.dir(change['inputValue'].currentValue);
        }
    }

    changeParent(item, index) {
        this.selectIndex = index;
        this.tips.nativeElement.style.width = this.tabSpan.nativeElement.offsetWidth + 'px';
        // 自身div的一半 - 滑块的一半
        this.tips.nativeElement.style.left = this.itemWidth * (index) + (this.itemWidth - this.spanWidth) / 2 + 'px';
        this.done.emit(item);
    }

}
