import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {HomeService} from "../../home.service";

@Component({
    selector: 'page-add-ask',
    templateUrl: 'add-ask.html',
})
export class AddAskPage {
    page = {

    };

    constructor(public navCtrl: NavController, private homeSer: HomeService,
                private loadCtrl: LoadingController, ) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ionViewDidLoad() {
        this.getList();
    }
		
		goNavBack() {
			console.log(888)
			this.navCtrl.pop();
		}
		submitAdd() {
			console.log('提交成功后返回')
			this.navCtrl.pop();
		}

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.dismiss();
        console.log('888', this.homeSer)
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
