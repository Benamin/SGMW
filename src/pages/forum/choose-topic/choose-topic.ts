import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {ForumService} from "../forum.service";
import {Keyboard} from "@ionic-native/keyboard";

@Component({
    selector: 'page-choose-topic',
    templateUrl: 'choose-topic.html',
})
export class ChooseTopicPage {

    name;
    latelyList = [];
    topicList = [];
    topicType = 1;  // 2=热门话题  TopicType=2为热门话题 TopicCreateType=1为官方话题

    searchList = [];  //查询结果
    isSearch = false;
    isIncludes = false;

    constructor(public navCtrl: NavController,
                public forumSer: ForumService, public loadCtrl: LoadingController,
                public serve: ForumService, public keyboard: Keyboard,
                public navParams: NavParams) {
    }

    ionViewDidLoad() {
        const data = {}
        //最近使用的话题
        this.forumSer.LatelyTopic(data).subscribe((res) => {
            if (res) {
                this.latelyList = res.data;
            }
        })

        const data2 = {
            "Name": this.name,
            PageIndex: 1,
            PageSize: 1000,
        }
        this.serve.searchtopictag(data2).subscribe((res) => {
            if (res.code == 200) {
                this.topicList = res.data.Items;
            }
        })
    }


    search(event) {
        if (event && event.keyCode == 13) {
            const load = this.loadCtrl.create();
            load.present();
            const data2 = {
                "Name": this.name,
                PageIndex: 1,
                PageSize: 1000,
            }
            this.serve.searchtopictag(data2).subscribe((res) => {
                load.dismissAll();
                if (res.code == 200) {
                    this.searchList = res.data.Items;
                    this.isIncludes = res.data.Items.some(e => e.Name == this.name);
                    this.isSearch = true;
                }
            })
        }
    }

    showKey() {
        this.keyboard.show();
    }

    sevrData() {
        const data = {
            Name: this.name,
            TopicCreateType: 2,
            TopicType: 0
        }
        this.serve.addtopictag(data).subscribe(
            (res) => {
                if (res) {
                    this.navCtrl.getPrevious().data.topic = {
                        Name: this.name,
                        Id: res.data,
                        Selection:true
                    };
                    this.navCtrl.pop();
                }
            }
        )
    }

    selectTopic(item){
        const data =<any> {};
        if(item.TopicId){
            data.Id = item.TopicId;
            data.Name = item.TopicName;
        }else{
            data.Id = item.Id;
            data.Name = item.Name;
        }
        data.Selection = true;
        this.navCtrl.getPrevious().data.topic = data;
        this.navCtrl.pop();
    }

    backPop() {
        this.navCtrl.getPrevious().data.topic = null;
        this.navCtrl.pop();
    }

    cancelSearch() {
        this.name = "";
        this.searchList = [];
        this.isSearch = false;
    }

}
