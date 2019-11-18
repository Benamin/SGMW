import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {HomeService} from "../../pages/home/home.service";


@Component({
    selector: 'search-sidebar',
    templateUrl: 'search-sidebar.html'
})
export class SearchSidebarComponent {

    filterObj = {
        ApplicantSTime: null,
        ApplicantETime: null,
        AreaCode: "",
        ProvinceCode: "",
        CityCode: "",
        Address: "",
        TeacherName: "",
    };

    allList = [];
    areaList = [];  //区域
    provinceList = [];  //省
    cityList = [];  //市

    constructor(public viewCtrl: ViewController,
                public params: NavParams,
                public homeSer: HomeService,) {
        this.allList = this.params.get('allList');
        this.filterObj = this.params.get('filterObj');
        this.areaList = this.allList.filter(e => e.TypeLevel == 1);
        this.provinceList = this.allList.filter(e => e.TypeLevel == 2 &&
            (this.filterObj.AreaCode ? e.AreaCode == this.filterObj.AreaCode : true));
        this.cityList = this.allList.filter(e => e.TypeLevel == 3 &&
            (this.filterObj.AreaCode ? e.AreaCode == this.filterObj.AreaCode : true) &&
            (this.filterObj.ProvinceCode ? e.ProvinceCode == this.filterObj.ProvinceCode : true));
    }

    //过滤省
    filterProvice(area) {
        this.filterObj.AreaCode = area.AreaCode;
        this.filterObj.ProvinceCode = "";
        this.filterObj.CityCode = "";
        this.provinceList = this.allList.filter(e => e.TypeLevel == 2 && e.AreaCode == area.AreaCode);
        this.cityList = this.allList.filter(e => e.TypeLevel == 3 && e.AreaCode == area.AreaCode);
    }

    //过滤市
    filterCity(provice) {
        this.filterObj.ProvinceCode = provice.ProvinceCode;
        this.filterObj.CityCode = "";
        this.cityList = this.allList.filter(e => e.TypeLevel == 3 && e.ProvinceCode == provice.ProvinceCode);
    }

    //选择城市
    selectCity(city) {
        this.filterObj.CityCode = city.CityCode;
    }

    //重置
    reset() {
        this.filterObj = {
            ApplicantSTime: null,
            ApplicantETime: null,
            AreaCode: "",
            ProvinceCode: "",
            CityCode: "",
            Address: "",
            TeacherName: "",
        };
        this.areaList = this.allList.filter(e => e.TypeLevel == 1);
        this.provinceList = this.allList.filter(e => e.TypeLevel == 2);
        this.cityList = this.allList.filter(e => e.TypeLevel == 3);
    }

    //确认
    confirm() {
        this.viewCtrl.dismiss(this.filterObj);
    }

}
