import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomeService} from "../../home/home.service";
import {CommonService} from "../../../core/common.service";
import {defaultImg} from "../../../app/app.constants";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

@Component({
    selector: 'page-theme-activity',
    templateUrl: 'theme-activity.html',
})
export class ThemeActivityPage {

    List;
    defaultImg = defaultImg;
    theme = <any>{};
    constructor(public navCtrl: NavController, public navParams: NavParams,
                public commonSer:CommonService,
                public homeSer: HomeService,public loadCtr:LoadingController) {
    }

    ionViewDidLoad() {
        this.homeSer.SelectThemeActivityInformation().subscribe(
            (res) => {
                this.theme = res.data;
            }
        );
        const Id = this.navParams.get('Id');
        const load = this.loadCtr.create();
        load.present();
        const data = {
            "csStatus": 2,  //课程状态 -1 未开始 0进行中 1已完成 2全部
            "id": Id,  //主题Id
            "Conditions": "All"    // 条件  NotAll 前四条 All全部
        }
        this.homeSer.AppSelectThemeActivity(data).subscribe(
            (res) => {
                load.dismissAll();
                if(res.code == 200){
                    this.List = res.data;
                }else{
                    this.commonSer.alertCenter(res.Message);
                }
            }
        )
    }

    //前往课程
    goCourse(e) {
        if (!e) {
            this.commonSer.toast('数据加载中,请稍后...');
            return
        }
        if (e.TeachTypeName == "集中培训") {
            this.navCtrl.push(FocusCoursePage, {id: e.Id});
        } else if (e.TeachTypeName == "内训") {
            this.navCtrl.push(InnerCoursePage, {id: e.Id});
        } else {
            this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
        }
    }

}
