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
				page: 1, 
				resourceLists: []
    };

    constructor(public navCtrl: NavController, private keyboard: Keyboard, private homeSer: HomeService,
                private loadCtrl: LoadingController, ) {

    }

    // ionViewDidEnter() {
    //   this.getList();
    // }
    ionViewDidLoad() {
			this.page.resourceLists = [
					{
						"id": 1,
						"status": 0, // 0 下载 1预览
						"suffix": 'Docx',
						"fileType": '话术资料',
						"title": '五菱学社最长最长最长最长最长的标题就是这题就是这题就是这',
						"avatar": '',
						"author": '秋国艳',
						"uploadTime": '2021年02月01日'
					},
					{
						id: 2,
						status: 0,
						suffix: 'PDF',
						fileType: '话术资料',
						title: '五菱第三课课程学习笔记',
						avatar: '',
						author: '秋国艳',
						uploadTime: '2021年02月01日'
					},
					{
						id: 3,
						status: 1,
						suffix: 'Xls',
						fileType: '其他资料',
						title: '五菱学社最长最长最长最长最长的标题就是这题就是这题就是这',
						avatar: '',
						author: '秋国艳',
						uploadTime: '2021年02月01日'
					},
					{
						id: 4,
						status: 0,
						suffix: 'PPT',
						fileType: '话术资料',
						title: '五菱第三课课程学习笔记',
						avatar: '',
						author: '秋国艳',
						uploadTime: '2021年02月01日'
					},
					{
						id: 5,
						status: 1,
						suffix: 'ZIP',
						fileType: '图像及视频资料',
						title: '五菱第三课课程学习笔记',
						avatar: '',
						author: '秋国艳',
						uploadTime: '2021年02月01日'
					},
				];
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
		
		setSuffixClass(suffix) {
			let suffixClass:Object = { 'no': 'true' }
			switch(suffix) {
				case 'Docx': 
					suffixClass = { 'docx-bg': 'true' }
					break
				case 'PDF':
					suffixClass = { 'pdf-bg': 'true' }
					break
				case 'Xls':
					suffixClass = { 'xls-bg': 'true' }
					break
				case 'PPT':
					suffixClass = { 'ppt-bg': 'true' }
					break
				case 'ZIP':
					suffixClass = { 'zip-bg': 'true' }
					break
			}
			return suffixClass
		}
		
		
		

    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
				loading.dismiss();
				console.log(this.homeSer);
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
