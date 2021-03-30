import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {PhotoLibrary} from "@ionic-native/photo-library";
import {CommonService} from "../../../../core/common.service";
// import {askSearchModalPage} from "../ask-search-modal/ask-search-modal";

declare let Swiper: any;

@Component({
    selector: 'page-ask-detail',
    templateUrl: 'ask-detail.html',
})
export class WantToAskDetailPage implements OnInit {
    @ViewChild('panel') panel: ElementRef;

	userDefaultImg = './assets/imgs/userDefault.jpg'
    preImgSrc = "";
    page = {
			askItem: null
    };
    // private modalCtrl: ModalController,
    constructor(public navCtrl: NavController,
                private photoLibrary: PhotoLibrary,
                public navParams:NavParams,
                public commonSer: CommonService) {

    }

    // ionViewDidEnter() {
    //     this.getList();
    // }
    ngOnInit() {}

    ionViewDidLoad() {
			this.page.askItem = this.navParams.get("item")
			console.log('666--item', this.navParams.get("item"))

    }

    //office、pdf、图片、视频
    // openFile(file) {
    //     this.preImgSrc = file;
    // }

    swiper: any;
    vm: any = {
        canEdit: false,
        selectedIndex: 0,
        images: [],
        selectedCount: 0
    };

    isShow = false;

    showImgSrc: any;
    showImg = false;
    CloseImgTime = new Date().getTime(); // 关闭 图片时间
    openImg(index, imgIndex) {
        let imgs = []
        index === 0 ? this.vm.images = this.page.askItem.ImageList : this.vm.images = this.page.askItem.QuestionReplyItems.ImgAddress;
        imgs = this.vm.images[imgIndex];
        if (this.showImg || new Date().getTime() - this.CloseImgTime < 200) {
            return
        }
        this.swiper = null;
        this.vm.selectedIndex = imgIndex;
        this.showImgSrc = imgs;
        setTimeout(() => {
            this.initImg();
        }, 40);
        this.isenlarge = false;
        this.showImg = true;
    }

    isenlarge = false;
    photoLibraryDown() {
        this.photoLibrary.requestAuthorization({read: true, write: true}).then(() => {
            this.photoLibrary.saveImage(this.showImgSrc, 'SGMW').then(() => {
                this.commonSer.alert('保存成功');
            })
        }, (err) => {
            this.commonSer.alert(`没有相册权限，请手动设置权限`);
        })
    }

    CloseImg() {
        this.showImg = false;
        this.showImgSrc = '';
    }

    initImg() {
        this.swiper = new Swiper(this.panel.nativeElement, {
            direction: 'horizontal',
            initialSlide: this.vm.selectedIndex,//初始化显示第几个
            zoom: true,//双击,手势缩放
            loop: false,//循环切换
            // loopAdditionalSlides :3,
            lazyLoading: true,//延迟加载
            lazyLoadingOnTransitionStart: true,//    lazyLoadingInPrevNext : true,
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction'
            },
            on: {
                // tap:(e) =>{
                click: (e) => {
                    setTimeout(() => {
                        this.CloseImgTime = new Date().getTime();
                        this.showImg = false;
                    }, 10);
                },
                slideChange: () => {
                    if (this.swiper) {
                        let activeIndex = this.swiper.activeIndex;
                        if (activeIndex < this.vm.images.length && activeIndex >= 0) {
                            this.vm.selectedIndex = activeIndex;
                            this.showImgSrc = this.vm.images[activeIndex];
                        }
                    }
                }
            }
        })
    }
}
