import {Component, NgZone, ViewChild} from '@angular/core';
import {Content, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {timer} from "rxjs/observable/timer";
import {HomeService} from "../home.service";
import {LearnService} from "../../learning/learn.service";
import {ShareWxComponent} from "../../../components/share-wx/share-wx";

import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";

@Component({
	selector: 'page-personal-center',
	templateUrl: 'personal-center.html',
})
export class PersonalCenterPage {
	@ViewChild(Content) content: Content;
	userDefaultImg = './assets/imgs/userDefault.jpg';
	page = {
		posterId: null,
		fixedShow: false,
		navliArr: [{
			lable: 'post',
			text: '发帖',
			listArr: [],
			TotalCount: 0

		}, {
			lable: 'reply',
			text: '回帖',
			listArr: [],
			TotalCount: 0
		}, {
			lable: 'comment',
			text: '评价',
			listArr: [],
			TotalCount: 0
		}],
		checkType: 'post',
		personalInfo: null,
		// commentLists: [1, 2, 3, 4, 5],
		PageIndex: 1,
		PageSize: 5,
		isLoad: false

	};

	constructor(public navCtrl: NavController, private homeSer: HomeService, private loadCtrl: LoadingController, public zone: NgZone, public navParams: NavParams, private modalCtrl: ModalController, private learSer: LearnService,) {

	}

	ionViewDidLoad() {
		this.page.posterId = this.navParams.get("Poster");
		console.log('posterId', this.page.posterId);
		this.GetPosterInformation();

		// this.getList();
		this.GetSearchNewRetFollower();
		this.scrollListener(); //调用监听方法
	}

	scrollListener() {
		const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		this.content.ionScroll.subscribe(($event: any) => {
			this.zone.run(() => {
				if ($event.scrollTop > 237 * (windowWidth / 375)) {
					if (!this.page.fixedShow) this.page.fixedShow = true;
					// console.log(8888, this.page.fixedShow )
				} else {
					if (this.page.fixedShow) this.page.fixedShow = false;
					// console.log(999, this.page.fixedShow )
				}
			});
		});
	}

	// 一级导航切换 （注：考试不会有）
	changeCheckType(checkType) {
		if (this.page.checkType === checkType) return;
		// this.page.commentLists = [];
		this.page.checkType = checkType;
		this.page.PageIndex = 1;
		this.page.isLoad = false;
		if (checkType === 'post') this.GetSearchNewRetFollower();
		if (checkType === 'reply') this.GetPostReply();
		if (checkType === 'comment') this.GetCourseReply();
	}

	doFollower(bool) {
		if (!this.page.posterId) return
		let loading = this.loadCtrl.create({
			content: ''
		});
		loading.present();
		const data = {
			userId: this.page.posterId,
			IsNoSet: bool ? 1 : 2 // 1设置 2取消设置
		};
		this.homeSer.setFollower(data).subscribe(
			(res) => {
				this.page.personalInfo.isNoFocus = !this.page.personalInfo.isNoFocus;
				loading.dismiss();
			}
		)
	}

	GetPosterInformation() {
		if (!this.page.posterId) return
		let loading = this.loadCtrl.create({
			content: ''
		});
		loading.present();
		const data = {
			poster: this.page.posterId
		};
		this.homeSer.GetPosterInformation(data).subscribe(
			(res) => {

				this.page.personalInfo = res.data;
				loading.dismiss();

			}
		)
	}

	GetSearchNewRetFollower(doLoadMore = null) {
		if (!this.page.posterId) return
		let loading = this.loadCtrl.create({
			content: ''
		});
		loading.present();
		const data = {
			Poster: this.page.posterId,
			PageIndex: this.page.PageIndex,
			PageSize: this.page.PageSize
		};
		this.homeSer.GetSearchNewRetFollower(data).subscribe(
			(res) => {
				if (res.data) {
					this.page.navliArr[0].TotalCount = res.data.Posts.TotalItems;
					if (doLoadMore) {
						this.page.navliArr[0].listArr = this.page.navliArr[0].listArr.concat(res.data.Posts.Items);
						doLoadMore.complete();
					} else {
						this.page.navliArr[0].listArr = res.data.Posts.Items;
					}

					console.log('人员发帖列表', this.page.navliArr[0].listArr)
					this.page.isLoad = true;
				}
				loading.dismiss();

			}
		)
	}

	GetPostReply(doLoadMore = null) {
		if (!this.page.posterId) return
		let loading = this.loadCtrl.create({
			content: ''
		});
		loading.present();
		const data = {
			userId: this.page.posterId,
			PageIndex: this.page.PageIndex,
			PageSize: this.page.PageSize
		};
		this.homeSer.GetPostReply(data).subscribe(
			(res) => {
				this.page.navliArr[1].TotalCount = res.data.Total;
				if (doLoadMore) {
					this.page.navliArr[1].listArr = this.page.navliArr[1].listArr.concat(res.data.response);
					doLoadMore.complete();
				} else {
					this.page.navliArr[1].listArr = res.data.response;
				}
				console.log('人员发帖列表', this.page.navliArr[1].listArr)
				this.page.isLoad = true;
				loading.dismiss();
			}
		)
	}

	GetCourseReply(doLoadMore = null) {
		if (!this.page.posterId) return
		let loading = this.loadCtrl.create({
			content: ''
		});
		loading.present();
		const data = {
			userId: this.page.posterId,
			PageIndex: this.page.PageIndex,
			PageSize: this.page.PageSize
		};
		this.homeSer.GetCourseReply(data).subscribe(
			(res) => {
				this.page.navliArr[2].TotalCount = res.data.Total;
				// this.page.navliArr[2].listArr = res.data;
				if (doLoadMore) {
					this.page.navliArr[2].listArr = this.page.navliArr[2].listArr.concat(res.data.response);
					doLoadMore.complete();
				} else {
					this.page.navliArr[2].listArr = res.data.response;
				}

				console.log('人员发帖列表', this.page.navliArr[2].listArr)
				this.page.isLoad = true;
				loading.dismiss();
			}
		)
	}

	//下拉刷新
	doRefresh(e) {
		this.page.PageIndex = 1;
		if (this.page.checkType === 'post') this.GetSearchNewRetFollower();
		if (this.page.checkType === 'reply') this.GetPostReply();
		if (this.page.checkType === 'comment') this.GetCourseReply();
		timer(1000).subscribe(() => {
			e.complete();
		});
	}

	// //加载更多
	doInfinite(e) {
		console.log('55555---doInfinite', this.page.navliArr[0].listArr.length, this.page.navliArr[0].TotalCount, this.page.navliArr[1].listArr.length, this.page.navliArr[1].TotalCount, this.page.navliArr[2].listArr.length, this.page.navliArr[2].TotalCount)

		if (this.page.navliArr[0].listArr.length == this.page.navliArr[0].TotalCount && this.page.checkType === 'post' && this.page.isLoad) {
			e.complete();
			return;
		}
		if (this.page.navliArr[1].listArr.length == this.page.navliArr[1].TotalCount && this.page.checkType === 'reply' && this.page.isLoad) {
			e.complete();
			return;
		}
		if (this.page.navliArr[2].listArr.length == this.page.navliArr[2].TotalCount && this.page.checkType === 'comment' && this.page.isLoad) {
			e.complete();
			return;
		}
		this.page.PageIndex++;
		if (this.page.checkType === 'post') this.GetSearchNewRetFollower(e);
		if (this.page.checkType === 'reply') this.GetPostReply(e);
		if (this.page.checkType === 'comment') this.GetCourseReply(e);
	}

	// 将对象数字转换为数组
	//range自定义的函数名称 （num：number）利用 ts 的特性 定义只接受number类型的值
	range(num: number) {
		var arr = [];
		for (var i = 1; i <= num; i++) {
			arr.push(i);
		}
		console.log(arr);
		return arr;
	}

	wxShare(item) {
		let modal = this.modalCtrl.create(ShareWxComponent, {data: item});
		modal.present();
	}

	//获取课程详情
	getCourseDetailById(pId) {
		let loading = this.loadCtrl.create({
			content: ''
		});
		loading.present();
		this.learSer.GetProductById(pId).subscribe(
			(res) => {
				if (res.data) {
					loading.dismiss();
					this.goCourse(res.data);
				}
			}
		);
	}

	goCourse(e) {
		if (e.TeachTypeName == "集中培训") {
			this.navCtrl.push(FocusCoursePage, {id: e.Id});
		} else if (e.TeachTypeName == "内训") {
			this.navCtrl.push(InnerCoursePage, {id: e.Id});
		} else {
			this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
		}
	}
}
