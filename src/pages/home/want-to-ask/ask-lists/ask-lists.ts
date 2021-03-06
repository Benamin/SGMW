import {Component} from '@angular/core';
import {LoadingController, NavController, ModalController} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {WantToAskDetailPage} from "../ask-detail/ask-detail";
import {AddAskPage} from "../add-ask/add-ask";
import {askSearchModalPage} from "../ask-search-modal/ask-search-modal";

@Component({
    selector: 'page-ask-lists',
    templateUrl: 'ask-lists.html',
})
export class WantToAskListsPage {
    page = {
			searchKeyWord: '',
			PageIndex: 1, // 第一页 开始
			PageSize: 8, // 一页8条
			TotalCount: 0,
			searchLists: [],
			askLists: [
				// { title: '五菱征途个课程播放出现闪退，应该要怎么处理么？五菱征途个课程播放出现闪退，应该要怎么处理么，应该要怎么处理么？', 
				// 	askedNum: 88,
				// 	isAsked: false
				// },
				// { title: '五菱征途个课程播放出现闪退，应该要怎么处理么？五菱征途个课程播放出现闪退，应该要怎么处理么，应该要怎么处理么？',
				// 	askedNum: 88,
				// 	isAsked: true
				// }
			]
    };

    constructor(public navCtrl: NavController, private homeSer: HomeService,
                private loadCtrl: LoadingController, private modalCtrl: ModalController) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ionViewDidLoad() {
        this.getList();
    }
		
		showSearch() {
			let modal = this.modalCtrl.create(askSearchModalPage, {roleList: []});
			modal.onDidDismiss((data) => {
			    if (data) {
			//         this.homeSer.InitializeLevel({leveltype: data.value}).subscribe(
			//             (resInit) => {
			//                 if (resInit.code === 200) {
			
			//                     this.navCtrl.push(AdvancedLevelPage, {
			//                         leveltype: data,
			//                         roleList: resRole.data
			//                     });
			
			//                 }
			//             }
			//         )
						console.log('999--onDidDismiss', data)
			
			    }
			})
			modal.present();
		}

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.dismiss();
        console.log('888', this.homeSer)
        loading.present();
        const data = {
            PageIndex: this.page.PageIndex,
            PageSize: this.page.PageSize,
						IsNowMonth: true, // 是否只查当月的 pc为false
						IsNoDerive: 0, // 0, 1查询 2导出
						QuestionDesc: this.page.searchKeyWord, // 问题描述
        };
        this.homeSer.GetQueryQuestionItems(data).subscribe(
            (res) => {
							console.log('GetQueryQuestionItems', res)
                // for (var i=0;i<res.data.Items.length; i++) {
                //     res.data.Items[i].OverPercentage = 34;
                // } // 测试数据
                // this.page.PositionName = res.data.PositionName
                // this.page.jobLevelList = (res.data.Items);
								this.page.askLists = res.data.QuestionItems;
                this.page.TotalCount = res.data.TotalCount;
                // this.page.isLoad = true;
                loading.dismiss();
                // console.log('GetJobLevelList', res);
            }
        )
    }
		
		changeSecNav(aIndex) {
			this.page.askLists[aIndex].isAsked = true;
			this.page.askLists[aIndex].askedNum++;
		}
		 
		goAskedDetail(item) {
			this.navCtrl.push(WantToAskDetailPage, {item: item});
		}
		
		goAddAskPage(item) {
			this.navCtrl.push(AddAskPage, {item: item});
		}
		
		// this.navCtrl.push(LookTestPage, {item: item});


}
