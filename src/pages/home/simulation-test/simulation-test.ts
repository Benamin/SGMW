import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {HomeService} from "../home.service";
import {CommonService} from "../../../core/common.service";
import {DoTestPage} from "../test/do-test/do-test";
import {SimulationDoTestPage} from "./simulation-do-test/simulation-do-test";
import {TreeModel} from 'ng2-tree';
import {QIndexComponent} from "../../../components/q-index/q-index";
import {SubjectTreeComponent} from "../../../components/subject-tree/subject-tree";

@Component({
    selector: 'page-simulation-test',
    templateUrl: 'simulation-test.html',
})
export class SimulationTestPage {

    subjecTree = [];
    brandList = [];
    isDisable = false;

    exam = {
        Exam: {
            SubjectCode: "fwyy,gwnl,fwjlcj,jc,cs",
            ExamTimer: 0
        },
        PaperRule: {
            ChoiceNum: 0,
            ChoiceScore: 0,
            JudgeNum: 0,
            JudgeScore: 0,
            MultipleNum: 0,
            MultipleScore: 0,
            FillNum: 0,
            FillScore: 0
        }
    }

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private modalCtrl: ModalController, private loadCtrl: LoadingController,
                public homeSer: HomeService, public commonSer: CommonService,
    ) {
    }

    ionViewDidLoad() {
        this.homeSer.getSubjectTree().subscribe(
            (res) => {
                if (res.data) {
                    this.subjecTree = res.data;
                }
            }
        )
    }


    //创建考试
    createTeat() {
        if (!this.isCheck()) return;
        if (this.isDisable) {
            return
        }
        this.isDisable = true;
        const load = this.loadCtrl.create({
            content: '创建考试中...'
        });
        load.present();
        this.homeSer.InsertExercise(this.exam).subscribe(
            (res) => {
                if (res.data) {
                    this.navCtrl.push(SimulationDoTestPage, {Fid: res.data.Fid});
                } else {
                    this.commonSer.alert(res.message);
                }
                load.dismiss();
                this.isDisable = false;
            }
        )
    }

    isCheck() {
        if ((this.exam.PaperRule.MultipleNum + this.exam.PaperRule.JudgeNum
            + this.exam.PaperRule.ChoiceNum) > 100) {
            this.commonSer.alert('总题目数量不能超过100');
            return
        }
        if ((this.exam.PaperRule.MultipleNum + this.exam.PaperRule.JudgeNum
            + this.exam.PaperRule.ChoiceNum) < 1) {
            this.commonSer.alert('至少有一道题目');
            return
        }
        if (this.exam.Exam.ExamTimer > 120) {
            this.commonSer.alert('考试最长时间为120分钟');
            return
        }
        if ((this.exam.PaperRule.MultipleNum > 1 && this.exam.PaperRule.MultipleScore < 1) ||
            (this.exam.PaperRule.MultipleNum < 1 && this.exam.PaperRule.MultipleScore > 0) ||
            (this.exam.PaperRule.JudgeNum > 1 && this.exam.PaperRule.JudgeScore < 1) ||
            (this.exam.PaperRule.JudgeNum < 1 && this.exam.PaperRule.JudgeScore > 0) ||
            (this.exam.PaperRule.ChoiceNum > 1 && this.exam.PaperRule.ChoiceScore < 1) ||
            (this.exam.PaperRule.ChoiceNum < 1 && this.exam.PaperRule.ChoiceScore > 0)
        ) {
            this.commonSer.alert('题目规则设置错误')
            return
        }
        if (this.brandList.length == 0) {
            this.commonSer.alert('请选择分类')
            return
        }

        return true;
    }

    addBrand() {
        let modal = this.modalCtrl.create(SubjectTreeComponent, {list: this.subjecTree},
            {
                enterAnimation: 'modal-from-right-enter',
                leaveAnimation: 'modal-from-right-leave'
            });
        modal.onDidDismiss(res => {
            if (res) {
                this.brandList = res;
            }
        })
        modal.present();
    }

}
