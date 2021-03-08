import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {FileService} from "../../../core/file.service";
import {timer} from "rxjs/observable/timer";

@Component({
    selector: 'page-information-zone',
    templateUrl: 'information-zone.html',
})
export class InformationZonePage {
		userDefaultImg = './assets/imgs/userDefault.jpg';
    page = {
        Title: '',
				page: 1, 
				PageSize: 5,
				TotalCount: 0,
				isLoad: false,
				resourceLists: []
    };

    constructor(public navCtrl: NavController, private keyboard: Keyboard, private homeSer: HomeService,private loadCtrl: LoadingController, private fileSer: FileService,) {

    }

    // ionViewDidEnter() {
    //   this.getList();
    // }
    ionViewDidLoad() {
			this.page.resourceLists = [];
        this.getList();
    }

    showKey() { this.keyboard.show(); }
    //按键
    search(event) {
        if (event && event.keyCode == 13) {
          this.doSearch();
        }
    }
    doSearch() {
			this.page.page = 1;
			this.getList();
        // console.log('当前搜索', this.page.Title);
    }
		
		setSuffixClass(fileName) {
			let suffix = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();; // 后缀名
			// let suffixArr = ['Docx', 'PDF', 'Xls', 'PPT', 'ZIP']
			let suffixClass:Object = { 'no': 'true' }
			let suffixText = '';
				// Word文档的扩展名有两个,分别是:doc和docx
			if (suffix === 'doc' || suffix === 'doc') {
				suffixClass = { 'docx-bg': 'true' };
				suffixText = 'Docx';
			} else if (suffix === 'pdf') { // pdf
				suffixClass = { 'pdf-bg': 'true' };
				suffixText = 'PDF';
			} else if (suffix === 'xlsx' || suffix === 'xls' || suffix === 'csv') { // excel有很多版本的文件格式，另存为那里可以看到如图各类格式: xlsx/xls/csv
				suffixClass = { 'xls-bg': 'true' };
				suffixText = 'Xls';
			} else if (suffix === 'pptx') { // pptx
				suffixClass = { 'ppt-bg': 'true' };
				suffixText = 'PPT';
			} else if (suffix === 'zip') { // pptx
				suffixClass = { 'zip-bg': 'true' };
				suffixText = 'ZIP';
			}
			let suffixObj = {
				suffixClass: suffixClass,
				suffixText: suffixText
			} 
			return suffixObj
		}
		
    getList() {
        let loading = this.loadCtrl.create({
            content: ''
        });
        loading.present();
				// loading.dismiss();
				console.log(this.homeSer);
        const data = {
            DisplayName: this.page.Title,
            Page: 1,
            PageSize: this.page.PageSize
        };
        this.homeSer.GetQueryMaterialFile(data).subscribe(
            (res) => {
							this.page.resourceLists = this.DataAssign(res.data);
							console.log('9999999', this.page.resourceLists);
							this.page.isLoad = true;
							loading.dismiss();
            }
        )
    }
		
		DataAssign(Data) {
			let Lists = Data.MaterialFileItems
			// 处理返回的 数据
			for (var i=0; i<Lists.length; i++) {
				Lists[i].suffixObj = this.setSuffixClass(Lists[i].Name);
			}
			this.page.TotalCount = Data.TotalCount;
			return Lists;
		}
		
		//下拉刷新
		doRefresh(e) {
		    this.page.page = 1;
		    this.getList();
		    timer(1000).subscribe(() => {
		        e.complete();
		    });
		}
		
		//加载更多
		doInfinite(e) {
		    if (this.page.resourceLists.length == this.page.TotalCount) {
		        e.complete();
		        return;
		    }
		    this.page.page++;
				const paramsObj = {
				    DisplayName: this.page.Title,
				    Page: this.page.page,
				    PageSize: this.page.PageSize
				};
		    this.homeSer.GetQueryMaterialFile(paramsObj).subscribe(
		        (res) => {
		            this.page.resourceLists = this.page.resourceLists.concat(this.DataAssign(res.data));
		            e.complete();
		        }
		    )
		}

		//下载文件
    downLoad(fileUrl, fileName, e) {
        e.stopPropagation();
        this.fileSer.downloadFile(fileUrl, fileName);
    }


}
