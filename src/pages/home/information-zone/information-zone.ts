import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";

@Component({
    selector: 'page-information-zone',
    templateUrl: 'information-zone.html',
})
export class InformationZonePage {
		userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
        Title: '',
    };

    constructor(public navCtrl: NavController, private keyboard: Keyboard, private homeSer: HomeService,
                private loadCtrl: LoadingController, ) {

    }

    // ionViewDidEnter() {
    //   this.getList();
    // }
    ionViewDidLoad() {
        this.getList();
    }

    showKey() { this.keyboard.show(); }
    //按键
    search(event) {
        if (event && event.keyCode == 13) {
            this.page.page = 1;
            this.getList();
            //搜索日志
            if (this.page.Title) {
                console.log(this.page.Title)
                // this.logSer.keyWordLog(this.page.Title);
            }
        }
    }
    doSearch() {
        console.log('当前搜索', this.page.Title);
    }

    getList() {
        // let loading = this.loadCtrl.create({
        //     content: ''
        // });
        // loading.present();
        // const data = {
        //     Search: this.page.Search,
        //     Page: 1,
        //     PageSize: this.page.PageSize,
        //     Type: this.page.Type
        // };
        // this.homeSer.GetJobLevelList(data).subscribe(
        //     (res) => {
        //         // for (var i=0;i<res.data.Items.length; i++) {
        //         //     res.data.Items[i].OverPercentage = 34;
        //         // } // 测试数据
        //         this.page.PositionName = res.data.PositionName
        //         this.page.jobLevelList = (res.data.Items);
        //         this.page.TotalCount = res.data.TotalCount;
        //         this.page.isLoad = true;
        //         loading.dismiss();
        //         // console.log('GetJobLevelList', res);
        //     }
        // )
    }


}
