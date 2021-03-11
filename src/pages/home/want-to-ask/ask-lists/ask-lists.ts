import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {HomeService} from "../../home.service";
import {WantToAskDetailPage} from "../ask-detail/ask-detail";
import {AddAskPage} from "../add-ask/add-ask";
// import {askSearchModalPage} from "../ask-search-modal/ask-search-modal";
import {Keyboard} from "@ionic-native/keyboard";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-ask-lists',
    templateUrl: 'ask-lists.html',
})
export class WantToAskListsPage {
    page =<any> {
		Title: '',
		PageIndex: 1, // 第一页 开始
		PageSize: 8, // 一页8条
		TotalCount: 0,
		searchLists: [],
		askLists: []
	};
		// private modalCtrl: ModalController,
    constructor(public navCtrl: NavController, private homeSer: HomeService,
                private loadCtrl: LoadingController, private keyboard: Keyboard) {

    }

    ionViewDidEnter() {
        this.getList();
    }

		showKey() { this.keyboard.show(); }

		//下拉刷新
		doRefresh(e) {
			this.page.PageIndex = 1;
			this.getList();
			timer(1000).subscribe(() => {
					e.complete();
			});
		}

		// //加载更多
		doInfinite(e) {
			if (this.page.askLists.length == this.page.TotalCount) {
					e.complete();
					return;
			}
		  this.page.PageIndex++;
			this.getList(e);
		}

		// showSearch() {
		// 	let modal = this.modalCtrl.create(askSearchModalPage, {roleList: []});
		// 	modal.onDidDismiss((data) => {
		// 	    if (data) {
		// 	//         this.homeSer.InitializeLevel({leveltype: data.value}).subscribe(
		// 	//             (resInit) => {
		// 	//                 if (resInit.code === 200) {

		// 	//                     this.navCtrl.push(AdvancedLevelPage, {
		// 	//                         leveltype: data,
		// 	//                         roleList: resRole.data
		// 	//                     });

		// 	//                 }
		// 	//             }
		// 	//         )
		// 				console.log('999--onDidDismiss', data)

		// 	    }
		// 	})
		// 	modal.present();
		// }

		//按键
		search(event) {
		    if (event && event.keyCode == 13) {
		        this.page.PageIndex = 1;
		        this.getList();
		        //搜索日志
		        if (this.page.Title) {
		            console.log(this.page.Title)
		        }
		    }
		}
		doSearch() {
		    console.log('当前搜索', this.page.Title);
		}

    getList(doLoadMore = null) {
			let loading = this.loadCtrl.create({
				content: ''
			});
			loading.present();
			const data = {
				PageIndex: this.page.PageIndex,
				PageSize: this.page.PageSize,
				IsNowMonth: true, // 是否只查当月的 pc为false
				IsNoDerive: 1, // 0, 1查询 2导出
				Title: this.page.Title, // 问题描述
				StartTime: null,
				EndTime: null
			};
			this.homeSer.GetQueryQuestionItems(data).subscribe((res) => {
				if (doLoadMore) {
					this.page.askLists = this.page.askLists.concat(res.data.QuestionItems);
					doLoadMore.complete();
				} else {
					this.page.askLists = res.data.QuestionItems;
				}
				this.page.TotalCount = res.data.TotalCount;
				this.page.isLoad = true;
                loading.dismiss();
                // console.log('GetJobLevelList', res);
            }
       )
    }

		changeSecNav(aIndex) {
			let loading = this.loadCtrl.create({
			    content: ''
			});
			loading.present();
			const data = {
			    QuestionId: this.page.askLists[aIndex].ID,
			    IsNoFocus: !this.page.askLists[aIndex].IsNoFocus
			};
			console.log(888)
			this.homeSer.AddOrCancelFocus(data).subscribe(
			    (res) => {
					this.page.askLists[aIndex].IsNoFocus = !this.page.askLists[aIndex].IsNoFocus;
                    this.page.askLists[aIndex].IsNoFocus ? this.page.askLists[aIndex].FocusNum++ : this.page.askLists[aIndex].FocusNum--;
			        loading.dismiss();
			    }
			)
		}

		goAskedDetail(item) {
			this.navCtrl.push(WantToAskDetailPage, {item: item});
		}

		goAddAskPage(item) {
			this.navCtrl.push(AddAskPage, {item: item});
		}

		// this.navCtrl.push(LookTestPage, {item: item});


}
