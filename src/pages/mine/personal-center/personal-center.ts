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
			fixedShow: false,
			navliArr: [{
			    lable: 'post',
			    text: '发帖'
			}, {
			    lable: 'reply',
			    text: '回帖'
			}, {
			    lable: 'comment',
			    text: '评价'
			}],
			checkType: 'post',
			getParams: null,
			commentLists: [1, 2, 3, 4, 5]
    };

    constructor(public navCtrl: NavController, private mineSer: MineService, private loadCtrl: LoadingController,public zone: NgZone) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ionViewDidLoad() {
			this.page.getParams = {
			    Page: 1,
			    PageSize: 10,
			    TotalCount: null,
			    isLoad: false
			};
			
			this.getList();
			this.scrollListener(); //调用监听方法
    }
		scrollListener() {
			const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		  this.content.ionScroll.subscribe(($event: any) => {
		    this.zone.run(()=>{
		      if($event.scrollTop > 237 * (windowWidth/375)) {
		        if (!this.page.fixedShow) this.page.fixedShow = true;
						// console.log(8888, this.page.fixedShow )
		      }else {
		        if (this.page.fixedShow) this.page.fixedShow = false;
						// console.log(999, this.page.fixedShow )
		      }
		    });
		  });
		}

		// 一级导航切换 （注：考试不会有）
		changeCheckType(checkType) {
			if (this.page.checkType === checkType) return;
			this.page.commentLists = [];
			this.page.checkType = checkType;
			// if (checkType === 'recommend') this.page.Type = 1;
			// if (checkType === 'all') this.page.Type = 2;
			// if (checkType === 'mine') this.page.Type = 3;
			this.page.getParams.Page = 1;
			this.page.getParams.PageIndex = 1;
			this.getList();
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
