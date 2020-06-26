import {Component, EventEmitter, Output} from '@angular/core';

export const MonthOfZH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

/**
 * 每日一学
 */
@Component({
    selector: 'dayily-school',
    templateUrl: 'dayily-school.html'
})


export class DayilySchoolComponent {
    @Output() daySchool = new EventEmitter();

    obj = {
        year: 2019,
        month: '',
        day:<any> ''
    }

    constructor() {
        this.obj.year = new Date().getFullYear();
        this.obj.month = MonthOfZH[new Date().getMonth()];
        const day = new Date().getDate();
        this.obj.day = day > 10 ? day : `0${day}`;
    }

    goToDetail(){
        this.daySchool.emit();
    }

}
