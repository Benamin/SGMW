import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {Storage} from "@ionic/storage";

@Component({
    selector: 'app-today-remind',
    templateUrl: './today-remind.component.html'
})
export class TodayRemindComponent implements OnInit {
    @Input() data;
    @Output() Study = new EventEmitter();
    @Output() close = new EventEmitter();

    constructor(private storage: Storage,) {
    }

    imgSrc = 'assets/imgs/home/kctix_wx@2x.png';
    isNoRemind = false;
    StudyItems = []

    ngOnInit() {
        this.StudyItems = this.data.Items;
    }

    noRemind() {
        this.isNoRemind = !this.isNoRemind;
    }

    curriculumFn(data) {
        this.Study.emit(data.ClassID)
    }

    GotIt() {
        if (this.isNoRemind == true) {
            let date = new Date();
            let dateDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            this.storage.set('TodayRemind', dateDay);
        }
        this.close.emit();
    }
}
