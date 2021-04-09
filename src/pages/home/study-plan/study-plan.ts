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
    year;
    month;
    week = "";
    once = false;
    todayCourse = [];
    isLoad = false;
    initYearMonth = <any>{};

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
        if(this.navParams.get('CrateTime') && this.navParams.get('CrateTime').length > 0) {

            let CrateTime = this.navParams.get('CrateTime');
            let YMDArr = CrateTime.split(' ')[0].split('-');
            let y = YMDArr[0];
            let m = YMDArr[1];
            let d = YMDArr[2];
            this.now = new Date(`${y}/${m}/${d}`);
            this.year = this.now.getFullYear();
            this.month = this.now.getMonth() + 1;
        } else {
            this.year = this.now.getFullYear();
            this.month = this.now.getMonth() + 1;
        }
        // 存初始 进入的时间YMD 同年月 显示页面右上角的日期
        this.initYearMonth.year = this.year;
        this.initYearMonth.month = this.month;
        this.initYearMonth.day = this.now.getDate();
        this.getStydyPlan();
        this.getTheMonthCourse(this.now); // 循环日历完成后 若当天有课程/考试 获取该天的 课程列表
    }

    changeMonth(status) {
        if(status === 'last') {
            this.now = this.getLastMonth();
        }
        if(status === 'next') {
            this.now = this.getNextMonth();
        }
        this.year = this.now.getFullYear();
        this.month = this.now.getMonth() + 1;

        this.getStydyPlan();
        this.getTheMonthCourse(this.now); // 循环日历完成后
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

            this.calendarArr = this.initCalendar(this.now, courseArr);
            loading.dismiss();
            this.isLoad = true;
        });
    }

    getItemCourse(item, rowIndex, colIndex) {
        if (!item.canClick) return;
        let y;
        let m;
        this.switchActived( rowIndex, colIndex);
        if (!item.course && !item.exam) this.todayCourse = [];
        if (item.course === true || item.exam === true) { // 有课程/考试的获取列表
            y = this.year;
            m = this.month;
            let d
            if (item.day >= 10) d = item.day
            else d = '0' + item.day;
            let date = new Date(`${y}/${m}/${d}`);
            this.getTodayCourse(date);
        }
    }

    switchActived(rowIndex, colIndex) {
        for (let i = 0; i < this.calendarArr.length; i++) {
            for (let j = 0; j < this.calendarArr[i].length; j++) {
                this.calendarArr[i][j].actived = false;
            }
        }
        this.calendarArr[rowIndex][colIndex].actived = true;
    }

    clearActived() {
        for (var i = 0; i < this.calendarArr.length; i++) {
            for (var j = 0; j < this.calendarArr[i].length; j++) {
                this.calendarArr[i][j].actived = false;
            }
        }
    }

    // 获取该日的 课程/考试列表
    getTodayCourse(date) {
        let data = {
            BeginDate: this.getFormatDate(date) + "T00:00:00",
            EndDate: this.getFormatDate(date) + "T23:59:59",
            Page: 1,
            PageSize: 100
        };
        this.getCourse(data);
    }

    // 获取该月的 课程/考试列表
    getTheMonthCourse(date) {
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
        this.getCourse(data);
    }

    getCourse(data) {
        this.clearActived();
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
            this.navCtrl.push(CourseDetailPage, {id: e.Id, StructureType: e.StructureType});
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
    initCalendar(date, courseObj) {
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

            if (col < 0) col = 7 + col; // 第一天若是负数
            if (col === 7) {
                row++;
                col = 0;
                calendar[row] = [dayObj];
            } else {
                calendar[row][col] = dayObj;
            }
            if (this.initYearMonth && this.initYearMonth.year === this.year && this.initYearMonth.month === this.month) {
                dayObj.thisMonth = true;
            }
            // 判断是否今天 是则 current: true, actived: true
            if (thisDay === now.getDate()) {
                // 现在日期在日历的行/列 选择的日期在日历的行/列
                if (this.initYearMonth && this.initYearMonth.year === this.year && this.initYearMonth.month === this.month) {
                    this.once = true;
                    dayObj.current = true;
                    dayObj.actived = true;
                    that.lableRC.currentRow = row;
                    that.lableRC.currentCol = col;
                    that.lableRC.activedRow = row;
                    that.lableRC.activedCol = col;
                }
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
                }
            }
            thisDay++;
            col++;
        }

        let firstIndex = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
        var myDate = new Date(now.getFullYear(), now.getMonth(), 0);
        var lastDay = myDate.getDate(); //上个月的最后一天
        // 循环上个月
        let lastLength = 7 - (7 - Math.abs(firstIndex - 1)); // firstIndex - 1 可能为负数周几不能为负数
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
        let nextNum = 7;
        if (((end + lastLength) % 7) !== 0) nextNum = ((end + lastLength) % 7);
        var nextLength = 7 - nextNum;
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
        return calendar;
    }

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

    // 上个月的 时间戳
    getLastMonth() {
        let now = this.now;
        var month = now.getMonth() + 1;
        let year = now.getFullYear();
        let day = 1
        let monthStr;
        if (month === 1) {
            year -= 1;
            monthStr = "12";
        } else {
            month -= 1;
            monthStr = month < 10 ? "0" + month : month;
        }
        if (this.initYearMonth && this.initYearMonth.year === year && this.initYearMonth.month === parseInt(monthStr) && this.initYearMonth.day) day = this.initYearMonth.day;
        return new Date(`${year}/${monthStr}/${day}`);
    }
    // 下个月 时间戳
    getNextMonth() {
        let now = this.now;
        var month = now.getMonth() + 1;
        let year = now.getFullYear();
        let day = 1;
        let monthStr;
        if (month === 12) {
            year += 1;
            monthStr = "01";
            month = 1;
        } else {
            month += 1;
            monthStr = month < 10 ? "0" + month : month;
        }
        if (this.initYearMonth && this.initYearMonth.year === year && this.initYearMonth.month === parseInt(monthStr) && this.initYearMonth.day) day = this.initYearMonth.day;
        return new Date(`${year}/${monthStr}/${day}`);
    }

    //考试中心
    goTest() {
        this.navCtrl.push(TestCenterPage);
    }
}
