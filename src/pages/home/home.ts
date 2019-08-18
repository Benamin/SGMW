import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomeService} from "./home.service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild('angular') angular: ElementRef;
    @ViewChild('imgWidth') imgWidth: ElementRef;

    type = 'teacher';
    personrType = 0;

    constructor(public navCtrl: NavController, public homeSer: HomeService) {


    }

    ionViewDidLoad() {
        this.getBanner();
    }

    selectType(type) {
        this.type = type;
    }

    selectPerson(index) {
        this.personrType = index;
        const width = this.imgWidth.nativeElement.offsetWidth / 5;
        this.angular.nativeElement.style.left = index * width + width / 2 - 10 + 'px';
    }

    getBanner() {
        this.homeSer.getBannerList().subscribe(
            (res) => {
            }
        )
    }


}
