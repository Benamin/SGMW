import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LoadingController, NavController, Slides} from 'ionic-angular';
import {Storage} from "@ionic/storage";

@Component({
    selector: 'app-today-remind-mission',
    templateUrl: './today-remind-mission.component.html'
})
export class TodayRemindMissionComponent implements OnInit {
    @Input() data;
    @Output() Study = new EventEmitter();
    @Output() close = new EventEmitter();

    constructor(private storage: Storage,) {
    }

    imgSrc = 'assets/imgs/home/kctix_wx@2x.png';
    isNoRemindMission = false;
    StudyItems = []

    ngOnInit() {
        this.StudyItems = this.data.Items;
    }

    noRemind() {
        this.isNoRemindMission = !this.isNoRemindMission;
    }

    curriculumFn(data) {
        this.Study.emit(data.ClassID)
    }

    GotIt() {
        if (this.isNoRemindMission == true) {
            let date = new Date();
            let dateDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            this.storage.set('TodayRemindMission', dateDay);
        }
        this.close.emit();
    }
}
