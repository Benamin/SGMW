import {Component, ViewChild, NgZone} from '@angular/core';
import {LoadingController, NavController, Content} from 'ionic-angular';
import {MineService} from "../mine.service";

@Component({
    selector: 'page-personal-center',
    templateUrl: 'personal-center.html',
})
export class PersonalCenterPage {
		@ViewChild(Content) content: Content;
		userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
			fixedShow: false
    };

    constructor(public navCtrl: NavController, private mineSer: MineService, private loadCtrl: LoadingController,public zone: NgZone) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ionViewDidLoad() {
        this.getList();
				this.scrollListener(); //调用监听方法
    }
		scrollListener() {
		  this.content.ionScroll.subscribe(($event: any) => {
		    this.zone.run(()=>{
		      if($event.scrollTop > 300) {
		        this.page.fixedShow = true;
						console.log(8888, this.page.fixedShow )
		      }else {
		        this.page.fixedShow = false;
		      }
		    });
		  });
		}


    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.dismiss();
        console.log('888', this.mineSer)
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
