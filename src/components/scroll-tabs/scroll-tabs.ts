import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../../pages/home/home.service";


@Component({
    selector: 'scroll-tabs',
    templateUrl: 'scroll-tabs.html'
})
export class ScrollTabsComponent implements OnChanges {
    @ViewChild('tips') tips: ElementRef;
    @ViewChild('tabSpan') tabSpan: ElementRef;
    @ViewChild('tabsChildren') tabsChildren: ElementRef;
    @Input() tabsList;
    @Input() isShow;
    @Output() done = new EventEmitter();

    select = {
        index:0,
        item:null
    }
    itemWidth;
    spanWidth;

    threeType = {
        list: [],
        type: null,
    };

    constructor(private homeSer:HomeService) {
        timer(1000).subscribe((res) => {
            const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
            // this.itemWidth = htmlFontSize.split("px")[0] * 8;
            this.itemWidth = document.documentElement.clientWidth;
            this.spanWidth = document.documentElement.clientWidth / 8;   //文字宽度
        })
    }

    ngOnChanges(change: SimpleChanges) {
        if (change['inputValue'] && change['inputValue'].currentValue.length > 0) {
            console.dir(change['inputValue'].currentValue);
        }
    }

    changeParent(item, index) {
        this.select.index = index;
        this.select.item = item;
        // this.tips.nativeElement.style.width = this.tabSpan.nativeElement.offsetWidth + 'px';
        // 自身div的一半 - 滑块的一半
        // this.tips.nativeElement.style.left = this.itemWidth * (index) + (this.itemWidth - this.spanWidth) / 2 + 'px';
        // console.log(this.tips.nativeElement.style.left);
        this.getTabs(item);
    }

    //获取三级菜单
    getTabs(e) {
        if (this.isShow && this.threeType.type == e.type) {
            this.isShow = false;
            return;
        }
        this.threeType.type = e.type;
        this.homeSer.GetDictionaryByPCode(e.type).subscribe(
            (res) => {
                this.threeType.list = res.data;
                this.isShow = true;
            }
        )
    }

    //选择单个三级分类
    setSubjectID(e){
        this.isShow = false;
        this.done.emit(e)
    }

    //选择全部
    setAll(){
        this.isShow = false;
        this.done.emit(this.select.item);
    }
}
