import { Component } from "@angular/core";
import {
  LoadingController,
  ModalController,
  NavController,
  NavParams
} from "ionic-angular";
import { defaultImg } from "../../../app/app.constants";
import { LearnService } from "../../learning/learn.service";
import { LogService } from "../../../service/log.service";
// import { Keyboard } from "@ionic-native/keyboard";
import { HomeService } from "../home.service";
import { CommonService } from "../../../core/common.service";

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
  todayHasCourse = false; // 当天是否有课程/考试
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private learSer: LearnService,
    public modalCtrl: ModalController,
    // private keyboard: Keyboard,
    public logSer: LogService,
    private commonSer: CommonService,
    public homeSer: HomeService,
    private loadCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    (function(doc, win) {
      var docEl = doc.documentElement,
        resizeEvt =
          "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function() {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = clientWidth / 37.5 + "px";
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    })(document, window);
    this.getStydyPlan();
  }

  changeMonth() {
    this.isThisMonth = !this.isThisMonth;
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
      //   console.log(888888, this.todayHasCourse,"calendarArr", this.calendarArr);
      if (this.todayHasCourse === true) this.getTodayCourse(this.now); // 循环日历完成后获取该天的 课程列表
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
      //   console.log("nextCalendarArr", this.nextCalendarArr);
    });
  }

  getItemCourse(item) {
    console.log("item", item);
    let y;
    let m;
    if(item.course === true || item.exam === true) {
        if (item.thisMonth) {
            let y = this.year;
            let m = this.month;
        } else {
            y = this.nextMonth.year;
            m = this.nextMonth.month;
        }
        let d = item.day >= 10 ? item.day : '0' + item.day;
        let date = new Date(`${y}-${m}-${d}`);
        this.getTodayCourse(date);
    }
  }

  // 获取该日的 课程/考试列表
  getTodayCourse(date) {
    console.log("getNowFormatDate", this.getFormatDate(date));
    let loading = this.loadCtrl.create({
        content: ""
      });
      loading.present();
    let data = {
      BeginDate: this.getFormatDate(date) + "T00:00:00",
      EndDate: this.getFormatDate(date) + "T23:59:59"
    };
    this.homeSer.getTodayCourse(data).subscribe(res => {
      console.log("getTodayCourse", res);
      loading.dismiss();
    });
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
        that.numTranWeek();
      }
      // 测试数据 是否 课程/考试
      let courseArr = [];
      if (courseObj && courseObj.length > 0) courseArr = courseObj;
      for (var i = 0; i < courseArr.length; i++) {
        if (courseArr[i].PlanDate === thisDay) {
          if (courseArr[i].ISCourse == true) {
            if (isNextMonth === "thisMonth" && !this.todayHasCourse)
              that.isTodayHasCourse();
            dayObj.course = true;
          }
          if (courseArr[i].ISExam == true) {
            if (isNextMonth === "thisMonth" && !this.todayHasCourse)
              that.isTodayHasCourse();
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
    console.log(lastDay);
    // 循环上个月
    // debugger
    let lastLength = 7 - (7 - Math.abs(firstIndex - 1)); // firstIndex - 1 可能为负数周几不能为负数
    console.log("lastLength", lastLength, firstIndex);
    for (var k = 0; k < lastLength; k++) {
      let day = lastDay - lastLength + 1 + k;
      calendar[0][k] = {
        day: day,
        course: false, // 课程
        exam: false, // 考试
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

  isTodayHasCourse() {
    this.todayHasCourse = true;
  }

  numTranWeek() {
    if (this.lableRC.activedCol === 0) this.week = "一";
    if (this.lableRC.activedCol === 1) this.week = "二";
    if (this.lableRC.activedCol === 2) this.week = "三";
    if (this.lableRC.activedCol === 3) this.week = "四";
    if (this.lableRC.activedCol === 4) this.week = "五";
    if (this.lableRC.activedCol === 5) this.week = "六";
    if (this.lableRC.activedCol === 6) this.week = "日";
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
}
