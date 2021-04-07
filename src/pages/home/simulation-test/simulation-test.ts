import {Component} from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {HomeService} from "../home.service";
import {CommonService} from "../../../core/common.service";
import {SimulationDoTestPage} from "./simulation-do-test/simulation-do-test";
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
        TotalQuestionNum: 0,
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

        if (this.exam.Exam.ExamTimer > 120) {
            this.commonSer.alert('考试最长时间为120分钟');
            return
        }
        if (this.brandList.length == 0) {
            this.commonSer.alert('请选择分类')
            return
        }

        return true;
    }

    addBrand() {
        let modal = this.modalCtrl.create(SubjectTreeComponent, {list: this.subjecTree, choice: this.brandList},
            {
                enterAnimation: 'modal-from-right-enter',
                leaveAnimation: 'modal-from-right-leave'
            });
        modal.onDidDismiss(res => {
            if (res) {
                this.brandList = res;
                const arr = this.brandList.map(e => e.value);
                this.exam.Exam.SubjectCode = arr.join(',')
            }
        })
        modal.present();
    }

    //add
    addHandleExam(params) {
        this.exam.Exam[params]++;
    }

    //remove
    removeHandleExam(params) {
        if (this.exam.Exam[params] > 0) {
            this.exam.Exam[params]--;
        }
    }

    addTotal() {
        this.exam.TotalQuestionNum++;
    }

    removeTotal() {
        if (this.exam.TotalQuestionNum > 0) {
            this.exam.TotalQuestionNum--;
        }
    }
}
