import {Component} from "@angular/core";
import {
    LoadingController,
    ModalController,
    NavController,
    NavParams
} from "ionic-angular";
import {defaultImg} from "../../../app/app.constants";
import {LearnService} from "../../learning/learn.service";
import {LogService} from "../../../service/log.service";
// import { Keyboard } from "@ionic-native/keyboard";
import {HomeService} from "../home.service";
import {CommonService} from "../../../core/common.service";
import {FocusCoursePage} from "../../learning/focus-course/focus-course";
import {InnerCoursePage} from "../../learning/inner-course/inner-course";
import {CourseDetailPage} from "../../learning/course-detail/course-detail";
import {TestCenterPage} from "../test/test-center/test-center";
import {Storage} from "@ionic/storage";

@Component({
    selector: "page-study-plan",
    templateUrl: "study-plan.html"
})
export class StudyPlanPage {
    defaultImg = defaultImg;
    // 黄点代表考试 红点代表课程  若没时间的话全部做成红点也可以
    calendarArr = [];
    lableRC = {
        currentRow: null,
        currentCol: null,
        activedRow: null,
        activedCol: null
    };
    now = new Date();
    year = this.now.getFullYear();
    month = this.now.getMonth() + 1;
    nextMonth = {
        year: this.getNextMonth().getFullYear(),
        month: this.getNextMonth().getMonth() + 1
    };
    week = "";
    // 下个月数组
    nextCalendarArr = [];
    isThisMonth = true;
    once = false;
    // todayHasCourse = false; // 当天是否有课程/考试

    todayCourse = [];
    isLoad = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private learSer: LearnService,
                public modalCtrl: ModalController,
                private storage: Storage,
                public logSer: LogService,
                private commonSer: CommonService,
                public homeSer: HomeService,
                private loadCtrl: LoadingController) {
        this.storage.set('sgmwType', null);
    }

    ionViewDidLoad() {
        (function (doc, win) {
            var docEl = doc.documentElement,
                resizeEvt =
                    "orientationchange" in window ? "orientationchange" : "resize",
                recalc = function () {
                    var clientWidth = docEl.clientWidth;
                    if (!clientWidth) return;
                    docEl.style.fontSize = clientWidth / 37.5 + "px";
                };
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
            doc.addEventListener("DOMContentLoaded", recalc, false);
        })(document, window);
        this.getStydyPlan();
        this.getTheMonthCourse(this.now, false); // 循环日历完成后 若当天有课程/考试 获取该天的 课程列表
    }

    changeMonth() {
        if (this.isThisMonth) {
            this.getTheMonthCourse(this.getNextMonth(), true);
        } else {
            this.getTheMonthCourse(this.now, true);
        }
    }

    getStydyPlan() {
        let loading = this.loadCtrl.create({
            content: ""
        });
        loading.present();
        const data = {
            Year: this.year, //传入年份
            Month: this.month //传入月份
        };
        this.homeSer.StydyPlan(data).subscribe(res => {
            let courseArr = [];
            if (res.data.item && res.data.item.length > 0) {
                courseArr = res.data.item;
                for (var i = 0; i < res.data.item.length; i++) {
                    courseArr[i].PlanDate = new Date(courseArr[i].PlanDate).getDate();
                }
            }

            this.calendarArr = this.initCalendar(this.now, courseArr, "thisMonth");
            loading.dismiss();
            this.isLoad = true;
        });
        // 下个月的数据
        const dataNext = {
            Year: this.nextMonth.year, //传入年份
            Month: this.nextMonth.month //传入月份
        };
        this.homeSer.StydyPlan(dataNext).subscribe(res => {
            let courseArr = [];
            if (res.data.item && res.data.item.length > 0) {
                courseArr = res.data.item;
                for (var i = 0; i < res.data.item.length; i++) {
                    courseArr[i].PlanDate = new Date(courseArr[i].PlanDate).getDate();
                }
            }
            this.nextCalendarArr = this.initCalendar(
                this.getNextMonth(),
                courseArr,
                "nextMonth"
            );
        });
    }

    getItemCourse(item, rowIndex, colIndex) {
        // console.log('item, rowIndex, colIndex',JSON.stringify(item), rowIndex, colIndex);
        if (!item.canClick) return;
        let y;
        let m;

        if (item.course === true || item.exam === true) { // 有课程/考试的获取列表
            if (item.thisMonth) {
                y = this.year;
                m = this.month;
            } else {
                y = this.nextMonth.year;
                m = this.nextMonth.month;
            }
            let d
            if (item.day >= 10) d = item.day
            else d = '0' + item.day;
            let date = new Date(`${y}/${m}/${d}`);
            this.getTodayCourse(date);
            this.switchActived(item.thisMonth, rowIndex, colIndex);
        }
    }

    switchActived(isThisMonth, rowIndex, colIndex) {
        // calendarArr nextCalendarArr
        if (isThisMonth) {
            for (let i = 0; i < this.calendarArr.length; i++) {
                for (let j = 0; j < this.calendarArr[i].length; j++) {
                    this.calendarArr[i][j].actived = false;
                }
            }
            this.calendarArr[rowIndex][colIndex].actived = true;
        } else {
            for (let i = 0; i < this.nextCalendarArr.length; i++) {
                for (let j = 0; j < this.nextCalendarArr[i].length; j++) {
                    this.nextCalendarArr[i][j].actived = false;
                }
            }
            this.nextCalendarArr[rowIndex][colIndex].actived = true;
        }
    }

    clearActived() {
        for (var i = 0; i < this.calendarArr.length; i++) {
            for (var j = 0; j < this.calendarArr[i].length; j++) {
                this.calendarArr[i][j].actived = false;
            }
        }
        for (var a = 0; a < this.nextCalendarArr.length; a++) {
            for (var b = 0; b < this.nextCalendarArr[a].length; b++) {
                this.nextCalendarArr[a][b].actived = false;
            }
        }
    }

    // 获取该日的 课程/考试列表
    getTodayCourse(date) {
        // console.log("getNowFormatDate", this.getFormatDate(date));
        let data = {
            BeginDate: this.getFormatDate(date) + "T00:00:00",
            EndDate: this.getFormatDate(date) + "T23:59:59",
            Page: 1,
            PageSize: 100
        };
        this.getCourse(data, false);
    }

    // 获取该月的 课程/考试列表
    getTheMonthCourse(date, isChange) {
        let clickChange = false;
        if (isChange == true) clickChange = true;
        // console.log("getNowFormatDate", this.getFormatDate(date));
        var dateMonth = date.getMonth(); //当前月
        var dateYear = date.getFullYear(); //当前年
        //本月的开始时间
        var monthStartDate = new Date(dateYear, dateMonth, 1);
        //本月的结束时间
        var monthEndDate = new Date(dateYear, dateMonth + 1, 0);

        let data = {
            BeginDate: this.getFormatDate(monthStartDate) + "T00:00:00",
            EndDate: this.getFormatDate(monthEndDate) + "T23:59:59",
            Page: 1,
            PageSize: 100
        };
        this.getCourse(data, clickChange);
    }

    getCourse(data, clickChange) {
        let loading = this.loadCtrl.create({
            content: ""
        });
        loading.present();
        this.homeSer.getTodayCourse(data).subscribe(res => {
            let todayCourse = [];
            todayCourse = res.data.Items;
            if (todayCourse.length > 0) {
                for (var i = 0; i < todayCourse.length; i++) {
                    todayCourse[i].YMD = this.tranYMD(new Date(todayCourse[i].PlanDate)); //  '2020' + '年' +  2 + '月' + '3' + '日';
                    todayCourse[i].week = this.numTranWeek(new Date(todayCourse[i].PlanDate).getDay()); // this.numTranWeek(0);
                }
            }
            this.todayCourse = todayCourse
            this.isLoad = true;
            loading.dismiss();
            if (clickChange) {
                this.clearActived();
                this.isThisMonth = !this.isThisMonth;
            }
        });
    }

    tranYMD(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) month = "0" + month;
        if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
        var currentdate = year + '年' + month + '月' + strDate + '日';
        return currentdate;
    }

    //获取课程详情
    getCourseDetailById(id) {
        this.learSer.GetProductById(id).subscribe(
            (res) => {
                if (res.data) {
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
            this.navCtrl.push(CourseDetailPage, {id: e.Id});
        }
    }

    // 时间戳转 年月日
    getFormatDate(date) {
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    // 循环日历数组 参数1： 当月的某时间， 参数2： 课程/考试对应的天数对象。
    initCalendar(date, courseObj, isNextMonth) {
        const now = date;
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1); // 输入该时间的月的第一条是周几
        const endDay = new Date(
            now.getMonth() === 11
                ? new Date(now.getFullYear() + 1, 0, 1).getTime() - 8640000
                : new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() - 8640000
        );
        // let month = now.getMonth() + 1; // 全局月
        let row = 0;
        let col = firstDay.getDay() - 1;
        const calendar = [[]];
        let thisDay = 1;
        const end = endDay.getDate();
        // console.log(end);
        let that = this;
        while (thisDay <= end) {
            var dayObj = {
                day: thisDay,
                course: false, // 课程
                exam: false, // 考试
                canClick: true,
                thisMonth: false, // 是否本月 不是本月则不可选
                current: false, // 是否今天
                actived: false // 是否选中该天
            };
            //   console.log(col, row, calendar);
            if (col < 0) col = 7 + col; // 第一天若是负数
            if (col === 7) {
                row++;
                col = 0;
                calendar[row] = [dayObj];
            } else {
                calendar[row][col] = dayObj;
            }
            if (isNextMonth === "thisMonth") {
                dayObj.thisMonth = true;
            }
            // 判断是否今天 是则 current: true, actived: true
            if (thisDay === now.getDate()) {
                // 现在日期在日历的行/列 选择的日期在日历的行/列
                if (isNextMonth === "thisMonth") {
                    this.once = true;
                    dayObj.current = true;
                    dayObj.actived = true;
                    that.lableRC.currentRow = row;
                    that.lableRC.currentCol = col;
                    that.lableRC.activedRow = row;
                    that.lableRC.activedCol = col;
                }

                // dayObj.course = true;
                // dayObj.exam = true;
                // console.log(999, that.lableRC.currentRow, that.lableRC.currentCol)
            }
            // 测试数据 是否 课程/考试
            let courseArr = [];
            if (courseObj && courseObj.length > 0) courseArr = courseObj;
            for (var i = 0; i < courseArr.length; i++) {
                if (courseArr[i].PlanDate === thisDay) {
                    if (courseArr[i].ISCourse == true) {
                        dayObj.course = true;
                    }
                    if (courseArr[i].ISExam == true) {
                        dayObj.exam = true;
                    }
                    // if (thisDay === now.getDate()) { // 是当天 并且有课程 默认获 当天的取课程列表
                    //     that.isTodayHasCourse();
                    // }
                }
            }
            thisDay++;
            col++;
        }

        let firstIndex = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
        var myDate = new Date(now.getFullYear(), now.getMonth(), 0);
        var lastDay = myDate.getDate(); //上个月的最后一天
        // console.log(lastDay);
        // 循环上个月
        // debugger
        let lastLength = 7 - (7 - Math.abs(firstIndex - 1)); // firstIndex - 1 可能为负数周几不能为负数
        // console.log("lastLength", lastLength, firstIndex);
        for (var k = 0; k < lastLength; k++) {
            let day = lastDay - lastLength + 1 + k;
            calendar[0][k] = {
                day: day,
                course: false, // 课程
                exam: false, // 考试
                canClick: false,
                thisMonth: false, // 不是本月则不可选
                current: false, // 是否今天
                actived: false // 是否选中该天
            };
        }
        // 剩余部分循环下个月
        var nextLength = 7 - ((end + lastLength) % 7);
        var nextDay = 1;
        for (var j = 0; j < nextLength; j++) {
            calendar[row][col] = {
                day: nextDay,
                course: false, // 课程
                exam: false, // 考试
                canClick: false,
                thisMonth: false, // 不是本月则不可选
                current: false, // 是否今天
                actived: false // 是否选中该天
            };
            nextDay++;
            col++;
        }

        // console.log(calendar); // 完整的 日历二维数组
        return calendar;
    }

    // isTodayHasCourse() {
    //     this.todayHasCourse = true;
    // }

    numTranWeek(num) {
        let week = "";
        if (num === 0) week = "日";
        if (num === 1) week = "一";
        if (num === 2) week = "二";
        if (num === 3) week = "三";
        if (num === 4) week = "四";
        if (num === 5) week = "五";
        if (num === 6) week = "六";

        return week;
    }

    // 下个月
    getNextMonth() {
        let now = new Date();
        var month = now.getMonth() + 1;
        let year = now.getFullYear();
        let monthStr;
        if (month === 12) {
            year += 1;
            monthStr = "01";
        } else {
            month += 1;
            monthStr = month < 10 ? "0" + month : month;
        }
        return new Date(`${year}-${monthStr}-01`);
        // console.log("this.nextMonth", new Date(`${year}-${monthStr}-01`));
    }

    //考试中心
    goTest() {
        this.navCtrl.push(TestCenterPage);
    }
}
