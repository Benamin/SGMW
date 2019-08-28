webpackJsonp([0],{

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LearningPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__course_detail_course_detail__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__learn_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home_service__ = __webpack_require__(140);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LearningPage = /** @class */ (function () {
    function LearningPage(navCtrl, navParams, loadCtrl, learnSer, homeSer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadCtrl = loadCtrl;
        this.learnSer = learnSer;
        this.homeSer = homeSer;
        this.code = "Subject";
        this.tabsList = [];
        this.productList = [];
        this.headList = [];
        this.page = {
            SubjectID: '',
            page: '1',
            pageSize: "2000"
        };
    }
    LearningPage.prototype.ionViewDidLoad = function () {
        var item = this.navParams.get('item');
        if (item) {
            this.page.SubjectID = item.ID;
            this.headType = this.navParams.get('headType');
            this.getProduct();
        }
        else {
            this.getSubjectList();
        }
    };
    LearningPage.prototype.getSubjectList = function () {
        var _this = this;
        this.homeSer.GetDictionaryByPCode("Subject").subscribe(function (res) {
            _this.headList = res.data.map(function (e) {
                return { type: e.TypeCode, name: e.TypeName };
            });
            _this.selectType(_this.headList[1], 1);
        });
        // this.homeSer.GetDictionaryByPCodeByNative('Subject').then(
        //         //     (res) => {
        //         //
        //         //     }
        //         // )
    };
    LearningPage.prototype.selectType = function (title, index) {
        var _this = this;
        this.headType = index;
        this.code = title.type;
        this.homeSer.GetDictionaryByPCode(this.code).subscribe(function (res) {
            _this.tabsList = res.data.map(function (e) {
                return { type: e.TypeCode, name: e.TypeName, ID: e.ID };
            });
            _this.page.SubjectID = _this.tabsList[0].ID;
            _this.getProduct();
        });
    };
    LearningPage.prototype.getProduct = function () {
        var _this = this;
        var loading = this.loadCtrl.create({
            content: '加载中...'
        });
        loading.present();
        var data = {
            SubjectID: this.page.SubjectID,
            page: this.page.page,
            pageSize: this.page.pageSize
        };
        this.learnSer.GetProductList(data).subscribe(function (res) {
            _this.productList = res.data.ProductList;
            loading.dismiss();
        });
        // this.learnSer.GetProductListByNative(data).then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.productList = res1.data.ProductList;
        //         loading.dismiss();
        //     }
        // )
    };
    LearningPage.prototype.getTabs = function (e) {
        this.page.SubjectID = e.ID;
        this.getProduct();
    };
    LearningPage.prototype.goCourse = function (e) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__course_detail_course_detail__["a" /* CourseDetailPage */], { id: e.Id });
    };
    LearningPage.prototype.doInfinite = function (e) {
        e.complete();
    };
    LearningPage.prototype.doRefresh = function (e) {
        e.complete();
    };
    LearningPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-learning',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/learning/learning.html"*/'<ion-header>\n  <div class="header" style="width: 100%">\n    <ng-container *ngFor="let title of headList;let i = index">\n      <div (click)="selectType(title,i)">\n        <span [ngClass]="{\'select\':headType == i}">{{title.name}}</span>\n      </div>\n    </ng-container>\n  </div>\n</ion-header>\n<ion-content>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingText="下拉刷新"\n                           refreshingSpinner="bubbles">\n    </ion-refresher-content>\n  </ion-refresher>\n<scroll-tabs [tabsList]="tabsList" (done)="getTabs($event)"></scroll-tabs>\n<course-list [list]="productList" (done)="goCourse($event)"></course-list>\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n    <ion-infinite-scroll-content\n            loadingSpinner="bubbles"\n            loadingText="加载中"></ion-infinite-scroll-content>\n  </ion-infinite-scroll>\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/learning/learning.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_3__learn_service__["a" /* LearnService */], __WEBPACK_IMPORTED_MODULE_4__home_home_service__["a" /* HomeService */]])
    ], LearningPage);
    return LearningPage;
}());

//# sourceMappingURL=learning.js.map

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SERVER_API_URL; });
/* unused harmony export pageSize */
var SERVER_API_URL = '/api';
// export const SERVER_API_URL = 'http://devapi.chinacloudsites.cn/api';
var pageSize = 10;
//# sourceMappingURL=app.constants.js.map

/***/ }),

/***/ 140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_constants__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_http__ = __webpack_require__(88);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HomeService = /** @class */ (function () {
    function HomeService(http, nativeHttp) {
        this.http = http;
        this.nativeHttp = nativeHttp;
    }
    //获取banner
    HomeService.prototype.getBannerList = function () {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/ENews/GetBannerList');
    };
    //获取banner By Native
    HomeService.prototype.getBannerListByNative = function () {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/ENews/GetBannerList', null, null);
    };
    //优秀教师，关注教师
    HomeService.prototype.GetGoodTeacherList = function () {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/user/GetGoodTeacherList');
    };
    HomeService.prototype.GetGoodTeacherListBynative = function () {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/user/GetGoodTeacherList', null, null);
    };
    //课程分类
    HomeService.prototype.GetDictionaryByPCode = function (params) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetEproductCountByCode?code=' + params);
    };
    HomeService.prototype.GetDictionaryByPCodeByNative = function (params) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetEproductCountByCode?code=' + params, null, null);
    };
    HomeService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_http__["a" /* HTTP */]])
    ], HomeService);
    return HomeService;
}());

//# sourceMappingURL=home.service.js.map

/***/ }),

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_service__ = __webpack_require__(334);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_service__ = __webpack_require__(61);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, loadCtrl, loginSer, storage, appSer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadCtrl = loadCtrl;
        this.loginSer = loginSer;
        this.storage = storage;
        this.appSer = appSer;
        this.user = {
            LoginName: 'sgmwadmin',
            Password: 'P@ssw0rd'
        };
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        var loading = this.loadCtrl.create({
            content: '登录中...'
        });
        loading.present();
        this.loginSer.loginpost(this.user).subscribe(function (res) {
            _this.storage.set('Authorization', res.data.Token);
            _this.appSer.setMine(res.data.User);
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
        });
        // this.loginSer.loginpostByNative(this.user).then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.storage.set('Authorization', res1.data.Token);
        //         this.appSer.setMine(res1.data.User);
        //         this.navCtrl.setRoot(TabsPage);
        //     }
        // );
        loading.dismiss();
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/login/login.html"*/'<ion-header>\n    <ion-navbar>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="login">\n        <div class="logo">\n            <img src="../assets/imgs/login/logo.png" alt="">\n        </div>\n        <div class="login-input">\n<!--            <ion-input placeholder="请输入经销商号"></ion-input>-->\n            <ion-input [(ngModel)]="user.LoginName" placeholder="请输入操作员名"></ion-input>\n            <ion-input [(ngModel)]="user.Password" type="password" placeholder="请输入密码"></ion-input>\n            <div class="check">\n                <ion-input placeholder="请输入验证码"></ion-input>\n                <img class="flash" src="../assets/imgs/login/flash.png" alt="">\n            </div>\n\n        </div>\n        <div class="login-button" (click)="login()">\n            <img src="../assets/imgs/login/button.png" alt="">\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_3__login_service__["a" /* LoginService */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_5__app_app_service__["a" /* AppService */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_service__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__learning_learn_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_common_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__learning_learning__ = __webpack_require__(138);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, homeSer, learnSer, commonSer) {
        this.navCtrl = navCtrl;
        this.homeSer = homeSer;
        this.learnSer = learnSer;
        this.commonSer = commonSer;
        this.type = 'teacher';
        this.personrType = 0;
        this.saleList = []; //销售运营
        this.productList = new Array(5); //产品体验
        this.teacherList = [];
        this.bannerList = [];
    }
    HomePage.prototype.ionViewDidLoad = function () {
        this.getBanner();
        this.getGoodsTeacher();
        this.getProductList();
    };
    HomePage.prototype.ionViewDidEnter = function () {
    };
    HomePage.prototype.selectType = function (type) {
        this.type = type;
    };
    HomePage.prototype.saleToLearn = function (item) {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__learning_learning__["a" /* LearningPage */], { item: item, headType: 2 });
        this.navCtrl.parent.select(1);
    };
    HomePage.prototype.goToLearn = function (index) {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__learning_learning__["a" /* LearningPage */], { item: this.productList[index], headType: 1 });
        this.navCtrl.parent.select(1);
    };
    HomePage.prototype.selectPerson = function (index) {
        this.personrType = index;
        var width = this.imgWidth.nativeElement.offsetWidth / 5;
        this.angular.nativeElement.style.left = index * width + width / 2 - 10 + 'px';
    };
    //获取轮播图
    HomePage.prototype.getBanner = function () {
        var _this = this;
        this.homeSer.getBannerList().subscribe(function (res) {
            _this.bannerList = res.data.NewsItems;
        });
        // this.homeSer.getBannerListByNative().then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         console.log(res1);
        //         this.bannerList = res1.data.NewsItems;
        //     }
        // )
    };
    //优秀教师
    HomePage.prototype.getGoodsTeacher = function () {
        var _this = this;
        this.homeSer.GetGoodTeacherList().subscribe(function (res) {
            _this.teacherList = res.data.TeacherItems;
        });
        // this.homeSer.GetGoodTeacherListBynative().then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.teacherList = res1.data.TeacherItems;
        //     }
        // )
    };
    //获取产品分类 nlts
    HomePage.prototype.getProductList = function () {
        var _this = this;
        this.homeSer.GetDictionaryByPCode('nlts').subscribe(function (res) {
            _this.saleList = res.data;
        });
        // this.homeSer.GetDictionaryByPCodeByNative('nlts').then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.saleList = res1.data;
        //     }
        // );
        this.homeSer.GetDictionaryByPCode('cpty').subscribe(function (res) {
            _this.productList = res.data;
        });
        // this.homeSer.GetDictionaryByPCodeByNative('cpty').then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.productList = res1.data;
        //     }
        // );
    };
    HomePage.prototype.focusHandle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            TopicID: this.teacherList[this.personrType].UserID
                        };
                        return [4 /*yield*/, this.learnSer.SaveSubscribe(data).subscribe(function (res) {
                                _this.commonSer.toast('关注成功');
                            })];
                    case 1:
                        _a.sent();
                        // await this.learnSer.SaveSubscribeByNative(data).then(
                        //     (res) => {
                        //         this.commonSer.toast('关注成功');
                        //     }
                        // );
                        return [4 /*yield*/, this.getGoodsTeacher()];
                    case 2:
                        // await this.learnSer.SaveSubscribeByNative(data).then(
                        //     (res) => {
                        //         this.commonSer.toast('关注成功');
                        //     }
                        // );
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.cancleFocusHandle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            TopicID: this.teacherList[this.personrType].UserID
                        };
                        this.learnSer.CancelSubscribe(data).subscribe(function (res) {
                            _this.commonSer.toast('取消关注成功');
                        });
                        // this.learnSer.CancelSubscribeByNative(data).then(
                        //     (res) => {
                        //         this.commonSer.toast('取消关注成功');
                        //     }
                        // );
                        return [4 /*yield*/, this.getGoodsTeacher()];
                    case 1:
                        // this.learnSer.CancelSubscribeByNative(data).then(
                        //     (res) => {
                        //         this.commonSer.toast('取消关注成功');
                        //     }
                        // );
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewChild */])('angular'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], HomePage.prototype, "angular", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewChild */])('imgWidth'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], HomePage.prototype, "imgWidth", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/home/home.html"*/'<ion-header>\n    <ion-navbar style="padding-right: 0">\n        <ion-buttons start>\n            <button ion-button icon-only class="search-button">\n                <img class="toolbar-img" src="../../assets/imgs/home/logo@2x.png">\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="banner">\n        <div class="img">\n            <ion-slides>\n                <ion-slide *ngFor="let item of bannerList">\n                    <img [src]="item.SourceUrl">\n                    <div class="banner-tips">\n                        {{item.Title}}\n                    </div>\n                </ion-slide>\n            </ion-slides>\n        </div>\n    </div>\n    <!--  销售运营-->\n    <div class="sale">\n        <p>销售运营</p>\n        <div class="sale-box">\n            <div class="scroll-tab">\n                <div class="sale-content">\n                    <div class="sale-item" *ngFor="let sale of saleList;let i = index;" (click)="saleToLearn(sale)">\n                        <img src="../../assets/imgs/home/shop{{i+1+\'.jpg\'}}" alt="">\n                        <div class="sale-desc">\n                            <p>{{sale.TypeName}}</p>\n                            <p>超过{{sale.CourseCount}}人学习</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="space"></div>\n    <!--  产品体验-->\n    <div class="product">\n        <p>产品体验</p>\n        <div class="item">\n            <div class="m11_img" style="height: 160px" (click)="goToLearn(0)">\n                <img src="../../assets/imgs/home/m11_img2@2x.jpg" alt="">\n                <div class="left-font">\n                    <p>{{productList[0]?.TypeName}}</p>\n                    <p>{{productList[0]?.HourCount}}小时/超过{{productList[0]?.CourseCount}}门课程</p>\n                </div>\n            </div>\n            <div style="height: 160px" (click)="goToLearn(1)">\n                <div class="m11_img" style="padding: 0 0 4px 8px;height: 80px">\n                    <img src="../../assets/imgs/home/m11_img3@2x.jpg" style="height: 76px">\n                    <div class="right-font1">\n                        <p>{{productList[1]?.TypeName}}</p>\n                        <p>{{productList[1]?.HourCount}}小时/超过{{productList[1]?.CourseCount}}门课程</p>\n                    </div>\n                </div>\n                <div class="m11_img" style="padding: 4px 0 0 8px;height: 80px" (click)="goToLearn(2)">\n                    <img src="../../assets/imgs/home/m11_img4@2x.jpg" style="height: 76px">\n                    <div class="right-font2">\n                        <p>{{productList[2]?.TypeName}}</p>\n                        <p>{{productList[2]?.HourCount}}小时/超过{{productList[2]?.CourseCount}}门课程</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <!--  中间提示-->\n    <div class="item" style="margin: 5px 0;">\n        <div>\n            <div style="text-align: center">\n                <img style="width: 20%;" src="../../assets/imgs/home/m11_icon1@2x.png" alt="">\n            </div>\n            无限制访问\n        </div>\n        <div>\n            <div style="text-align: center">\n                <img style="width: 20%;" src="../../assets/imgs/home/m11_icon2@2x.png" alt="">\n            </div>\n            名师护航\n        </div>\n    </div>\n    <div style="padding: 10px;" class="item">\n        <div class="m11_img" style="padding: 5px;" (click)="goToLearn(3)">\n            <img src="../../assets/imgs/home/m11_img5@2x.jpg" alt="">\n            <div class="img-font">\n                <p>{{productList[3]?.TypeName}}</p>\n                <p>{{productList[3]?.HourCount}}小时/超过{{productList[3]?.CourseCount}}门课程</p>\n            </div>\n        </div>\n        <div class="m11_img" style="padding: 5px;" (click)="goToLearn(4)">\n            <img src="../../assets/imgs/home/m11_img6@2x.jpg" alt="">\n            <div class="img-font">\n                <p>{{productList[4]?.TypeName}}</p>\n                <p>{{productList[4]?.HourCount}}小时/超过{{productList[4]?.CourseCount}}门课程</p>\n            </div>\n        </div>\n    </div>\n    <div class="person">\n        <div #imgWidth class="person-img">\n            <ng-container *ngFor="let img of teacherList;let i = index;">\n                <img *ngIf="img.HeadPhoto" [ngClass]="{\'select\':personrType == i}" (click)="selectPerson(i)"\n                     [src]="img.HeadPhoto">\n                <img *ngIf="!img.HeadPhoto" [ngClass]="{\'select\':personrType == i}" (click)="selectPerson(i)"\n                     src="../../assets/imgs/home/goodTeacher.png">\n            </ng-container>\n        </div>\n        <div class="person-desc">\n            <span #angular class="angular"></span>\n            <div class="desc-title">\n                {{teacherList[personrType]?.Position}}\n                <span class="focus" *ngIf="teacherList[personrType]?.IsSubscribe == false"\n                      (click)="focusHandle()">关注</span>\n                <span class="focus" *ngIf="teacherList[personrType]?.IsSubscribe == true"\n                      (click)="cancleFocusHandle()">已关注</span>\n            </div>\n            <div class="desc-desc">\n                {{teacherList[personrType]?.Remark}}\n            </div>\n        </div>\n    </div>\n    <!--  优秀教师-->\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__home_service__["a" /* HomeService */],
            __WEBPACK_IMPORTED_MODULE_3__learning_learn_service__["a" /* LearnService */], __WEBPACK_IMPORTED_MODULE_4__core_common_service__["a" /* CommonService */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 174:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 174;

/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/course/course.module": [
		219
	],
	"../pages/learning/learning.module": [
		318
	],
	"../pages/login/login.module": [
		326
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 218;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoursePageModule", function() { return CoursePageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__course__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_components_module__ = __webpack_require__(78);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var CoursePageModule = /** @class */ (function () {
    function CoursePageModule() {
    }
    CoursePageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__course__["a" /* CoursePage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__course__["a" /* CoursePage */]),
                __WEBPACK_IMPORTED_MODULE_3__components_components_module__["a" /* ComponentsModule */],
            ],
            entryComponents: [],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NO_ERRORS_SCHEMA */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* CUSTOM_ELEMENTS_SCHEMA */]]
        })
    ], CoursePageModule);
    return CoursePageModule;
}());

//# sourceMappingURL=course.module.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoursePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CoursePage = /** @class */ (function () {
    function CoursePage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.navbarList = [
            { type: '1', name: '学习中' },
            { type: '2', name: '已完成' },
        ];
        this.slide = [1, 2, 3];
        this.list = [];
    }
    CoursePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CoursePage');
        this.getList();
    };
    CoursePage.prototype.getList = function () {
        for (var i = 0; i < 10; i++) {
            this.list.push(i);
        }
    };
    CoursePage.prototype.slideChanged = function () {
    };
    CoursePage.prototype.doRefresh = function (e) {
        e.complete();
    };
    CoursePage.prototype.doInfinite = function (e) {
        var len = this.list.length;
        for (var i = len; i < len + 10; i++) {
            this.list.push(i);
        }
        e.complete();
    };
    CoursePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-course',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/course/course.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>我的课程</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <navbar [list]="navbarList"></navbar>\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/course/course.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], CoursePage);
    return CoursePage;
}());

//# sourceMappingURL=course.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavbarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NavbarComponent = /** @class */ (function () {
    function NavbarComponent() {
        this.bar = {
            type: "1",
        };
        console.log('Hello NavbarComponent Component');
    }
    NavbarComponent.prototype.changeType = function (item) {
        this.bar.type = item.type;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], NavbarComponent.prototype, "list", void 0);
    NavbarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'navbar',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/components/navbar/navbar.html"*/'<div class="navbar">\n    <ng-container *ngFor="let item of list;let i = index;">\n        <div class="navbar-item" (click)="changeType(item)">\n            <span class="{{bar.type == item.type?\'duty-title\':\'\'}}">{{item.name}}</span>\n        </div>\n    </ng-container>\n</div>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/components/navbar/navbar.html"*/
        })
        /**
         * list = [ { type:"1",name:"类型" } ]
         */
        ,
        __metadata("design:paramtypes", [])
    ], NavbarComponent);
    return NavbarComponent;
}());

//# sourceMappingURL=navbar.js.map

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_keyboard__ = __webpack_require__(223);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CommentComponent = /** @class */ (function () {
    function CommentComponent(navCtrl, navParams, keyboard, viewCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.keyboard = keyboard;
        this.viewCtrl = viewCtrl;
        this.starList = ["icon-star", "icon-star", "icon-star", "icon-star", "icon-star"];
        this.placeholder = this.navParams.get('placeholder');
        setTimeout(function () {
            _this.textAreaElement.nativeElement.focus();
            _this.keyboard.show();
        }, 500);
    }
    /**
     *
     * @param score  分数 从0开始
     */
    CommentComponent.prototype.checkStar = function (score) {
        this.score = score + 1;
        var arr = new Array(5);
        for (var i = 0; i < arr.length; i++) {
            if (i < score + 1) {
                arr[i] = "icon-star-fill";
            }
            else {
                arr[i] = "icon-star";
            }
        }
        this.starList = arr;
    };
    CommentComponent.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    CommentComponent.prototype.stop = function (e) {
        e.stopPropagation();
    };
    CommentComponent.prototype.submit = function () {
        var data = {
            'replyContent': this.replyContent,
            'score': this.score
        };
        this.viewCtrl.dismiss(data);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewChild */])('textAreaElement'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], CommentComponent.prototype, "textAreaElement", void 0);
    CommentComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'comment',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/components/comment/comment.html"*/'<div class="main" >\n  <div class="content" (click)="close()" >\n    <div class="comment" (click)="stop($event)">\n      <div class="padding-10">\n        <textarea #textAreaElement [(ngModel)]="replyContent" class="content-textarea" placeholder="{{placeholder}}"></textarea>\n      </div>\n      <ion-row style="margin-top: 5px">\n        <ion-col col-5>\n          <span class="send" (click)="submit()">发送</span>\n        </ion-col>\n        <ion-col col-7 text-center class="img-star">\n          <ng-container *ngFor="let star of starList;let i = index;">\n            <span (click)="checkStar(i)" [ngClass]="star" class="icon iconfont"></span>\n          </ng-container>\n        </ion-col>\n      </ion-row>\n    </div>\n  </div>\n</div>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/components/comment/comment.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */]])
    ], CommentComponent);
    return CommentComponent;
}());

//# sourceMappingURL=comment.js.map

/***/ }),

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LearningPageModule", function() { return LearningPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__learning__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__course_comment_course_comment__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__course_detail_course_detail__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_components_module__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__teacher_teacher__ = __webpack_require__(320);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var LearningPageModule = /** @class */ (function () {
    function LearningPageModule() {
    }
    LearningPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__learning__["a" /* LearningPage */],
                __WEBPACK_IMPORTED_MODULE_4__course_detail_course_detail__["a" /* CourseDetailPage */],
                __WEBPACK_IMPORTED_MODULE_3__course_comment_course_comment__["a" /* CourseCommentPage */],
                __WEBPACK_IMPORTED_MODULE_6__teacher_teacher__["a" /* TeacherPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__learning__["a" /* LearningPage */]),
                __WEBPACK_IMPORTED_MODULE_5__components_components_module__["a" /* ComponentsModule */],
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__course_comment_course_comment__["a" /* CourseCommentPage */],
                __WEBPACK_IMPORTED_MODULE_4__course_detail_course_detail__["a" /* CourseDetailPage */],
                __WEBPACK_IMPORTED_MODULE_6__teacher_teacher__["a" /* TeacherPage */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* CUSTOM_ELEMENTS_SCHEMA */]]
        })
    ], LearningPageModule);
    return LearningPageModule;
}());

//# sourceMappingURL=learning.module.js.map

/***/ }),

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CourseDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__teacher_teacher__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__course_comment_course_comment__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_timer__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_timer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_timer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__learn_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_service__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_common_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_file_service__ = __webpack_require__(323);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};









var CourseDetailPage = /** @class */ (function () {
    function CourseDetailPage(navCtrl, navParams, learSer, loadCtrl, appSer, commonSer, fileSer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.learSer = learSer;
        this.loadCtrl = loadCtrl;
        this.appSer = appSer;
        this.commonSer = commonSer;
        this.fileSer = fileSer;
        this.product = {
            detail: null,
            chapter: null,
            videoPath: null
        };
        this.learnList = [];
        this.navbarList = [
            { type: '1', name: '简介' },
            { type: '2', name: '章节' },
            { type: '3', name: '教师' },
            { type: '4', name: '评价' },
            { type: '5', name: '相关' },
        ];
        this.signObj = {
            isSign: false,
        };
        this.collectionObj = {
            isCollection: false
        };
        this.pId = this.navParams.get('id');
    }
    CourseDetailPage_1 = CourseDetailPage;
    CourseDetailPage.prototype.ionViewDidLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.appSer.fileInfo.subscribe(function (value) {
                            if (value) {
                                _this.product.videoPath = value.fileUrl;
                                if (value.fileUrl)
                                    _this.viewFile(value.fileUrl, value.fileName);
                            }
                        });
                        return [4 /*yield*/, this.learSer.GetProductById(this.pId).subscribe(function (res) {
                                _this.product.detail = res.data;
                                _this.getProductInfo();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CourseDetailPage.prototype.ionViewDidLeave = function () {
        this.appSer.setFile(null);
    };
    CourseDetailPage.prototype.viewFile = function (fileUrl, fileName) {
        this.fileSer.downloadFile(fileUrl, fileName);
    };
    //课程详情、课程章节、相关课程、课程评价
    CourseDetailPage.prototype.getProductInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loading, data, data1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading = this.loadCtrl.create({
                            content: '课程正在打开...'
                        });
                        loading.present();
                        data = {
                            pid: this.pId
                        };
                        return [4 /*yield*/, this.learSer.GetAdminChapterListByProductID(this.pId).subscribe(function (res) {
                                _this.product.chapter = res.data;
                            })
                            // await this.learSer.GetAdminChapterListByProductIDByNative(this.pId).then(
                            //     (res) => {
                            //         let res1 = JSON.parse(res.data);
                            //         console.log(res1);
                            //         this.product.chapter = res1.data;
                            //     }
                            // )
                        ];
                    case 1:
                        _a.sent();
                        // await this.learSer.GetAdminChapterListByProductIDByNative(this.pId).then(
                        //     (res) => {
                        //         let res1 = JSON.parse(res.data);
                        //         console.log(res1);
                        //         this.product.chapter = res1.data;
                        //     }
                        // )
                        return [4 /*yield*/, this.learSer.GetRelationProductList(data).subscribe(function (res) {
                                _this.learnList = res.data.ProductList;
                            })];
                    case 2:
                        // await this.learSer.GetAdminChapterListByProductIDByNative(this.pId).then(
                        //     (res) => {
                        //         let res1 = JSON.parse(res.data);
                        //         console.log(res1);
                        //         this.product.chapter = res1.data;
                        //     }
                        // )
                        _a.sent();
                        data1 = {
                            topicID: this.product.detail.PrId
                        };
                        return [4 /*yield*/, this.learSer.GetCommentSum(data1).subscribe(function (res) {
                            })];
                    case 3:
                        _a.sent();
                        // await this.learSer.GetCommentSumByNative(data1).then(
                        //     (res) => {
                        //
                        //     }
                        // );
                        return [4 /*yield*/, loading.dismiss()];
                    case 4:
                        // await this.learSer.GetCommentSumByNative(data1).then(
                        //     (res) => {
                        //
                        //     }
                        // );
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CourseDetailPage.prototype.teachDetail = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__teacher_teacher__["a" /* TeacherPage */], { item: this.product.detail.Teachers[0] });
    };
    CourseDetailPage.prototype.focusHandle = function (UserID) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            TopicID: UserID
                        };
                        return [4 /*yield*/, this.learSer.SaveSubscribe(data).subscribe(function (res) {
                                _this.commonSer.toast('关注成功');
                                _this.ionViewDidLoad();
                            })
                            // await this.learSer.SaveSubscribeByNative(data).then(
                            //     (res) => {
                            //         this.commonSer.toast('关注成功');
                            //         this.ionViewDidLoad();
                            //     }
                            // )
                        ];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CourseDetailPage.prototype.cancleFocusHandle = function (UserID) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var data;
            return __generator(this, function (_a) {
                data = {
                    TopicID: UserID
                };
                this.learSer.CancelSubscribe(data).subscribe(function (res) {
                    _this.commonSer.toast('取消关注成功');
                    _this.ionViewDidLoad();
                });
                return [2 /*return*/];
            });
        });
    };
    //教师评价
    CourseDetailPage.prototype.goTeacherComment = function () {
        console.log(this.product.detail.Teachers[0].UserID);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__course_comment_course_comment__["a" /* CourseCommentPage */], {
            TopicID: this.product.detail.Teachers[0].UserID,
            TopicType: 'teacher',
            title: '教师评价'
        });
    };
    //课程评价
    CourseDetailPage.prototype.goCourseComment = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__course_comment_course_comment__["a" /* CourseCommentPage */], {
            TopicID: this.product.detail.PrId,
            TopicType: 'course',
            title: '课程评价'
        });
    };
    //课程
    CourseDetailPage.prototype.goCourse = function (e) {
        this.navCtrl.push(CourseDetailPage_1, { id: e.Id });
    };
    //报名
    CourseDetailPage.prototype.sign = function () {
        var _this = this;
        var data = {
            pid: this.pId
        };
        this.learSer.BuyProduct(data).subscribe(function (res) {
            _this.signObj.isSign = true;
            Object(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_timer__["timer"])(1000).subscribe(function () { return _this.signObj.isSign = false; });
        });
        // this.learSer.BuyProductByNative(data).then(
        //     (res) => {
        //         this.signObj.isSign = true;
        //         timer(1000).subscribe(() => this.signObj.isSign = false);
        //     }
        // )
    };
    //收藏
    CourseDetailPage.prototype.collection = function () {
        var _this = this;
        var data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.SaveCollectionByCSID(data).subscribe(function (res) {
            _this.ionViewDidLoad();
            _this.collectionObj.isCollection = true;
            Object(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_timer__["timer"])(1000).subscribe(function () { return _this.collectionObj.isCollection = false; });
        });
        // this.learSer.SaveCollectionByCSIDByNative(data).then(
        //     (res) => {
        //         this.ionViewDidLoad();
        //         this.collectionObj.isCollection = true;
        //         timer(1000).subscribe(() => this.collectionObj.isCollection = false);
        //     }
        // )
    };
    //取消收藏
    CourseDetailPage.prototype.cancleCollection = function () {
        var _this = this;
        var data = {
            CSID: this.product.detail.PrId
        };
        this.learSer.CancelCollectionByCSID(data).subscribe(function (res) {
            _this.ionViewDidLoad();
        });
        // this.learSer.CancelCollectionByCSIDByNative(data).then(
        //     (res) => {
        //         this.ionViewDidLoad();
        //     }
        // )
    };
    CourseDetailPage.prototype.getInfo = function (e) {
    };
    CourseDetailPage = CourseDetailPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-course-detail',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/learning/course-detail/course-detail.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{product.detail?.Title}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="banner">\n        <div class="content" *ngIf="!product.videoPath">\n            <div class="course-name">\n                {{product.detail?.Description}}\n            </div>\n            <div class="course-desc">\n                <span>20课时</span>\n                <span>评价</span>\n                <span>收藏</span>\n            </div>\n        </div>\n        <div class="content video" *ngIf="product.videoPath">\n            <video width="100%" height="100%" poster="{{product.chapter?.Course?.CoverUrl}}" [src]="product.videoPath" controls="controls">\n                您的浏览器不支持 html5。\n            </video>\n        </div>\n    </div>\n    <navbar [list]="navbarList"></navbar>\n    <div class="space"></div>\n    <div class="item">\n        <p>简介</p>\n        <div class="introduction">\n            {{product.detail?.Description}}\n        </div>\n    </div>\n    <div class="space"></div>\n    <div class="item">\n        <p>章节</p>\n        <div>\n            <ng-container *ngFor="let item of product.chapter?.Course?.children">\n                <p>{{item.title}}</p>\n                <p *ngIf="item.children">\n                    <tree-list [treeList]="item.children" (fileData)="getInfo($event)" ></tree-list>\n                </p>\n            </ng-container>\n        </div>\n    </div>\n    <div class="space"></div>\n    <div class="item">\n        <p>教师\n            <span (click)="teachDetail()" float-end class="look">查看</span>\n        </p>\n        <div class="teacher-info" *ngFor="let item of  product.detail?.Teachers">\n            <div>\n                <img [src]="item.HeadPhoto">\n            </div>\n            <div>\n                <p>{{item.UserName}}</p>\n                <p>{{item.Position}}</p>\n            </div>\n            <div>\n                <span *ngIf="item.IsSubscribe == false" (click)="focusHandle(item.UserID)" class="focus">关注</span>\n                <span *ngIf="item.IsSubscribe == true" (click)="cancleFocusHandle(item.UserID)" class="focus">取消关注</span>\n            </div>\n        </div>\n    </div>\n    <div class="space"></div>\n    <div class="item">\n        <p>课程评价<span float-end class="look" (click)="goCourseComment()">更多</span></p>\n        <div class="course-comment">\n            <div>4.0</div>\n            <div>\n                <p>1902个评价</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>课程适用</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>通俗易懂</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>逻辑清晰</p>\n            </div>\n        </div>\n    </div>\n    <div class="space"></div>\n    <div class="item">\n        <p>教师评价<span (click)="goTeacherComment()" float-end class="look">更多</span></p>\n        <div class="teacher-comment">\n            <div>4.0</div>\n            <div>\n                <p>1902个评价</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>课程适用</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>通俗易懂</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>逻辑清晰</p>\n            </div>\n        </div>\n    </div>\n    <div class="space"></div>\n    <div class="item">\n        <p>相关课程</p>\n        <course-list [list]="learnList" (done)="goCourse($event)"></course-list>\n    </div>\n</ion-content>\n\n<ion-footer class="course-footer">\n    <ion-toolbar *ngIf="!product.detail?.IsBuy" (click)="sign()">\n        <ion-buttons tappable>立即报名</ion-buttons>\n    </ion-toolbar>\n    <ion-toolbar *ngIf="product.detail?.IsBuy">\n        <ion-buttons tappable (click)="sign()">立即学习</ion-buttons>\n    </ion-toolbar>\n    <ion-toolbar *ngIf="!product.detail?.IsCollection" (click)="collection()">\n        <ion-buttons>收藏</ion-buttons>\n    </ion-toolbar>\n\n    <ion-toolbar *ngIf="product.detail?.IsCollection" (click)="cancleCollection()">\n        <ion-buttons>已收藏</ion-buttons>\n    </ion-toolbar>\n\n</ion-footer>\n\n<div *ngIf="signObj.isSign" class="sign">\n    <img src="../assets/imgs/course/sign-success.png">\n    <p>报名成功</p>\n</div>\n<div *ngIf="collectionObj.isCollection" class="collection">\n    <img src="../assets/imgs/course/collection-success.png">\n    <p>收藏成功</p>\n</div>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/learning/course-detail/course-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_5__learn_service__["a" /* LearnService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_6__app_app_service__["a" /* AppService */], __WEBPACK_IMPORTED_MODULE_7__core_common_service__["a" /* CommonService */],
            __WEBPACK_IMPORTED_MODULE_8__core_file_service__["a" /* FileService */]])
    ], CourseDetailPage);
    return CourseDetailPage;
    var CourseDetailPage_1;
}());

//# sourceMappingURL=course-detail.js.map

/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TeacherPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TeacherPage = /** @class */ (function () {
    function TeacherPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    TeacherPage.prototype.ionViewDidLoad = function () {
        this.info = this.navParams.get('item');
    };
    TeacherPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-teacher',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/learning/teacher/teacher.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>教师详情</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="container">\n        <div><img [src]="info?.HeadPhoto" alt=""></div>\n        <p class="name">{{info?.UserName}}</p>\n        <p class="position">{{info?.Position}}</p>\n        <p><span class="focus">关注</span></p>\n        <div class="desc-desc">\n            {{info?.Remark}}\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/learning/teacher/teacher.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], TeacherPage);
    return TeacherPage;
}());

//# sourceMappingURL=teacher.js.map

/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CourseCommentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_comment_comment__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__learn_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_common_service__ = __webpack_require__(45);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CourseCommentPage = /** @class */ (function () {
    function CourseCommentPage(navCtrl, navParams, commonSer, modalCtrl, learnSer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.commonSer = commonSer;
        this.modalCtrl = modalCtrl;
        this.learnSer = learnSer;
        this.list = [];
        this.starList = new Array(5);
        this.page = {
            pageSize: 100,
            page: 1,
            total: null
        };
    }
    CourseCommentPage.prototype.ionViewDidLoad = function () {
        this.topicID = this.navParams.get("TopicID");
        this.TopicType = this.navParams.get("TopicType");
        this.title = this.navParams.get("title");
        this.getList();
    };
    CourseCommentPage.prototype.getList = function () {
        var _this = this;
        var data = {
            pageSize: this.page.pageSize,
            page: this.page.page,
            TopicType: this.TopicType,
            topicID: this.topicID
        };
        this.learnSer.GetComment(data).subscribe(function (res) {
            _this.list = res.data.CommentItems;
            _this.page.total = res.data.TotalCount;
        });
        // this.learnSer.GetCommentByNative(data).then(
        //     (res) => {
        //         let res1 = JSON.parse(res.data);
        //         this.list = res1.data.CommentItems;
        //         this.page.total = res.data.data.TotalCount;
        //     }
        // )
    };
    CourseCommentPage.prototype.openComment = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__components_comment_comment__["a" /* CommentComponent */], { placeholder: '请输入评价' });
        modal.onDidDismiss(function (res) {
            if (res) {
                _this.replyHandle(res);
            }
        });
        modal.present();
    };
    CourseCommentPage.prototype.replyHandle = function (res) {
        var _this = this;
        var data = {
            TopicID: this.topicID,
            Score: res.score,
            Contents: res.replyContent,
            TopicType: this.TopicType
        };
        this.learnSer.SaveComment(data).subscribe(function (res) {
            _this.commonSer.toast('评价成功');
            _this.getList();
        });
        // this.learnSer.SaveCommentByNative(data).then(
        //     (res) => {
        //         this.commonSer.toast('评价成功');
        //         this.getList();
        //     }
        // )
    };
    CourseCommentPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-course-comment',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/learning/course-comment/course-comment.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{title}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="item">\n        <div class="course-comment">\n            <div>4.0</div>\n            <div>\n                <p>1902个评价</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>课程适用</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>通俗易懂</p>\n            </div>\n            <div>\n                <p>4.0</p>\n                <p>逻辑清晰</p>\n            </div>\n        </div>\n    </div>\n\n    <div class="space"></div>\n\n    <div class="comment-list">\n        <div class="comment-item" *ngFor="let item of list;">\n            <div class="first">\n                <div>\n                    <img [src]="item.HeadPhoto" alt="">\n                </div>\n                <div>\n                    <p>{{item.UserName}}</p>\n                    <p>{{item.CreateTime | date:\'yyyy-MM-dd\'}}</p>\n                </div>\n                <div class="img-star">\n                    <ng-container *ngFor="let st of starList;let i = index">\n                            <span [ngClass]=" item.Score > i?\'icon-star-fill\':\'icon-star\' "\n                                  class="icon iconfont "></span>\n                    </ng-container>\n                </div>\n            </div>\n            <div class="last">\n                {{item.Contents}}\n            </div>\n        </div>\n    </div>\n</ion-content>\n<ion-footer (click)="openComment()">\n    <div class="course-footer">\n        请输入你对课程的评价...\n    </div>\n</ion-footer>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/learning/course-comment/course-comment.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__core_common_service__["a" /* CommonService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_3__learn_service__["a" /* LearnService */]])
    ], CourseCommentPage);
    return CourseCommentPage;
}());

//# sourceMappingURL=course-comment.js.map

/***/ }),

/***/ 322:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataFormatService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DataFormatService = /** @class */ (function () {
    function DataFormatService() {
    }
    /**
     * JSON格式对象转为form表单的格式，用来接口传递数据
     * @param json   需要转化的json
     * @returns {FormData}   formData数据
     */
    DataFormatService.prototype.toFormData = function (json) {
        var formData = new FormData();
        for (var k in json) {
            formData.append(k, json[k]);
        }
        return formData;
    };
    /**
     * JSON格式数据转化为字符串 接口调用
     * @param data  json格式的数据
     * @returns {string}
     */
    DataFormatService.prototype.toQuery = function (data) {
        var str = '?';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                str += key + '=' + value + '&';
            }
        }
        str = str.substring(0, str.length - 1);
        return str;
    };
    DataFormatService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], DataFormatService);
    return DataFormatService;
}());

//# sourceMappingURL=dataFormat.service.js.map

/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FileService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_file__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_file_opener__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FileService = /** @class */ (function () {
    function FileService(file, fileOpener) {
        this.file = file;
        this.fileOpener = fileOpener;
    }
    /**
     * 下载文件
     * @param url 文件URL
     */
    FileService.prototype.downloadFile = function (fileUrl, fileName) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        var fileType = this.getFileMimeType(fileName);
        var url = encodeURI(fileUrl);
        xhr.open('GET', url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = "blob";
        xhr.addEventListener("loadstart", function (ev) {
        });
        xhr.addEventListener("progress", function (ev) {
            var progress = Math.round(100.0 * ev.loaded / ev.total);
            // alert(progress);
        });
        xhr.addEventListener("load", function (ev) {
            var blob = xhr.response;
            if (blob) {
                var path_1 = _this.file.externalDataDirectory;
                _this.file.writeFile(path_1, fileName, blob, {
                    replace: true
                }).then(function () {
                    _this.fileOpener.open(path_1 + fileName, fileType).catch(function (err) {
                        alert('打开文件失败！' + err);
                    });
                }).catch(function (err) {
                    alert("下载文件失败！");
                });
            }
        });
        xhr.addEventListener("loadend", function (ev) {
            // 结束下载事件
        });
        xhr.addEventListener("error", function (ev) {
            alert('下载文件失败！');
        });
        xhr.addEventListener("abort", function (ev) {
        });
        xhr.send();
    };
    //获取文件类型
    FileService.prototype.getFileMimeType = function (fileName) {
        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        var mimeType = '';
        switch (fileType) {
            case 'txt':
                mimeType = 'text/plain';
                break;
            case 'docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'doc':
                mimeType = 'application/msword';
                break;
            case 'pptx':
                mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                break;
            case 'ppt':
                mimeType = 'application/vnd.ms-powerpoint';
                break;
            case 'xlsx':
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case 'xls':
                mimeType = 'application/vnd.ms-excel';
                break;
            case 'zip':
                mimeType = 'application/x-zip-compressed';
                break;
            case 'rar':
                mimeType = 'application/octet-stream';
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'jpg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            default:
                mimeType = 'application/' + fileType;
                break;
        }
        return mimeType;
    };
    FileService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_file_opener__["a" /* FileOpener */]])
    ], FileService);
    return FileService;
}());

//# sourceMappingURL=file.service.js.map

/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginPageModule", function() { return LoginPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login__ = __webpack_require__(141);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var LoginPageModule = /** @class */ (function () {
    function LoginPageModule() {
    }
    LoginPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */]),
            ],
        })
    ], LoginPageModule);
    return LoginPageModule;
}());

//# sourceMappingURL=login.module.js.map

/***/ }),

/***/ 327:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mine_mine__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__learning_learning__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_backButton_service__ = __webpack_require__(332);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var TabsPage = /** @class */ (function () {
    function TabsPage(platform, backButtonService) {
        var _this = this;
        this.platform = platform;
        this.backButtonService = backButtonService;
        this.tabRoots = [
            {
                root: __WEBPACK_IMPORTED_MODULE_1__home_home__["a" /* HomePage */],
                tabTitle: '首页',
                tabIconOn: 'custom-home-on',
                tabIconOff: 'custom-home-off',
                index: 0
            },
            {
                root: __WEBPACK_IMPORTED_MODULE_4__learning_learning__["a" /* LearningPage */],
                tabTitle: '在线学习',
                tabIconOn: 'custom-discover-on',
                tabIconOff: 'custom-discover-off',
                index: 1
            },
            // {
            //     root: CoursePage,
            //     tabTitle: '我的课程',
            //     tabIconOn: 'custom-serve-on',
            //     tabIconOff: 'custom-serve-off',
            //     index: 2
            // },
            {
                root: __WEBPACK_IMPORTED_MODULE_3__mine_mine__["a" /* MinePage */],
                tabTitle: '个人中心',
                tabIconOn: 'custom-mine-on',
                tabIconOff: 'custom-mine-off',
                index: 3
            },
        ];
        this.platform.ready().then(function () {
            _this.backButtonService.registerBackButtonAction(_this.myTabs);
        });
    }
    TabsPage.prototype.onChange = function (e) {
        this.tabsIndex = e;
        this.myTabs.select(e);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewChild */])('myTabs'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* Tabs */])
    ], TabsPage.prototype, "myTabs", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/tabs/tabs.html"*/'<ion-tabs #myTabs>\n  <ng-container *ngFor = "let tabRoot of tabRoots;let i = index;">\n    <ion-tab  (ionSelect)="onChange(i)" [root] = "tabRoot.root" tabTitle="{{tabRoot.tabTitle}}" tabIcon="{{ tabsIndex == i ? tabRoot.tabIconOn:tabRoot.tabIconOff }}"></ion-tab>\n  </ng-container>\n</ion-tabs>\n\n\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/tabs/tabs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_5__core_backButton_service__["a" /* BackButtonService */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MinePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__my_course_my_course__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mycollection_mycollection__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__notification_notification__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_service__ = __webpack_require__(61);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MinePage = /** @class */ (function () {
    function MinePage(navCtrl, navParams, appSer) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.appSer = appSer;
        //获取个人信息
        this.appSer.mineInfo.subscribe(function (value) {
            _this.mineInfo = value;
        });
    }
    MinePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MinePage');
    };
    //我的课程
    MinePage.prototype.goToCourse = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__my_course_my_course__["a" /* MyCoursePage */]);
    };
    //我的收藏
    MinePage.prototype.goToCollection = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__mycollection_mycollection__["a" /* MycollectionPage */]);
    };
    //通知中心
    MinePage.prototype.goToNoti = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__notification_notification__["a" /* NotificationPage */]);
    };
    MinePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-mine',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/mine/mine.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>个人中心</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="mine">\n        <div class="mine-info">\n            <div class="info-item">\n                <div style="position: relative">\n                    <div class="mask1">\n                        <img class="img3" src="{{mineInfo?.HeadPhoto}}" alt="">\n\n                    </div>\n                </div>\n                <div class="info-name">\n                    <p>{{mineInfo?.LoginName}}</p>\n                </div>\n                <div class="info-position">\n                    <a><img src="../assets/imgs/mine/student.png" ><span>{{mineInfo?.Position}}</span></a>\n                </div>\n            </div>\n<!--            <div class="info-item item-type">-->\n<!--                <div (click)="goToCourse()">-->\n<!--                    <p>7</p>-->\n<!--                    <p>课程</p>-->\n<!--                </div>-->\n<!--                <div>-->\n<!--                    <p>5</p>-->\n<!--                    <p>作业</p>-->\n<!--                </div>-->\n<!--                <div (click)="goToCollection()">-->\n<!--                    <p>8</p>-->\n<!--                    <p>收藏</p>-->\n<!--                </div>-->\n<!--            </div>-->\n        </div>\n    </div>\n    <div class="mine-list">\n<!--        <div class="item" (click)="goToNoti()">-->\n<!--            <div class="left">-->\n<!--                <img src="../assets/imgs/mine/notifation.png" >-->\n<!--            </div>-->\n<!--            <div class="middle">通知中心</div>-->\n<!--            <div class="right">-->\n<!--                <ion-icon name="arrow-forward"></ion-icon>-->\n<!--            </div>-->\n<!--        </div>-->\n        <div class="item">\n            <div class="left">\n                <img src="../assets/imgs/mine/logout.png" >\n            </div>\n            <div class="middle">退出登录</div>\n            <div class="right">\n                <ion-icon name="arrow-forward"></ion-icon>\n            </div>\n        </div>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/mine/mine.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_5__app_app_service__["a" /* AppService */]])
    ], MinePage);
    return MinePage;
}());

//# sourceMappingURL=mine.js.map

/***/ }),

/***/ 329:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyCoursePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MyCoursePage = /** @class */ (function () {
    function MyCoursePage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.navbarList = [
            { type: '1', name: '学习中' },
            { type: '2', name: '已完成' },
        ];
    }
    MyCoursePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MyCoursePage');
    };
    MyCoursePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-my-course',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/mine/my-course/my-course.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>我的课程</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <navbar [list]="navbarList"></navbar>\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/mine/my-course/my-course.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], MyCoursePage);
    return MyCoursePage;
}());

//# sourceMappingURL=my-course.js.map

/***/ }),

/***/ 330:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MycollectionPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MycollectionPage = /** @class */ (function () {
    function MycollectionPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    MycollectionPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MycollectionPage');
    };
    MycollectionPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-mycollection',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/mine/mycollection/mycollection.html"*/'<!--\n  Generated template for the MycollectionPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>我的收藏</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/mine/mycollection/mycollection.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], MycollectionPage);
    return MycollectionPage;
}());

//# sourceMappingURL=mycollection.js.map

/***/ }),

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var NotificationPage = /** @class */ (function () {
    function NotificationPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    NotificationPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad NotificationPage');
    };
    NotificationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-notification',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/mine/notification/notification.html"*/'<!--\n  Generated template for the NotificationPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>通知中心</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/mine/notification/notification.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], NotificationPage);
    return NotificationPage;
}());

//# sourceMappingURL=notification.js.map

/***/ }),

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackButtonService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__emit_service__ = __webpack_require__(333);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BackButtonService = /** @class */ (function () {
    function BackButtonService(platform, appCtrl, eventEmitSer, toastCtrl) {
        var _this = this;
        this.platform = platform;
        this.appCtrl = appCtrl;
        this.eventEmitSer = eventEmitSer;
        this.toastCtrl = toastCtrl;
        //控制硬件返回按钮是否触发，默认false
        this.backButtonPressed = false;
        //  1.false  正常返回上一层，2.true，禁止返回上一层，3.result,返回列表页面
        this.isDo = 'false';
        this.eventEmitSer.eventEmit.subscribe(function (value) {
            if (isNaN(value)) {
                _this.isDo = value;
            }
        });
    }
    //注册方法
    BackButtonService.prototype.registerBackButtonAction = function (tabRef) {
        var _this = this;
        this.platform.registerBackButtonAction(function () {
            var activeNav = _this.appCtrl.getActiveNavs()[0];
            //如果可以返回上一页，则执行pop
            if (activeNav.canGoBack()) {
                if (_this.isDo === 'false') {
                    activeNav.pop();
                }
                if (_this.isDo === 'result') {
                    var index = activeNav.length() - 2;
                    activeNav.remove(2, index);
                }
            }
            else {
                if (tabRef == null || tabRef._selectHistory[tabRef._selectHistory.length - 1] === tabRef.getByIndex(0).id) {
                    //执行退出
                    _this.showExit();
                }
                else {
                    //选择首页第一个的标签
                    tabRef.select(0);
                }
            }
        });
    };
    //退出应用方法
    BackButtonService.prototype.showExit = function () {
        var _this = this;
        //如果为true，退出
        if (this.backButtonPressed) {
            this.platform.exitApp();
        }
        else {
            //第一次按，弹出Toast
            this.toastCtrl.create({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'middle'
            }).present();
            //标记为true
            this.backButtonPressed = true;
            //两秒后标记为false，如果退出的话，就不会执行了
            setTimeout(function () { return _this.backButtonPressed = false; }, 2000);
        }
    };
    BackButtonService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_2__emit_service__["a" /* EmitService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
    ], BackButtonService);
    return BackButtonService;
}());

//# sourceMappingURL=backButton.service.js.map

/***/ }),

/***/ 333:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmitService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EmitService = /** @class */ (function () {
    //全局的监听事件
    function EmitService() {
        // 定义发射事件
        this.eventEmit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    EmitService.prototype.ngOnInit = function () {
    };
    EmitService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], EmitService);
    return EmitService;
}());

//# sourceMappingURL=emit.service.js.map

/***/ }),

/***/ 334:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_constants__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_http__ = __webpack_require__(88);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LoginService = /** @class */ (function () {
    function LoginService(http, nativeHttp) {
        this.http = http;
        this.nativeHttp = nativeHttp;
    }
    LoginService.prototype.loginpost = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/eaccount/Login', data);
    };
    LoginService.prototype.loginpostByNative = function (data) {
        return this.nativeHttp.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/eaccount/Login', data, { 'Content-Type': "application/json" });
    };
    LoginService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_http__["a" /* HTTP */]])
    ], LoginService);
    return LoginService;
}());

//# sourceMappingURL=login.service.js.map

/***/ }),

/***/ 377:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(382);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 382:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(708);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_tabs_tabs__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__ = __webpack_require__(376);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_course_course__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_mine_mine_module__ = __webpack_require__(709);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_components_module__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_learning_learning_module__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_keyboard__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_course_course_module__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_login_login_module__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_home_home_module__ = __webpack_require__(710);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__angular_common_http__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__core_auth_interceptor__ = __webpack_require__(712);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_login_login_service__ = __webpack_require__(334);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_home_home_service__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_storage__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__core_common_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_http__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_learning_learn_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__app_service__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__core_dataFormat_service__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__core_backButton_service__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__core_emit_service__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_file_opener__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_file__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__core_file_service__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__core_until_service__ = __webpack_require__(713);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
































var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_tabs_tabs__["a" /* TabsPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_16__angular_common_http__["c" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_14__pages_login_login_module__["LoginPageModule"],
                __WEBPACK_IMPORTED_MODULE_9__pages_mine_mine_module__["a" /* MineModule */],
                __WEBPACK_IMPORTED_MODULE_11__pages_learning_learning_module__["LearningPageModule"],
                __WEBPACK_IMPORTED_MODULE_13__pages_course_course_module__["CoursePageModule"],
                __WEBPACK_IMPORTED_MODULE_15__pages_home_home_module__["a" /* HomeModule */],
                __WEBPACK_IMPORTED_MODULE_20__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {
                    tabsHideOnSubPages: 'true',
                    backButtonText: '',
                    statusbarPadding: false,
                    iconModel: 'ios',
                    mode: 'ios',
                    modalEnter: 'modal-slide-in',
                    modalLeave: 'modal-slide-out',
                    swipeBackEnabled: false
                }, {
                    links: [
                        { loadChildren: '../pages/course/course.module#CoursePageModule', name: 'CoursePage', segment: 'course', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/learning/learning.module#LearningPageModule', name: 'LearningPage', segment: 'learning', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_10__components_components_module__["a" /* ComponentsModule */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_course_course__["a" /* CoursePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_tabs_tabs__["a" /* TabsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_12__ionic_native_keyboard__["a" /* Keyboard */],
                __WEBPACK_IMPORTED_MODULE_28__ionic_native_file_opener__["a" /* FileOpener */],
                __WEBPACK_IMPORTED_MODULE_29__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_18__pages_login_login_service__["a" /* LoginService */],
                __WEBPACK_IMPORTED_MODULE_19__pages_home_home_service__["a" /* HomeService */],
                __WEBPACK_IMPORTED_MODULE_21__core_common_service__["a" /* CommonService */],
                __WEBPACK_IMPORTED_MODULE_23__pages_learning_learn_service__["a" /* LearnService */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_http__["a" /* HTTP */],
                __WEBPACK_IMPORTED_MODULE_24__app_service__["a" /* AppService */],
                __WEBPACK_IMPORTED_MODULE_25__core_dataFormat_service__["a" /* DataFormatService */],
                __WEBPACK_IMPORTED_MODULE_26__core_backButton_service__["a" /* BackButtonService */],
                __WEBPACK_IMPORTED_MODULE_27__core_emit_service__["a" /* EmitService */],
                __WEBPACK_IMPORTED_MODULE_30__core_file_service__["a" /* FileService */],
                __WEBPACK_IMPORTED_MODULE_31__core_until_service__["a" /* UntilService */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_16__angular_common_http__["a" /* HTTP_INTERCEPTORS */], useClass: __WEBPACK_IMPORTED_MODULE_17__core_auth_interceptor__["a" /* InterceptorProvider */], multi: true,
                },
            ],
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 402:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScrollTabsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_observable_timer__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_observable_timer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_observable_timer__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ScrollTabsComponent = /** @class */ (function () {
    function ScrollTabsComponent() {
        var _this = this;
        this.done = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.selectIndex = 1;
        Object(__WEBPACK_IMPORTED_MODULE_1_rxjs_observable_timer__["timer"])(5000).subscribe(function (res) {
            var htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
            _this.itemWidth = htmlFontSize.split("px")[0] * 8;
            _this.spanWidth = _this.tabSpan.nativeElement.offsetWidth; //文字宽度
            _this.changeParent(_this.tabsList[0], 0);
            console.log(_this.tabsList);
        });
    }
    ScrollTabsComponent.prototype.ngOnChanges = function (change) {
        if (change['inputValue'] && change['inputValue'].currentValue.length > 0) {
            console.dir(change['inputValue'].currentValue);
        }
    };
    ScrollTabsComponent.prototype.changeParent = function (item, index) {
        this.selectIndex = index;
        this.tips.nativeElement.style.width = this.tabSpan.nativeElement.offsetWidth + 'px';
        // 自身div的一半 - 滑块的一半
        this.tips.nativeElement.style.left = this.itemWidth * (index) + (this.itemWidth - this.spanWidth) / 2 + 'px';
        this.done.emit(item);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewChild */])('tips'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], ScrollTabsComponent.prototype, "tips", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewChild */])('tabSpan'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], ScrollTabsComponent.prototype, "tabSpan", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], ScrollTabsComponent.prototype, "tabsList", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], ScrollTabsComponent.prototype, "done", void 0);
    ScrollTabsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'scroll-tabs',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/components/scroll-tabs/scroll-tabs.html"*/'<div #scrollTab class="scroll-tab">\n    <div #newContentParent class="news-content parent">\n        <div #tabsParent class="tabs-parent parent">\n            <div #tabsChildren *ngFor="let item of tabsList;let i = index;" (click)="changeParent(item,i)"\n                 class="tabs-children">\n                      <span #tabSpan [style.color]="selectIndex == i ? \'#333\':\'#999\'">\n                                    {{item.name}}\n                      </span>\n            </div>\n            <span #tips id="tips"></span>\n        </div>\n    </div>\n</div>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/components/scroll-tabs/scroll-tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], ScrollTabsComponent);
    return ScrollTabsComponent;
}());

//# sourceMappingURL=scroll-tabs.js.map

/***/ }),

/***/ 411:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CourseListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CourseListComponent = /** @class */ (function () {
    function CourseListComponent() {
        this.done = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        console.log('Hello CourseListComponent Component');
    }
    CourseListComponent.prototype.getItem = function (item) {
        this.done.emit(item);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], CourseListComponent.prototype, "list", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], CourseListComponent.prototype, "done", void 0);
    CourseListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'course-list',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/components/course-list/course-list.html"*/'<div class="learn-list">\n  <div class="course-item" *ngFor="let item of list" (click)="getItem(item)">\n    <div class="item-img">\n      <img [src]="item.ImageUrl">\n    </div>\n    <div class="item-desc">\n      <p>{{item.Title}}</p>\n      <div class="desc">\n        <span>{{item.SubjectName}}</span>\n        <span>评论</span>\n        <span>收藏</span>\n      </div>\n    </div>\n  </div>\n</div>\n\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/components/course-list/course-list.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], CourseListComponent);
    return CourseListComponent;
}());

//# sourceMappingURL=course-list.js.map

/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_service__ = __webpack_require__(61);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TreeListComponent = /** @class */ (function () {
    function TreeListComponent(appSer) {
        this.appSer = appSer;
        this.fileData = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    TreeListComponent.prototype.handle = function (e) {
        this.fileData.emit(e);
        this.appSer.setFile(e);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], TreeListComponent.prototype, "treeList", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", Object)
    ], TreeListComponent.prototype, "fileData", void 0);
    TreeListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'tree-list',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/components/tree-list/tree-list.html"*/'<div *ngFor="let item of treeList">\n    <p [ngStyle]="{\'padding-left\':(item.NodeLevel*5)+\'px\'}">{{item.NodeLevel}} 、{{item.title}}</p>\n    <tree-list *ngIf="item.children" [treeList]="item.children"></tree-list>\n    <div *ngFor="let item of item.files">\n        <p [ngStyle]="{\'padding-left\':(item.NodeLevel*5)+\'px\'}" (click)="handle(item)">{{item.filename}}</p>\n    </div>\n</div>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/components/tree-list/tree-list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__app_app_service__["a" /* AppService */]])
    ], TreeListComponent);
    return TreeListComponent;
}());

//# sourceMappingURL=tree-list.js.map

/***/ }),

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommonService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CommonService = /** @class */ (function () {
    function CommonService(toastCtrl) {
        this.toastCtrl = toastCtrl;
    }
    /**
     * 提示信息 位置：居中，延时2s
     * @param message  提示文字
     * @param callback  提示信息之后执行的方法
     */
    CommonService.prototype.toast = function (message, callback) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'middle',
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    };
    CommonService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["m" /* ToastController */]])
    ], CommonService);
    return CommonService;
}());

//# sourceMappingURL=common.service.js.map

/***/ }),

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AppService = /** @class */ (function () {
    function AppService() {
        this.mineSource = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"]({});
        this.mineInfo = this.mineSource.asObservable();
        this.fileSource = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"]({});
        this.fileInfo = this.fileSource.asObservable();
    }
    //个人信息
    AppService.prototype.setMine = function (value) {
        this.mineSource.next(value);
    };
    //文件信息
    AppService.prototype.setFile = function (value) {
        this.fileSource.next(value);
    };
    AppService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])()
    ], AppService);
    return AppService;
}());

//# sourceMappingURL=app.service.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LearnService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_constants__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_common_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_dataFormat_service__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_http__ = __webpack_require__(88);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LearnService = /** @class */ (function () {
    function LearnService(http, commonSer, dataFormatSer, nativeHttp) {
        this.http = http;
        this.commonSer = commonSer;
        this.dataFormatSer = dataFormatSer;
        this.nativeHttp = nativeHttp;
    }
    //获取课程列表
    LearnService.prototype.GetProductList = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetProductList', data);
    };
    LearnService.prototype.GetProductListByNative = function (data) {
        return this.nativeHttp.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetProductList', data, null);
    };
    //课程详情
    LearnService.prototype.GetProductById = function (params) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetProductById?pid=' + params);
    };
    LearnService.prototype.GetProductByIdByNative = function (params) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetProductById?pid=' + params, null, null);
    };
    //章节信息
    LearnService.prototype.GetAdminChapterListByProductID = function (params) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/CourseSeries/GetAdminChapterListByProductID?id=' + params);
    };
    LearnService.prototype.GetAdminChapterListByProductIDByNative = function (params) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/CourseSeries/GetAdminChapterListByProductID?id=' + params, null, null);
    };
    //关注教师
    LearnService.prototype.SaveSubscribe = function (data) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EStudentSubscribe/SaveSubscribe' + this.dataFormatSer.toQuery(data));
    };
    LearnService.prototype.SaveSubscribeByNative = function (data) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EStudentSubscribe/SaveSubscribe' + this.dataFormatSer.toQuery(data), null, null);
    };
    //取消关注教师
    LearnService.prototype.CancelSubscribe = function (params) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EStudentSubscribe/CancelSubscribe?TopicID=' + params);
    };
    LearnService.prototype.CancelSubscribeByNative = function (params) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EStudentSubscribe/CancelSubscribe?TopicID=' + params, null, null);
    };
    //相关课程
    LearnService.prototype.GetRelationProductList = function (data) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetRelationProductList' + this.dataFormatSer.toQuery(data));
    };
    LearnService.prototype.GetRelationProductListByNative = function (data) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/GetRelationProductList' + this.dataFormatSer.toQuery(data), null, null);
    };
    //获取评价信息
    LearnService.prototype.GetCommentSum = function (data) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/GetCommentSum' + this.dataFormatSer.toQuery(data));
    };
    LearnService.prototype.GetCommentSumByNative = function (data) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/GetCommentSum' + this.dataFormatSer.toQuery(data), null, null);
    };
    //报名课程
    LearnService.prototype.BuyProduct = function (data) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/BuyProduct' + this.dataFormatSer.toQuery(data));
    };
    LearnService.prototype.BuyProductByNative = function (data) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EProduct/BuyProduct' + this.dataFormatSer.toQuery(data), null, null);
    };
    //收藏课程
    LearnService.prototype.SaveCollectionByCSID = function (data) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/SaveCollectionByCSID' + this.dataFormatSer.toQuery(data));
    };
    LearnService.prototype.SaveCollectionByCSIDByNative = function (data) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/SaveCollectionByCSID' + this.dataFormatSer.toQuery(data), null, null);
    };
    //取消收藏
    LearnService.prototype.CancelCollectionByCSID = function (data) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/CancelCollectionByCSID' + this.dataFormatSer.toQuery(data));
    };
    LearnService.prototype.CancelCollectionByCSIDByNative = function (data) {
        return this.nativeHttp.get(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/CancelCollectionByCSID' + this.dataFormatSer.toQuery(data), null, null);
    };
    //提交评价
    LearnService.prototype.SaveComment = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/SaveComment', data);
    };
    LearnService.prototype.SaveCommentByNative = function (data) {
        return this.nativeHttp.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/SaveComment', data, null);
    };
    //查询评价
    LearnService.prototype.GetComment = function (data) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/GetComment', data);
    };
    LearnService.prototype.GetCommentByNative = function (data) {
        return this.nativeHttp.post(__WEBPACK_IMPORTED_MODULE_2__app_app_constants__["a" /* SERVER_API_URL */] + '/EComment/GetComment', data, null);
    };
    LearnService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__core_common_service__["a" /* CommonService */],
            __WEBPACK_IMPORTED_MODULE_4__core_dataFormat_service__["a" /* DataFormatService */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_http__["a" /* HTTP */]])
    ], LearnService);
    return LearnService;
}());

//# sourceMappingURL=learn.service.js.map

/***/ }),

/***/ 708:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(376);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(89);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, storage) {
        var _this = this;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.storage = storage;
        this.platform.ready().then(function () {
            _this.splashScreen.hide();
            _this.statusBar.show();
            _this.statusBar.overlaysWebView(false);
            _this.statusBar.backgroundColorByHexString('#343435');
            _this.statusBar.styleLightContent();
            _this.checkLogin();
        });
    }
    MyApp.prototype.checkLogin = function () {
        var auth = this.storage.get('Authorization');
        if (auth) {
            this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        }
        else {
            this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        }
    };
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 709:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MineModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mine__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mycollection_mycollection__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__my_course_my_course__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__notification_notification__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_navbar_navbar__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_components_module__ = __webpack_require__(78);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var MineModule = /** @class */ (function () {
    function MineModule() {
    }
    MineModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__mine__["a" /* MinePage */],
                __WEBPACK_IMPORTED_MODULE_3__mycollection_mycollection__["a" /* MycollectionPage */],
                __WEBPACK_IMPORTED_MODULE_4__my_course_my_course__["a" /* MyCoursePage */],
                __WEBPACK_IMPORTED_MODULE_5__notification_notification__["a" /* NotificationPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__mine__["a" /* MinePage */]),
                __WEBPACK_IMPORTED_MODULE_7__components_components_module__["a" /* ComponentsModule */],
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__mycollection_mycollection__["a" /* MycollectionPage */],
                __WEBPACK_IMPORTED_MODULE_4__my_course_my_course__["a" /* MyCoursePage */],
                __WEBPACK_IMPORTED_MODULE_5__notification_notification__["a" /* NotificationPage */],
                __WEBPACK_IMPORTED_MODULE_6__components_navbar_navbar__["a" /* NavbarComponent */],
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NO_ERRORS_SCHEMA */]]
        })
    ], MineModule);
    return MineModule;
}());

//# sourceMappingURL=mine.module.js.map

/***/ }),

/***/ 710:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__search_search__ = __webpack_require__(711);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var HomeModule = /** @class */ (function () {
    function HomeModule() {
    }
    HomeModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_3__search_search__["a" /* SearchPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__home__["a" /* HomePage */]),
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__search_search__["a" /* SearchPage */]
            ]
        })
    ], HomeModule);
    return HomeModule;
}());

//# sourceMappingURL=home.module.js.map

/***/ }),

/***/ 711:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SearchPage = /** @class */ (function () {
    function SearchPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    SearchPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SearchPage');
    };
    SearchPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-search',template:/*ion-inline-start:"/Users/ben/plan/SGMW/src/pages/home/search/search.html"*/'<!--\n  Generated template for the SearchPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>search</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"/Users/ben/plan/SGMW/src/pages/home/search/search.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], SearchPage);
    return SearchPage;
}());

//# sourceMappingURL=search.js.map

/***/ }),

/***/ 712:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InterceptorProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_throw__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_login_login__ = __webpack_require__(141);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var InterceptorProvider = /** @class */ (function () {
    function InterceptorProvider(storage, alertCtrl, commonSer, app) {
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.commonSer = commonSer;
        this.app = app;
    }
    // Intercepts all HTTP requests!
    InterceptorProvider.prototype.intercept = function (request, next) {
        var _this = this;
        var promise = this.storage.get('Authorization');
        return __WEBPACK_IMPORTED_MODULE_4_rxjs__["Observable"].fromPromise(promise)
            .mergeMap(function (token) {
            var clonedReq = _this.addToken(request, token);
            return next.handle(clonedReq).do(function (res) {
                if (res instanceof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpResponse */]) {
                    // this.message(res);
                }
            }, function (error) {
                var msg = error.message;
                var alert = _this.alertCtrl.create({
                    title: error.name,
                    message: msg,
                    buttons: ['OK']
                });
                alert.present();
                // Pass the error to the caller of the function
                return Object(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_throw__["_throw"])(error);
            }, function () {
            });
        });
    };
    // Adds the token to your headers if it exists
    InterceptorProvider.prototype.addToken = function (request, Authorization) {
        if (Authorization) {
            var clone = void 0;
            clone = request.clone({
                setHeaders: {
                    // "Accept": `application/json`,
                    'Content-Type': "application/json",
                    "Authorization": "" + Authorization
                }
            });
            return clone;
        }
        return request;
    };
    InterceptorProvider.prototype.message = function (data) {
        var code = data.body.code;
        switch (code) {
            case 401:
                console.log(data.body.message);
                this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */]);
                this.commonSer.toast(data.body.message);
                break;
            case 200:
                break;
        }
    };
    InterceptorProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_6__common_service__["a" /* CommonService */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* App */]])
    ], InterceptorProvider);
    return InterceptorProvider;
}());

//# sourceMappingURL=auth.interceptor.js.map

/***/ }),

/***/ 713:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UntilService; });
var UntilService = /** @class */ (function () {
    function UntilService() {
    }
    return UntilService;
}());

//# sourceMappingURL=until.service.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_navbar__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scroll_tabs_scroll_tabs__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__comment_comment__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__course_list_course_list__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tree_list_tree_list__ = __webpack_require__(412);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__comment_comment__["a" /* CommentComponent */],
                __WEBPACK_IMPORTED_MODULE_4__comment_comment__["a" /* CommentComponent */],
                __WEBPACK_IMPORTED_MODULE_1__navbar_navbar__["a" /* NavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_3__scroll_tabs_scroll_tabs__["a" /* ScrollTabsComponent */],
                __WEBPACK_IMPORTED_MODULE_5__course_list_course_list__["a" /* CourseListComponent */],
                __WEBPACK_IMPORTED_MODULE_6__tree_list_tree_list__["a" /* TreeListComponent */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicPageModule */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_4__comment_comment__["a" /* CommentComponent */],
                __WEBPACK_IMPORTED_MODULE_4__comment_comment__["a" /* CommentComponent */],
                __WEBPACK_IMPORTED_MODULE_1__navbar_navbar__["a" /* NavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_3__scroll_tabs_scroll_tabs__["a" /* ScrollTabsComponent */],
                __WEBPACK_IMPORTED_MODULE_5__course_list_course_list__["a" /* CourseListComponent */],
                __WEBPACK_IMPORTED_MODULE_6__tree_list_tree_list__["a" /* TreeListComponent */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__comment_comment__["a" /* CommentComponent */],
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_4__comment_comment__["a" /* CommentComponent */],
                __WEBPACK_IMPORTED_MODULE_1__navbar_navbar__["a" /* NavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_3__scroll_tabs_scroll_tabs__["a" /* ScrollTabsComponent */],
                __WEBPACK_IMPORTED_MODULE_5__course_list_course_list__["a" /* CourseListComponent */],
                __WEBPACK_IMPORTED_MODULE_6__tree_list_tree_list__["a" /* TreeListComponent */],
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NO_ERRORS_SCHEMA */]]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());

//# sourceMappingURL=components.module.js.map

/***/ })

},[377]);
//# sourceMappingURL=main.js.map